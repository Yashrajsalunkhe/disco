export interface Event {
  id: string;
  name: string;
  department: string;
  maxTeamSize: number;
  entryFee: number;
  description?: string;
  topics?: string[];
  rules?: string[];
  coordinators?: {
    faculty?: {
      name: string;
      phone: string;
      email: string;
    };
    student?: {
      name: string;
      phone: string;
      email: string;
    };
  };
}

export const eventsByDepartment: Record<string, Event[]> = {
  aeronautical: [
    {
      id: "aero-paper",
      name: "Paper Presentation",
      department: "Aeronautical Engineering",
      maxTeamSize: 4,
      entryFee: 100,
      description: "Present your research on advanced aeronautical engineering topics",
      topics: [
        "Advanced Materials and Manufacturing",
        "High-Temperature Materials and composites", 
        "Surface Modification of Materials",
        "Materials for Space Applications",
        "Conventional Aerospace Metals and Materials",
        "Statics and dynamics of structures",
        "Behavior of Aerospace Structures",
        "Rocket, Helicopter, Missiles, and Spacecraft Structural Design",
        "Conventional and Non-Conventional Methods in Aerospace Structural Design",
        "Non-Destructive Testing (NDT) in Aerospace Systems",
        "Aerodynamic Optimization of Aircraft Wings",
        "Subsonic, Transonic and supersonic flow analysis",
        "Aerodynamic Flow Control",
        "Unmanned Aerial Vehicles (UAVs) Technologies"
      ],
      rules: [
        "Maximum of 4 participants per team",
        "Entry fee: ₹100 per participant",
        "Submit abstract by 7th October 2025",
        "Full paper max 10 pages in IEEE format",
        "10 minutes presentation + Q&A session",
        "Bring college ID and registration receipt"
      ],
      coordinators: {
        faculty: {
          name: "Dr. Sudharson Murugan",
          phone: "9790551772",
          email: "sm_aero@adcet.in"
        },
        student: {
          name: "Vedanti Gondhali", 
          phone: "9867980126",
          email: "vedantigondhali@gmail.com"
        }
      }
    },
    {
      id: "paper-glider",
      name: "Paper Glider: Flight Challenge",
      department: "Aeronautical Engineering",
      maxTeamSize: 4,
      entryFee: 100,
      description: "Design and build paper gliders for maximum flight distance and time"
    },
    {
      id: "water-rocket",
      name: "Water Rocket",
      department: "Aeronautical Engineering", 
      maxTeamSize: 4,
      entryFee: 100,
      description: "Build and launch water rockets for maximum altitude and accuracy"
    }
  ],
  mechanical: [
    {
      id: "mech-paper",
      name: "Paper Presentation",
      department: "Mechanical Engineering",
      maxTeamSize: 4,
      entryFee: 100,
      description: "Present innovative research in mechanical engineering",
      topics: [
        "Advances in Automation and Robotics",
        "Innovations in Automotive Industries", 
        "Thermal Engineering and Energy Systems",
        "Manufacturing and Production Engineering",
        "Materials Science and Engineering",
        "Fluid Mechanics and Heat Transfer",
        "Machine Design and Mechatronics",
        "Renewable Energy Technologies"
      ]
    },
    {
      id: "robo-race",
      name: "Robo Race",
      department: "Mechanical Engineering",
      maxTeamSize: 2,
      entryFee: 100,
      description: "Design autonomous robots to navigate through challenging race tracks"
    },
    {
      id: "cad-conqueror",
      name: "CAD Conqueror",
      department: "Mechanical Engineering",
      maxTeamSize: 1,
      entryFee: 100,
      description: "Showcase your CAD modeling skills in this individual competition"
    }
  ],
  electrical: [
    {
      id: "elec-paper",
      name: "Paper Presentation",
      department: "Electrical Engineering",
      maxTeamSize: 4,
      entryFee: 100,
      description: "Present cutting-edge research in electrical engineering",
      topics: [
        "Power Electronics and Drives",
        "Renewable Energy Systems",
        "Smart Grid Technologies",
        "Electric Vehicles and Charging Infrastructure",
        "Power Quality and Energy Efficiency",
        "Digital Signal Processing",
        "Control Systems and Automation",
        "High Voltage Engineering"
      ]
    },
    {
      id: "circuit-builder",
      name: "Circuit Builder",
      department: "Electrical Engineering",
      maxTeamSize: 2,
      entryFee: 100,
      description: "Design and build functional circuits to solve engineering challenges"
    },
    {
      id: "troubleshooting",
      name: "Troubleshooting",
      department: "Electrical Engineering",
      maxTeamSize: 2,
      entryFee: 100,
      description: "Identify and fix electrical circuit problems under time pressure"
    }
  ],
  civil: [
    {
      id: "civil-paper",
      name: "Paper Presentation",
      department: "Civil Engineering",
      maxTeamSize: 4,
      entryFee: 100,
      description: "Present innovative solutions in civil engineering",
      topics: [
        "Sustainable Construction Materials",
        "Smart Cities and Infrastructure",
        "Earthquake Resistant Design",
        "Water Resources Management",
        "Environmental Engineering",
        "Transportation Engineering",
        "Structural Health Monitoring",
        "Green Building Technologies"
      ]
    },
    {
      id: "akruti",
      name: "AKRUTI",
      department: "Civil Engineering",
      maxTeamSize: 1,
      entryFee: 100,
      description: "Individual structural design and analysis competition"
    },
    {
      id: "setu",
      name: "SETU",
      department: "Civil Engineering",
      maxTeamSize: 2,
      entryFee: 100,
      description: "Bridge design and construction challenge"
    }
  ],
  cse: [
    {
      id: "cse-paper",
      name: "Paper Presentation",
      department: "Computer Science Engineering",
      maxTeamSize: 4,
      entryFee: 100,
      description: "Present innovative computer science research and solutions",
      topics: [
        "Artificial Intelligence and Machine Learning",
        "Blockchain Technology",
        "Cloud Computing and DevOps",
        "Cybersecurity and Information Security",
        "Data Science and Big Data Analytics",
        "Internet of Things (IoT)",
        "Mobile Application Development",
        "Software Engineering and Agile Methodologies"
      ]
    },
    {
      id: "code-compete",
      name: "Code 2 Compete",
      department: "Computer Science Engineering",
      maxTeamSize: 1,
      entryFee: 100,
      description: "Individual competitive programming challenge"
    },
    {
      id: "b-plan",
      name: "B-Plan",
      department: "Computer Science Engineering",
      maxTeamSize: 2,
      entryFee: 100,
      description: "Present your startup business plan and pitch to judges"
    }
  ],
  aids: [
    {
      id: "aids-paper",
      name: "Paper Presentation",
      department: "AI & Data Science",
      maxTeamSize: 4,
      entryFee: 100,
      description: "Present research on AI and data science applications",
      topics: [
        "Deep Learning and Neural Networks",
        "Natural Language Processing",
        "Computer Vision and Image Processing",
        "Predictive Analytics and Forecasting",
        "Big Data Technologies",
        "Edge AI and IoT Integration",
        "Ethical AI and Bias Mitigation",
        "Reinforcement Learning"
      ]
    },
    {
      id: "bgmi-dominator",
      name: "BGMI Dominator",
      department: "AI & Data Science",
      maxTeamSize: 4,
      entryFee: 100,
      description: "Esports competition featuring BGMI battles"
    },
    {
      id: "coding-competition",
      name: "Coding Competition",
      department: "AI & Data Science",
      maxTeamSize: 1,
      entryFee: 100,
      description: "Individual coding challenge focusing on algorithms and data structures"
    }
  ],
  iot: [
    {
      id: "iot-paper",
      name: "Paper Presentation",
      department: "IoT & Cyber Security",
      maxTeamSize: 4,
      entryFee: 100,
      description: "Present innovations in IoT and cybersecurity",
      topics: [
        "IoT Security and Privacy",
        "Blockchain in IoT",
        "Edge Computing and Fog Computing",
        "Industrial IoT and Industry 4.0",
        "Smart Home and Smart City Applications",
        "Cybersecurity Threat Detection",
        "Network Security and Firewalls",
        "Digital Forensics and Incident Response"
      ]
    },
    {
      id: "ideathon",
      name: "Ideathon",
      department: "IoT & Cyber Security",
      maxTeamSize: 2,
      entryFee: 100,
      description: "Brainstorm and pitch innovative IoT solutions"
    },
    {
      id: "box-cricket",
      name: "Box Cricket League",
      department: "IoT & Cyber Security",
      maxTeamSize: 6,
      entryFee: 100,
      description: "Indoor cricket tournament for tech enthusiasts"
    }
  ],
  bba: [
    {
      id: "bba-paper",
      name: "Paper Presentation",
      department: "Business Administration",
      maxTeamSize: 4,
      entryFee: 100,
      description: "Present business strategies and management concepts",
      topics: [
        "Digital Marketing and E-commerce",
        "Sustainable Business Practices",
        "Entrepreneurship and Innovation",
        "Financial Management and Investment",
        "Human Resource Management",
        "Supply Chain Management",
        "Business Analytics and Decision Making",
        "Corporate Social Responsibility"
      ]
    }
  ],
  food: [
    {
      id: "functional-food",
      name: "Functional Food",
      department: "Food Technology",
      maxTeamSize: 4,
      entryFee: 100,
      description: "Develop innovative functional food products with health benefits"
    },
    {
      id: "product-development",
      name: "New Product Development (Prototype)",
      department: "Food Technology",
      maxTeamSize: 4,
      entryFee: 100,
      description: "Create and prototype new food products with market potential"
    }
  ]
};

export const getAllEvents = (): Event[] => {
  return Object.values(eventsByDepartment).flat();
};

export const getEventsByDepartment = (departmentId: string): Event[] => {
  return eventsByDepartment[departmentId] || [];
};