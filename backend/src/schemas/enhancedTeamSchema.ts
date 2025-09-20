// Enhanced team member schemas for Discovery 2K25
import mongoose, { Schema, Document } from 'mongoose';

// Emergency contact schema
const emergencyContactSchema = new Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  relation: { 
    type: String, 
    enum: ['Parent', 'Guardian', 'Sibling', 'Relative', 'Friend', 'Other'],
    required: true 
  }
}, { _id: false });

// Enhanced team member schema with additional fields
const enhancedTeamMemberSchema = new Schema({
  // Basic required fields (compatible with existing schema)
  name: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  college: { type: String, required: true, trim: true },
  
  // Additional fields for enhanced data storage
  department: { 
    type: String, 
    enum: [
      'Aeronautical Engineering',
      'Mechanical Engineering', 
      'Electrical Engineering',
      'Civil Engineering',
      'Computer Science Engineering',
      'AI & Data Science',
      'IoT & Cyber Security',
      'Business Administration',
      'Food Technology',
      'Other'
    ]
  },
  year: { 
    type: String, 
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'PhD']
  },
  city: { type: String, trim: true },
  studentId: { type: String, trim: true },
  
  // Emergency contact information
  emergencyContact: emergencyContactSchema,
  
  // Event-specific preferences
  dietaryRestrictions: [{
    type: String,
    enum: ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Nut allergies', 'Other allergies', 'None']
  }],
  tshirtSize: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  accommodationNeeded: { type: Boolean, default: false },
  
  // Participation history
  previousParticipation: [{ type: String }],
  
  // Metadata
  registrationDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'], 
    default: 'pending' 
  }
}, { _id: false });

// Enhanced team schema
export interface EnhancedTeamDoc extends Document {
  _id: mongoose.Types.ObjectId;
  teamId: string;
  teamName?: string;
  
  // Leader information (enhanced)
  leader: {
    name: string;
    email: string;
    mobile: string;
    college: string;
    department: string;
    year: string;
    city: string;
    studentId?: string;
    emergencyContact?: {
      name: string;
      mobile: string;
      relation: string;
    };
    dietaryRestrictions?: string[];
    tshirtSize?: string;
    accommodationNeeded?: boolean;
    previousParticipation?: string[];
  };
  
  // Team members (enhanced)
  members: Array<{
    name: string;
    mobile: string;
    email: string;
    college: string;
    department?: string;
    year?: string;
    city?: string;
    studentId?: string;
    emergencyContact?: {
      name: string;
      mobile: string;
      relation: string;
    };
    dietaryRestrictions?: string[];
    tshirtSize?: string;
    accommodationNeeded?: boolean;
    previousParticipation?: string[];
    registrationDate?: Date;
    status?: string;
  }>;
  
  // Event and registration details
  selectedEvent: string;
  paperPresentationDept?: string;
  participationType: 'solo' | 'team';
  teamSize: number;
  maxTeamSize: number;
  
  // Payment information
  paymentId: string;
  orderId: string;
  signature: string;
  totalFee: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  
  // Team status and metadata
  teamStatus: 'forming' | 'complete' | 'registered' | 'cancelled';
  registrationDate: Date;
  lastUpdated: Date;
  createdAt: Date;
  
  // Additional metadata
  notes?: string;
  specialRequirements?: string[];
}

const enhancedTeamSchema = new Schema<EnhancedTeamDoc>({
  teamId: { type: String, unique: true, required: true },
  teamName: { type: String, trim: true },
  
  // Leader information
  leader: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, trim: true },
    college: { type: String, required: true, trim: true },
    department: { 
      type: String, 
      required: true,
      enum: [
        'Aeronautical Engineering',
        'Mechanical Engineering', 
        'Electrical Engineering',
        'Civil Engineering',
        'Computer Science Engineering',
        'AI & Data Science',
        'IoT & Cyber Security',
        'Business Administration',
        'Food Technology',
        'Other'
      ]
    },
    year: { 
      type: String, 
      required: true,
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'PhD']
    },
    city: { type: String, required: true, trim: true },
    studentId: { type: String, trim: true },
    emergencyContact: emergencyContactSchema,
    dietaryRestrictions: [{
      type: String,
      enum: ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Nut allergies', 'Other allergies', 'None']
    }],
    tshirtSize: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    accommodationNeeded: { type: Boolean, default: false },
    previousParticipation: [{ type: String }]
  },
  
  // Team members
  members: [enhancedTeamMemberSchema],
  
  // Event details
  selectedEvent: { type: String, required: true },
  paperPresentationDept: { type: String },
  participationType: { type: String, enum: ['solo', 'team'], required: true },
  teamSize: { type: Number, required: true, min: 1 },
  maxTeamSize: { type: Number, required: true, min: 1, max: 6 },
  
  // Payment information
  paymentId: { type: String, required: true },
  orderId: { type: String, required: true },
  signature: { type: String, required: true },
  totalFee: { type: Number, required: true, min: 0 },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  },
  
  // Team status
  teamStatus: { 
    type: String, 
    enum: ['forming', 'complete', 'registered', 'cancelled'], 
    default: 'forming' 
  },
  
  // Timestamps
  registrationDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  
  // Additional fields
  notes: { type: String },
  specialRequirements: [{ type: String }]
});

