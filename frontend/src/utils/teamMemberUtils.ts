// Team member utility functions and data processing
import { 
  BaseTeamMember, 
  ExtendedTeamMember, 
  Team, 
  TeamMemberStatistics,
  TeamMemberRegistration,
  DEPARTMENTS,
  ACADEMIC_YEARS,
  TSHIRT_SIZES,
  DIETARY_RESTRICTIONS 
} from '../data/teamMembers';

// Validation functions
export const validateTeamMember = (member: Partial<BaseTeamMember>): string[] => {
  const errors: string[] = [];

  if (!member.name || member.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!member.email || !isValidEmail(member.email)) {
    errors.push("Please provide a valid email address");
  }

  if (!member.mobile || !isValidMobile(member.mobile)) {
    errors.push("Please provide a valid mobile number (10-15 digits)");
  }

  if (!member.college || member.college.trim().length < 2) {
    errors.push("Please provide college name");
  }

  return errors;
};

export const validateExtendedTeamMember = (member: Partial<ExtendedTeamMember>): string[] => {
  const errors = validateTeamMember(member);

  if (!member.department || !DEPARTMENTS.includes(member.department as any)) {
    errors.push("Please select a valid department");
  }

  if (!member.year || !ACADEMIC_YEARS.includes(member.year as any)) {
    errors.push("Please select a valid academic year");
  }

  if (!member.city || member.city.trim().length < 2) {
    errors.push("Please provide city name");
  }

  // Validate emergency contact if provided
  if (member.emergencyContact) {
    if (!member.emergencyContact.name || member.emergencyContact.name.trim().length < 2) {
      errors.push("Emergency contact name is required");
    }
    if (!member.emergencyContact.mobile || !isValidMobile(member.emergencyContact.mobile)) {
      errors.push("Emergency contact mobile number is invalid");
    }
  }

  return errors;
};

// Helper validation functions
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidMobile = (mobile: string): boolean => {
  const mobileRegex = /^\d{10,15}$/;
  return mobileRegex.test(mobile);
};

// Data formatting functions
export const formatTeamMemberForDisplay = (member: BaseTeamMember | ExtendedTeamMember): string => {
  return `${member.name} (${member.email})`;
};

export const formatTeamMemberDetails = (member: ExtendedTeamMember): string => {
  return `${member.name} - ${member.department}, ${member.year}, ${member.college}`;
};

export const formatMobileNumber = (mobile: string): string => {
  // Format mobile number as +91-XXXXX-XXXXX
  if (mobile.length === 10) {
    return `+91-${mobile.slice(0, 5)}-${mobile.slice(5)}`;
  }
  return mobile;
};

// Team management functions
export const canAddMemberToTeam = (team: Team): boolean => {
  return team.currentSize < team.maxSize && team.status === 'forming';
};

export const addMemberToTeam = (team: Team, member: ExtendedTeamMember): Team => {
  if (!canAddMemberToTeam(team)) {
    throw new Error("Cannot add member to team: team is full or not accepting members");
  }

  const updatedTeam: Team = {
    ...team,
    members: [...team.members, member],
    currentSize: team.currentSize + 1,
    status: team.currentSize + 1 >= team.maxSize ? 'complete' : 'forming'
  };

  return updatedTeam;
};

export const removeMemberFromTeam = (team: Team, memberId: string): Team => {
  const updatedMembers = team.members.filter(member => member.id !== memberId);
  
  return {
    ...team,
    members: updatedMembers,
    currentSize: updatedMembers.length + 1, // +1 for leader
    status: updatedMembers.length + 1 < team.maxSize ? 'forming' : 'complete'
  };
};

