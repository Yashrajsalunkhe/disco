"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = sendWelcomeEmail;
const mailer_1 = __importDefault(require("./mailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function sendWelcomeEmail(to, id, name, yearOfStudy, phone, eventName, college) {
    // Helper to capitalize first letter of each word
    const toTitleCase = (s) => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const formattedName = toTitleCase(name);
    const formattedEvent = toTitleCase(eventName);
    const formattedCollege = toTitleCase(college);
    const maxRetries = 3;
    let attempt = 0;
    const mailOptions = {
        from: `"Discovery ADCET 2025" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Welcome to Discovery ADCET 2025 🎉',
        html: `<html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta content="width=device-width, initial-scale=1.0" name="viewport">
                    <title>
                    Welcome to Discovery ADCET 2025!
                    </title>
                    <style>
                    body { margin: 0; padding: 40px 20px; background: linear-gradient(135deg, #1e40af, #7c3aed, #dc2626, #f59e0b); background-size: 400% 400%; animation: gradientBG 20s ease infinite; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; } @keyframes gradientBG { 0% {background-position: 0% 50%;} 50% {background-position: 100% 50%;} 100% {background-position: 0% 50%;} } .container { max-width: 640px; margin: auto; background: #ffffffdd; border-radius: 16px; padding: 30px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); backdrop-filter: blur(10px); } .logo { width: 120px; height: 120px; margin: 0 auto 20px; display: block; border-radius: 12px; } .banner { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 20px; border-radius: 12px; font-size: 28px; font-weight: bold; margin-bottom: 20px; text-shadow: 0 2px 4px rgba(0,0,0,0.3); } .content { color: #333; line-height: 1.6; font-size: 16px; } .highlight-card { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 15px; border-radius: 10px; margin: 15px 0; font-weight: 500; } .btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; margin: 10px 5px; transition: transform 0.3s ease; } .btn:hover { transform: translateY(-2px); } .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; border-top: 1px solid #ddd; padding-top: 20px; }
                    </style>
                    <!--[if mso]><xml>
                    <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word">
                    <w:DontUseAdvancedTypographyReadingMail/>
                    </w:WordDocument>
                    </xml><![endif]-->
                </head>
                <body>
                    <div class="container">
                    <div class="logo-wrapper" style="display: flex; justify-content: center;">
                        <img alt="Event Logo" src="https://your-domain.com/logo.png" class="logo">
                    </div>
                    <div esd-text="true" class="banner esd-text">
                        Discovery ADCET 2025: Welcome Onboard! 🎉
                    </div>
                    <div esd-text="true" class="content esd-text" style="font-family: monospace">
                        Hello <strong>${formattedName}</strong>,
                        <br><br>
                        <span>
                            You've successfully registered for
                            <strong>${formattedEvent}</strong>
                            as part of
                            <strong>Discovery ADCET 2025</strong>
                            ! We're super excited to have you onboard.
                        </span>
                        🚀
                        <br>
                        <br>
                        Here's your registration summary:
                        <div class="highlight-card">
                        <strong>
                            Registration ID:
                        </strong>
                        ${id}
                        <br>
                        <strong>
                            College:
                        </strong>
                        ${formattedCollege}
                        <br>
                        <strong>
                            Year of Study:
                        </strong>
                        ${yearOfStudy}
                        <br>
                        <strong>
                            Phone Number:
                        </strong>
                        ${phone}
                        <br>
                        </div>
                        🔔 Stay tuned for further updates, schedules, and announcements via email and our official page.
                        <div style="text-align: center; margin-top: 20px ">
                        <a href="https://your-domain.com/" class="btn" style="color: white;">
                            View Event Details
                        </a>
                        </div>
                    </div>
                    <div esd-text="true" class="footer esd-text">
                        Have questions? Just reply to this email. 💬
                        <br>
                        <span>
                        We'll see you at the event – Team Discovery ADCET 🌟✨
                        </span>
                    </div>
                    </div>
                </body>
                </html>`
    };
    while (attempt < maxRetries) {
        try {
            const info = await mailer_1.default.sendMail(mailOptions);
            console.log('Email sent successfully:', info.messageId);
            return;
        }
        catch (error) {
            attempt++;
            console.error(`Email send attempt ${attempt} failed:`, error);
            if (attempt >= maxRetries) {
                throw new Error(`Failed to send email after ${maxRetries} attempts: ${error}`);
            }
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        }
    }
}
exports.default = mailer_1.default;
//# sourceMappingURL=mail.js.map