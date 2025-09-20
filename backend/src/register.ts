import mongoose, { Schema, Document } from 'mongoose';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { sendWelcomeEmail } from './utils/mail';

dotenv.config();

declare global {
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

export async function connectToMongoDB(): Promise<typeof mongoose> {
  if (global.mongooseConnection?.conn) {
    return global.mongooseConnection.conn;
  }
  if (!global.mongooseConnection) {
    global.mongooseConnection = { conn: null, promise: null };
  }
  if (!global.mongooseConnection.promise) {
    global.mongooseConnection.promise = (async (): Promise<typeof mongoose> => {
      mongoose.set('debug', process.env.MONGOOSE_DEBUG === 'true');
      while (true) {
        try {
          const instance = await mongoose.connect(process.env.MONGO_URI as string, {
            dbName: 'discovery_adcet',
            serverSelectionTimeoutMS: 60000,
            socketTimeoutMS: 60000,
            connectTimeoutMS: 60000,
            heartbeatFrequencyMS: 300000,
            maxPoolSize: 10,
            minPoolSize: 2,
            retryWrites: true,
            retryReads: true,
            w: 'majority'
          });
          global.mongooseConnection!.conn = instance;
          console.log('Connected to MongoDB database: discovery_adcet');
          return instance;
        } catch (err) {
          console.error('MongoDB connection failed, retrying in 5s', err);
          await new Promise(res => setTimeout(res, 5000));
        }
      }
    })();
  }
  return global.mongooseConnection.promise as Promise<typeof mongoose>;
}

interface RegistrationDoc extends Document {
  _id: mongoose.Types.ObjectId;
  registrationId: number;
  leaderName: string;
  leaderEmail: string;
  leaderMobile: string;
  leaderCollege: string;
  leaderDepartment: string;
  leaderYear: string;
  leaderCity: string;
  selectedEvent: string;
  paperPresentationDept?: string;
  participationType: 'solo' | 'team';
  teamSize: number;
  teamMembers: Array<{
    name: string;
    mobile: string;
    email: string;
    college: string;
  }>;
  paymentId: string;
  orderId: string;
  signature: string;
  totalFee: number;
  createdAt: Date;
}

const teamMemberSchema = new Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  college: { type: String, required: true }
});

const registrationSchema = new Schema<RegistrationDoc>({
  registrationId: { type: Number, unique: true },
  leaderName: { type: String, required: true },
  leaderEmail: { type: String, required: true },
  leaderMobile: { type: String, required: true },
  leaderCollege: { type: String, required: true },
  leaderDepartment: { type: String, required: true },
  leaderYear: { type: String, required: true },
  leaderCity: { type: String, required: true },
  selectedEvent: { type: String, required: true },
  paperPresentationDept: { type: String },
  participationType: { type: String, enum: ['solo', 'team'], required: true },
  teamSize: { type: Number, required: true },
  teamMembers: { type: [teamMemberSchema], default: [] },
  paymentId: { type: String, required: true },
  orderId: { type: String, required: true },
  signature: { type: String, required: true },
  totalFee: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Registration = mongoose.model<RegistrationDoc>('Registration', registrationSchema, 'registrations');

// Function to get the next registration ID
async function getNextRegistrationId(): Promise<number> {
  const lastRegistration = await Registration.findOne({}, {}, { sort: { 'registrationId': -1 } });
  if (!lastRegistration || !lastRegistration.registrationId) {
    return 1001; // Start from 1001 for easy identification
  }
  return lastRegistration.registrationId + 1;
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    await connectToMongoDB();
    const { 
      leaderName, leaderEmail, leaderMobile, leaderCollege, leaderDepartment, 
      leaderYear, leaderCity, selectedEvent, paperPresentationDept, 
      participationType, teamSize, teamMembers, paymentId, orderId, signature, totalFee
    } = req.body;
    
    // Mandatory payment validation
    if (!paymentId || !orderId || !signature) {
      return res.status(400).json({ 
        success: false, 
        error: 'Payment details are required. Registration cannot proceed without completing payment.' 
      });
    }

    // Validate payment IDs format (basic check)
    if (!paymentId.startsWith('pay_') || !orderId.startsWith('order_')) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid payment details. Please complete payment through the authorized gateway.' 
      });
    }

    // Validate total fee
    if (!totalFee || totalFee <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid fee amount. Registration requires payment.' 
      });
    }
    
    const normalizedData = {
      leaderName: leaderName.trim(),
      leaderEmail: leaderEmail.trim().toLowerCase(),
      leaderMobile: leaderMobile.trim(),
      leaderCollege: leaderCollege.trim(),
      leaderDepartment: leaderDepartment.trim(),
      leaderYear: leaderYear.trim(),
      leaderCity: leaderCity.trim(),
      selectedEvent: selectedEvent.trim(),
      paperPresentationDept: paperPresentationDept?.trim() || '',
      participationType,
      teamSize: Number(teamSize),
      teamMembers: (teamMembers || []).map((member: any) => ({
        name: member.name.trim(),
        mobile: member.mobile.trim(),
        email: member.email.trim().toLowerCase(),
        college: member.college.trim()
      })),
      paymentId,
      orderId,
      signature,
      totalFee: Number(totalFee)
    };
    
    // Generate next registration ID
    const registrationId = await getNextRegistrationId();
    
    const registration = new Registration({
      ...normalizedData,
      registrationId
    });
    let saved: RegistrationDoc | undefined;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        saved = await registration.save();
        break;
      } catch (saveErr) {
        console.error(`Registration save attempt ${attempt} failed:`, saveErr);
        if (attempt === 3) throw saveErr;
        await new Promise(res => setTimeout(res, 1000 * attempt));
      }
    }
    
    if (!saved) {
      throw new Error('Failed to save registration after multiple attempts');
    }
    
    // Send welcome email
    await sendWelcomeEmail(
      saved.leaderEmail,
      saved.registrationId.toString(),
      saved.leaderName,
      saved.leaderYear,
      saved.leaderMobile,
      saved.selectedEvent,
      saved.leaderCollege
    );
    
    res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Failed to register user' });
  }
};