// Statistics and analytics functions
export const calculateTeamMemberStatistics = (teams: Team[]): TeamMemberStatistics => {
  const allMembers: ExtendedTeamMember[] = [];
  let soloCount = 0;
  let teamCount = 0;

  teams.forEach(team => {
    allMembers.push(team.leader);
    allMembers.push(...team.members);
    
    if (team.currentSize === 1) {
      soloCount++;
    } else {
      teamCount++;
    }
  });

  const totalMembers = allMembers.length;
  
  const membersByDepartment = allMembers.reduce((acc, member) => {
    acc[member.department] = (acc[member.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const membersByCollege = allMembers.reduce((acc, member) => {
    acc[member.college] = (acc[member.college] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const membersByYear = allMembers.reduce((acc, member) => {
    acc[member.year] = (acc[member.year] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const membersByCity = allMembers.reduce((acc, member) => {
    acc[member.city] = (acc[member.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const averageTeamSize = teams.length > 0 
    ? teams.reduce((sum, team) => sum + team.currentSize, 0) / teams.length 
    : 0;

  return {
    totalMembers,
    membersByDepartment,
    membersByCollege,
    membersByYear,
    membersByCity,
    averageTeamSize: Math.round(averageTeamSize * 100) / 100,
    soloParticipations: soloCount,
    teamParticipations: teamCount
  };
};

// Export functions
export const exportTeamMembersToCSV = (teams: Team[]): string => {
  const headers = [
    'Team ID',
    'Team Name', 
    'Leader Name',
    'Leader Email',
    'Leader Mobile',
    'Leader College',
    'Leader Department',
    'Leader Year',
    'Event',
    'Team Size',
    'Payment Status',
    'Total Fee',
    'Registration Date',
    'Member Names',
    'Member Emails',
    'Member Colleges'
  ];

  const rows = teams.map(team => [
    team.id,
    team.name || '',
    team.leader.name,
    team.leader.email,
    team.leader.mobile,
    team.leader.college,
    team.leader.department,
    team.leader.year,
    team.event,
    team.currentSize.toString(),
    team.paymentStatus,
    team.totalFee.toString(),
    team.registrationDate.toISOString().split('T')[0],
    team.members.map(m => m.name).join('; '),
    team.members.map(m => m.email).join('; '),
    team.members.map(m => m.college).join('; ')
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
};

// Search and filter functions
export const searchTeamMembers = (
  teams: Team[], 
  searchTerm: string
): Team[] => {
  if (!searchTerm.trim()) return teams;

  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return teams.filter(team => {
    // Search in leader details
    const leaderMatch = 
      team.leader.name.toLowerCase().includes(lowerSearchTerm) ||
      team.leader.email.toLowerCase().includes(lowerSearchTerm) ||
      team.leader.college.toLowerCase().includes(lowerSearchTerm) ||
      team.leader.department.toLowerCase().includes(lowerSearchTerm);

    // Search in member details
    const memberMatch = team.members.some(member =>
      member.name.toLowerCase().includes(lowerSearchTerm) ||
      member.email.toLowerCase().includes(lowerSearchTerm) ||
      member.college.toLowerCase().includes(lowerSearchTerm) ||
      member.department.toLowerCase().includes(lowerSearchTerm)
    );

    // Search in team details
    const teamMatch = 
      team.event.toLowerCase().includes(lowerSearchTerm) ||
      (team.name && team.name.toLowerCase().includes(lowerSearchTerm));

    return leaderMatch || memberMatch || teamMatch;
  });
};

export const filterTeamsByEvent = (teams: Team[], eventId: string): Team[] => {
  if (eventId === 'all') return teams;
  return teams.filter(team => team.event === eventId);
};

export const filterTeamsByDepartment = (teams: Team[], department: string): Team[] => {
  if (department === 'all') return teams;
  return teams.filter(team => team.leader.department === department);
};

export const filterTeamsByPaymentStatus = (teams: Team[], status: string): Team[] => {
  if (status === 'all') return teams;
  return teams.filter(team => team.paymentStatus === status);
};

// Data transformation functions for API compatibility
export const transformTeamToRegistration = (team: Team): any => {
  return {
    _id: team.id,
    leaderName: team.leader.name,
    leaderEmail: team.leader.email,
    leaderMobile: team.leader.mobile,
    leaderCollege: team.leader.college,
    leaderDepartment: team.leader.department,
    leaderYear: team.leader.year,
    leaderCity: team.leader.city,
    selectedEvent: team.event,
    participationType: team.currentSize === 1 ? 'solo' : 'team',
    teamSize: team.currentSize,
    teamMembers: team.members.map(member => ({
      name: member.name,
      email: member.email,
      mobile: member.mobile,
      college: member.college
    })),
    totalFee: team.totalFee,
    createdAt: team.registrationDate.toISOString()
  };
};

export const transformRegistrationToTeam = (registration: any): Team => {
  const leader: any = {
    id: `leader_${registration._id}`,
    name: registration.leaderName,
    email: registration.leaderEmail,
    mobile: registration.leaderMobile,
    college: registration.leaderCollege,
    department: registration.leaderDepartment,
    year: registration.leaderYear,
    city: registration.leaderCity,
    isLeader: true,
    teamId: registration._id,
    registrationId: registration._id
  };

  const members = (registration.teamMembers || []).map((member: any, index: number) => ({
    id: `member_${registration._id}_${index}`,
    name: member.name,
    email: member.email,
    mobile: member.mobile,
    college: member.college,
    department: registration.leaderDepartment, // Assuming same department
    year: registration.leaderYear, // Assuming same year
    city: registration.leaderCity // Assuming same city
  }));

  return {
    id: registration._id,
    name: `${registration.leaderName}'s Team`,
    leader,
    members,
    event: registration.selectedEvent,
    registrationDate: new Date(registration.createdAt),
    maxSize: 4, // Default max size, should be determined by event
    currentSize: registration.teamSize,
    status: 'registered',
    paymentStatus: 'paid', // Assuming paid if registration exists
    totalFee: registration.totalFee
  };
};