"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDuplicate = void 0;
const register_1 = require("./register");
const checkDuplicate = async (req, res, next) => {
    await (0, register_1.connectToMongoDB)();
    const { leaderEmail, selectedEvent, leaderMobile } = req.body;
    // Validate required fields for duplicate check
    if (!leaderEmail || !selectedEvent || !leaderMobile) {
        res.status(400).json({
            success: false,
            error: 'Missing required fields for registration validation'
        });
        return;
    }
    const emailLower = leaderEmail.trim().toLowerCase();
    const eventLower = selectedEvent.trim().toLowerCase();
    const phoneLower = leaderMobile.trim().toLowerCase();
    try {
        const existing = await register_1.Registration.findOne({
            selectedEvent: eventLower,
            $or: [
                { leaderEmail: emailLower },
                { leaderMobile: phoneLower }
            ]
        });
        if (existing) {
            res.status(409).json({
                success: false,
                error: 'User with this email or phone already registered for this event'
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Duplicate check error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check duplicate registration'
        });
        return;
    }
};
exports.checkDuplicate = checkDuplicate;
//# sourceMappingURL=search.js.map