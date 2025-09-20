"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.Registration = void 0;
exports.connectToMongoDB = connectToMongoDB;
const mongoose_1 = __importStar(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const mail_1 = require("./utils/mail");
dotenv_1.default.config();
async function connectToMongoDB() {
    if (global.mongooseConnection?.conn) {
        return global.mongooseConnection.conn;
    }
    if (!global.mongooseConnection) {
        global.mongooseConnection = { conn: null, promise: null };
    }
    if (!global.mongooseConnection.promise) {
        global.mongooseConnection.promise = (async () => {
            mongoose_1.default.set('debug', process.env.MONGOOSE_DEBUG === 'true');
            while (true) {
                try {
                    const instance = await mongoose_1.default.connect(process.env.MONGO_URI, {
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
                    global.mongooseConnection.conn = instance;
                    console.log('Connected to MongoDB database: discovery_adcet');
                    return instance;
                }
                catch (err) {
                    console.error('MongoDB connection failed, retrying in 5s', err);
                    await new Promise(res => setTimeout(res, 5000));
                }
            }
        })();
    }
    return global.mongooseConnection.promise;
}
const teamMemberSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    college: { type: String, required: true }
});
const registrationSchema = new mongoose_1.Schema({
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
exports.Registration = mongoose_1.default.model('Registration', registrationSchema, 'registrations');
const registerUser = async (req, res) => {
    try {
        await connectToMongoDB();
        const { leaderName, leaderEmail, leaderMobile, leaderCollege, leaderDepartment, leaderYear, leaderCity, selectedEvent, paperPresentationDept, participationType, teamSize, teamMembers, paymentId, orderId, signature, totalFee } = req.body;
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
            teamMembers: (teamMembers || []).map((member) => ({
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
        const registration = new exports.Registration(normalizedData);
        let saved;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                saved = await registration.save();
                break;
            }
            catch (saveErr) {
                console.error(`Registration save attempt ${attempt} failed:`, saveErr);
                if (attempt === 3)
                    throw saveErr;
                await new Promise(res => setTimeout(res, 1000 * attempt));
            }
        }
        if (!saved) {
            throw new Error('Failed to save registration after multiple attempts');
        }
        // Send welcome email
        await (0, mail_1.sendWelcomeEmail)(saved.leaderEmail, saved._id.toString(), saved.leaderName, saved.leaderYear, saved.leaderMobile, saved.selectedEvent, saved.leaderCollege);
        res.status(201).json({ success: true, message: 'Registration successful' });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, error: 'Failed to register user' });
    }
};
exports.registerUser = registerUser;
//# sourceMappingURL=register.js.map