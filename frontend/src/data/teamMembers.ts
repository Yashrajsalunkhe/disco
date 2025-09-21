// Team member data structures and utilities for Discovery 2K25

export interface BaseTeamMember {
  id?: string;
  name: string;
  email: string;
  mobile: string;
  college: string;
}

export interface ExtendedTeamMember extends BaseTeamMember {
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
  tshirtSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  accommodationNeeded?: boolean;
  previousParticipation?: string[];
}

export interface TeamLeader extends ExtendedTeamMember {
  isLeader: true;
  teamId?: string;
  registrationId?: string;
}

export interface TeamMemberRegistration {
  member: BaseTeamMember | ExtendedTeamMember;
  registrationDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  eventId: string;
  teamRole?: 'leader' | 'member' | 'coordinator';
}

export interface Team {
  id: string;
  name?: string;
  leader: TeamLeader;
  members: ExtendedTeamMember[];
  event: string;
  registrationDate: Date;
  maxSize: number;
  currentSize: number;
  status: 'forming' | 'complete' | 'registered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  totalFee: number;
}

export interface TeamMemberStatistics {
  totalMembers: number;
  membersByDepartment: Record<string, number>;
  membersByCollege: Record<string, number>;
  membersByYear: Record<string, number>;
  membersByCity: Record<string, number>;
  averageTeamSize: number;
  soloParticipations: number;
  teamParticipations: number;
}

// Department options
export const DEPARTMENTS = [
  "Aeronautical Engineering",
  "Mechanical Engineering", 
  "Electrical Engineering",
  "Civil Engineering",
  "Computer Science Engineering",
  "AI & Data Science",
  "IoT & Cyber Security",
  "Business Administration",
  "Food Technology",
  "Other"
] as const;

// Year options
export const ACADEMIC_YEARS = [
  "1st Year",
  "2nd Year", 
  "3rd Year",
  "4th Year",
  "Postgraduate",
  "PhD"
] as const;

// T-shirt sizes
export const TSHIRT_SIZES = [
  "XS", "S", "M", "L", "XL", "XXL"
] as const;

// Common dietary restrictions
export const DIETARY_RESTRICTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Dairy-free",
  "Nut allergies",
  "Other allergies",
  "None"
] as const;

// Emergency contact relations
export const EMERGENCY_CONTACT_RELATIONS = [
  "Parent",
  "Guardian", 
  "Sibling",
  "Relative",
  "Friend",
  "Other"
] as const;

export type Department = typeof DEPARTMENTS[number];
export type AcademicYear = typeof ACADEMIC_YEARS[number];
export type TshirtSize = typeof TSHIRT_SIZES[number];
export type DietaryRestriction = typeof DIETARY_RESTRICTIONS[number];
export type EmergencyContactRelation = typeof EMERGENCY_CONTACT_RELATIONS[number];

// Sample team member data for testing
export const sampleTeamMembers: ExtendedTeamMember[] = [
  {
    id: "tm_001",
    name: "John Doe",
    email: "john.doe@example.com",
    mobile: "9876543210",
    college: "ABC Engineering College",
    department: "Computer Science Engineering",
    year: "3rd Year",
    city: "Mumbai",
    studentId: "CS2021001",
    emergencyContact: {
      name: "Jane Doe",
      mobile: "9876543211",
      relation: "Parent"
    },
    dietaryRestrictions: ["Vegetarian"],
    tshirtSize: "L",
    accommodationNeeded: false,
    previousParticipation: ["Discovery 2K24"]
  },
  {
    id: "tm_002", 
    name: "Alice Smith",
    email: "alice.smith@example.com",
    mobile: "9876543212",
    college: "XYZ Institute of Technology",
    department: "Mechanical Engineering",
    year: "2nd Year",
    city: "Pune",
    studentId: "ME2022002",
    emergencyContact: {
      name: "Bob Smith",
      mobile: "9876543213",
      relation: "Parent"
    },
    dietaryRestrictions: ["None"],
    tshirtSize: "M",
    accommodationNeeded: true,
    previousParticipation: []
  }
];

// Sample team data
export const sampleTeams: Team[] = [
  {
    id: "team_001",
    name: "Code Warriors",
    leader: {
      ...sampleTeamMembers[0],
      isLeader: true,
      teamId: "team_001",
      registrationId: "REG_001"
    } as TeamLeader,
    members: [sampleTeamMembers[1]],
    event: "coding-competition",
    registrationDate: new Date("2024-10-01"),
    maxSize: 4,
    currentSize: 2,
    status: "complete",
    paymentStatus: "paid",
    totalFee: 200
  }
];