// Add indexes for better performance
enhancedTeamSchema.index({ teamId: 1 });
enhancedTeamSchema.index({ selectedEvent: 1 });
enhancedTeamSchema.index({ 'leader.email': 1 });
enhancedTeamSchema.index({ createdAt: -1 });
enhancedTeamSchema.index({ teamStatus: 1 });
enhancedTeamSchema.index({ paymentStatus: 1 });

// Pre-save middleware to update lastUpdated timestamp
enhancedTeamSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Static methods for the enhanced team model
enhancedTeamSchema.statics.findByEvent = function(eventId: string) {
  return this.find({ selectedEvent: eventId });
};

enhancedTeamSchema.statics.findByDepartment = function(department: string) {
  return this.find({ 'leader.department': department });
};

enhancedTeamSchema.statics.findByPaymentStatus = function(status: string) {
  return this.find({ paymentStatus: status });
};

enhancedTeamSchema.statics.getStatistics = async function() {
  const pipeline = [
    {
      $group: {
        _id: null,
        totalTeams: { $sum: 1 },
        totalParticipants: { $sum: '$teamSize' },
        totalRevenue: { $sum: '$totalFee' },
        avgTeamSize: { $avg: '$teamSize' },
        soloParticipations: {
          $sum: { $cond: [{ $eq: ['$participationType', 'solo'] }, 1, 0] }
        },
        teamParticipations: {
          $sum: { $cond: [{ $eq: ['$participationType', 'team'] }, 1, 0] }
        }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalTeams: 0,
    totalParticipants: 0,
    totalRevenue: 0,
    avgTeamSize: 0,
    soloParticipations: 0,
    teamParticipations: 0
  };
};

// Create the enhanced team model
export const EnhancedTeam = mongoose.model<EnhancedTeamDoc>('EnhancedTeam', enhancedTeamSchema, 'enhanced_teams');

// Utility functions for migrating existing data
export const migrateRegistrationToEnhancedTeam = async (registration: any): Promise<EnhancedTeamDoc> => {
  const enhancedTeam = new EnhancedTeam({
    teamId: `TEAM_${registration._id}`,
    teamName: `${registration.leaderName}'s Team`,
    
    leader: {
      name: registration.leaderName,
      email: registration.leaderEmail,
      mobile: registration.leaderMobile,
      college: registration.leaderCollege,
      department: registration.leaderDepartment,
      year: registration.leaderYear,
      city: registration.leaderCity
    },
    
    members: registration.teamMembers?.map((member: any) => ({
      name: member.name,
      mobile: member.mobile,
      email: member.email,
      college: member.college,
      department: registration.leaderDepartment, // Assume same as leader
      year: registration.leaderYear, // Assume same as leader
      city: registration.leaderCity, // Assume same as leader
      registrationDate: registration.createdAt || new Date(),
      status: 'confirmed'
    })) || [],
    
    selectedEvent: registration.selectedEvent,
    paperPresentationDept: registration.paperPresentationDept,
    participationType: registration.participationType,
    teamSize: registration.teamSize,
    maxTeamSize: 4, // Default, should be determined by event
    
    paymentId: registration.paymentId,
    orderId: registration.orderId,
    signature: registration.signature,
    totalFee: registration.totalFee,
    paymentStatus: 'paid', // Assume paid if registration exists
    
    teamStatus: 'registered',
    registrationDate: registration.createdAt || new Date(),
    createdAt: registration.createdAt || new Date()
  });
  
  return enhancedTeam;
};

export { enhancedTeamMemberSchema, emergencyContactSchema };