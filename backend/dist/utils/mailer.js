"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
if (!emailUser || !emailPass) {
    throw new Error('EMAIL_USER and EMAIL_PASS must be set in project root .env file');
}
let transporter;
transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: { user: emailUser, pass: emailPass },
    from: emailUser,
    pool: false,
    connectionTimeout: 60000, // 60s
    greetingTimeout: 60000, // 60s
    socketTimeout: 60000,
    tls: { rejectUnauthorized: false },
});
transporter.verify((error, success) => {
    if (error) {
        console.log("Email transporter error:", error);
    }
    else {
        console.log("Email transporter is ready");
    }
});
exports.default = transporter;
//# sourceMappingURL=mailer.js.map