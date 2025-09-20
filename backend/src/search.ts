import { Request, Response, NextFunction } from 'express';
import { Registration, connectToMongoDB } from './register';

export const checkDuplicate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await connectToMongoDB();
  const { leaderEmail, selectedEvent, leaderMobile } = req.body;
  
  // Validate required fields for duplicate check
  if (!leaderEmail || !selectedEvent || !leaderMobile) {
    res.status(400).json({ 
      success: false, 
      error: 'Missing required fields for registration validation' 
    });
    return;
  }
  
  const emailLower = (leaderEmail as string).trim().toLowerCase();
  const eventLower = (selectedEvent as string).trim().toLowerCase();
  const phoneLower = (leaderMobile as string).trim().toLowerCase();
  
  try {
    const existing = await Registration.findOne({
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
  } catch (error) {
    console.error('Duplicate check error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check duplicate registration' 
    });
    return;
  }
};