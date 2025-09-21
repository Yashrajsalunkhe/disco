import { Request, Response } from 'express';
import { Registration, connectToMongoDB } from '../register.js';
import * as XLSX from 'xlsx';

export interface AdminAuthRequest extends Request {
  body: {
    password: string;
  };
}

export interface AdminDataRequest extends Request {
  query: {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    eventFilter?: string;
    search?: string;
    page?: string;
    limit?: string;
  };
}

export interface AdminExportRequest extends Request {
  query: {
    eventFilter?: string;
    startDate?: string;
    endDate?: string;
  };
}

// Admin authentication middleware
export const authenticateAdmin = (req: Request, res: Response, next: any) => {
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

// Admin login handler
export const adminLogin = async (req: AdminAuthRequest, res: Response) => {
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
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Get all registrations with filtering and sorting
export const getAllRegistrations = async (req: AdminDataRequest, res: Response) => {
  try {
    await connectToMongoDB();
    
    const {
      sortBy = 'createdAt',
      sortOrder = 'desc',
      eventFilter,
      search,
      page = '1',
      limit = '50'
    } = req.query;
    
    // Build query
    let query: any = {};
    
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
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Get total count for pagination
    const totalCount = await Registration.countDocuments(query);
    
    // Get registrations
    const registrations = await Registration.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();
    
    // Get unique events for filter dropdown
    const uniqueEvents = await Registration.distinct('selectedEvent');
    
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
  } catch (error) {
    console.error('Get registrations error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch registrations' });
  }
};

// Export registrations as Excel
export const exportRegistrationsExcel = async (req: AdminExportRequest, res: Response) => {
  try {
    await connectToMongoDB();
    
    const { eventFilter, startDate, endDate } = req.query;
    
    // Build query for export
    let query: any = {};
    
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
    const registrations = await Registration.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    if (registrations.length === 0) {
      return res.status(404).json({ success: false, error: 'No registrations found for the given criteria' });
    }
    
    // Prepare data for Excel
    const excelData = registrations.map((reg, index) => {
      const baseData: any = {
        'Sr. No.': index + 1,
        'Registration ID': reg.registrationId || 'N/A',
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
  } catch (error) {
    console.error('Export Excel error:', error);
    return res.status(500).json({ success: false, error: 'Failed to export registrations' });
  }
};

// Get registration statistics
export const getRegistrationStats = async (req: Request, res: Response) => {
  try {
    await connectToMongoDB();
    
    const totalRegistrations = await Registration.countDocuments();
    const soloRegistrations = await Registration.countDocuments({ participationType: 'solo' });
    const teamRegistrations = await Registration.countDocuments({ participationType: 'team' });
    
    // Get event-wise counts
    const eventStats = await Registration.aggregate([
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
    const recentRegistrations = await Registration.find()
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
          totalRevenue: await Registration.aggregate([
            { $group: { _id: null, total: { $sum: '$totalFee' } } }
          ]).then(result => result[0]?.total || 0)
        },
        eventStats,
        recentRegistrations
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
};