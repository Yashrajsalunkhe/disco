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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegistrationStats = exports.exportRegistrationsExcel = exports.getAllRegistrations = exports.adminLogin = exports.authenticateAdmin = void 0;
const register_1 = require("../register");
const XLSX = __importStar(require("xlsx"));
// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'No admin token provided' });
    }
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    if (token !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }
    next();
};
exports.authenticateAdmin = authenticateAdmin;
// Admin login handler
const adminLogin = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, error: 'Invalid admin password' });
        }
        // Return the password as token for simplicity (in production, use JWT)
        return res.json({
            success: true,
            message: 'Admin authenticated successfully',
            token: password // Simple token approach
        });
    }
    catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.adminLogin = adminLogin;
// Get all registrations with filtering and sorting
const getAllRegistrations = async (req, res) => {
    try {
        await (0, register_1.connectToMongoDB)();
        const { sortBy = 'createdAt', sortOrder = 'desc', eventFilter, search, page = '1', limit = '50' } = req.query;
        // Build query
        let query = {};
        if (eventFilter && eventFilter !== 'all') {
            query.selectedEvent = eventFilter;
        }
        if (search) {
            query.$or = [
                { leaderName: { $regex: search, $options: 'i' } },
                { leaderEmail: { $regex: search, $options: 'i' } },
                { leaderMobile: { $regex: search, $options: 'i' } },
                { leaderCollege: { $regex: search, $options: 'i' } },
                { selectedEvent: { $regex: search, $options: 'i' } }
            ];
        }
        // Sorting
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Get total count for pagination
        const totalCount = await register_1.Registration.countDocuments(query);
        // Get registrations
        const registrations = await register_1.Registration.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum)
            .lean();
        // Get unique events for filter dropdown
        const uniqueEvents = await register_1.Registration.distinct('selectedEvent');
        return res.json({
            success: true,
            data: {
                registrations,
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(totalCount / limitNum),
                    totalCount,
                    limit: limitNum
                },
                filters: {
                    availableEvents: uniqueEvents
                }
            }
        });
    }
    catch (error) {
        console.error('Get registrations error:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch registrations' });
    }
};
exports.getAllRegistrations = getAllRegistrations;
// Export registrations as Excel
const exportRegistrationsExcel = async (req, res) => {
    try {
        await (0, register_1.connectToMongoDB)();
        const { eventFilter, startDate, endDate } = req.query;
        // Build query for export
        let query = {};
        if (eventFilter && eventFilter !== 'all') {
            query.selectedEvent = eventFilter;
        }
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }
        // Fetch all matching registrations
        const registrations = await register_1.Registration.find(query)
            .sort({ createdAt: -1 })
            .lean();
        if (registrations.length === 0) {
            return res.status(404).json({ success: false, error: 'No registrations found for the given criteria' });
        }
        // Prepare data for Excel
        const excelData = registrations.map((reg, index) => {
            const baseData = {
                'Sr. No.': index + 1,
                'Registration Date': new Date(reg.createdAt).toLocaleDateString('en-IN'),
                'Leader Name': reg.leaderName,
                'Leader Email': reg.leaderEmail,
                'Leader Mobile': reg.leaderMobile,
                'Leader College': reg.leaderCollege,
                'Leader Department': reg.leaderDepartment,
                'Leader Year': reg.leaderYear,
                'Leader City': reg.leaderCity,
                'Event': reg.selectedEvent,
                'Paper Presentation Dept': reg.paperPresentationDept || 'N/A',
                'Participation Type': reg.participationType,
                'Team Size': reg.teamSize,
                'Total Fee': `₹${reg.totalFee}`,
                'Payment ID': reg.paymentId,
                'Order ID': reg.orderId
            };
            // Add team members data if it's a team registration
            if (reg.teamMembers && reg.teamMembers.length > 0) {
                reg.teamMembers.forEach((member, memberIndex) => {
                    baseData[`Team Member ${memberIndex + 1} Name`] = member.name;
                    baseData[`Team Member ${memberIndex + 1} Email`] = member.email;
                    baseData[`Team Member ${memberIndex + 1} Mobile`] = member.mobile;
                    baseData[`Team Member ${memberIndex + 1} College`] = member.college;
                });
            }
            return baseData;
        });
        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        // Auto-size columns
        const columnWidths = Object.keys(excelData[0] || {}).map(key => ({
            wch: Math.max(key.length, 15)
        }));
        worksheet['!cols'] = columnWidths;
        // Add worksheet to workbook
        const sheetName = eventFilter && eventFilter !== 'all'
            ? `${eventFilter.replace(/[^\w\s]/gi, '')}_Registrations`
            : 'All_Registrations';
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        // Generate Excel file buffer
        const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        // Set response headers for file download
        const fileName = `Discovery_ADCET_Registrations_${eventFilter || 'All'}_${new Date().toISOString().split('T')[0]}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Length', excelBuffer.length);
        return res.send(excelBuffer);
    }
    catch (error) {
        console.error('Export Excel error:', error);
        return res.status(500).json({ success: false, error: 'Failed to export registrations' });
    }
};
exports.exportRegistrationsExcel = exportRegistrationsExcel;
// Get registration statistics
const getRegistrationStats = async (req, res) => {
    try {
        await (0, register_1.connectToMongoDB)();
        const totalRegistrations = await register_1.Registration.countDocuments();
        const soloRegistrations = await register_1.Registration.countDocuments({ participationType: 'solo' });
        const teamRegistrations = await register_1.Registration.countDocuments({ participationType: 'team' });
        // Get event-wise counts
        const eventStats = await register_1.Registration.aggregate([
            {
                $group: {
                    _id: '$selectedEvent',
                    count: { $sum: 1 },
                    totalFees: { $sum: '$totalFee' }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        // Get recent registrations
        const recentRegistrations = await register_1.Registration.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('leaderName selectedEvent createdAt totalFee')
            .lean();
        return res.json({
            success: true,
            data: {
                overview: {
                    totalRegistrations,
                    soloRegistrations,
                    teamRegistrations,
                    totalRevenue: await register_1.Registration.aggregate([
                        { $group: { _id: null, total: { $sum: '$totalFee' } } }
                    ]).then(result => result[0]?.total || 0)
                },
                eventStats,
                recentRegistrations
            }
        });
    }
    catch (error) {
        console.error('Get stats error:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
    }
};
exports.getRegistrationStats = getRegistrationStats;
//# sourceMappingURL=admin.js.map