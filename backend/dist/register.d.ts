import mongoose, { Document } from 'mongoose';
import { Request, Response } from 'express';
declare global {
    var mongooseConnection: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}
export declare function connectToMongoDB(): Promise<typeof mongoose>;
interface RegistrationDoc extends Document {
    _id: mongoose.Types.ObjectId;
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
export declare const Registration: mongoose.Model<RegistrationDoc, {}, {}, {}, mongoose.Document<unknown, {}, RegistrationDoc, {}, {}> & RegistrationDoc & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const registerUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=register.d.ts.map