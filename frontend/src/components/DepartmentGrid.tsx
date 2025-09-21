import { Card, CardContent } from "@/components/ui/card";
import { 
  Plane, 
  Settings, 
  Zap, 
  Building, 
  Code, 
  Brain, 
  Shield, 
  Briefcase, 
  Utensils 
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  icon: React.ReactNode;
  eventCount: number;
  gradient: string;
}

const departments: Department[] = [
  {
    id: "aeronautical",
    name: "Aeronautical Engineering",
    icon: <Plane className="h-8 w-8" />,
    eventCount: 3,
    gradient: "from-neon-blue to-primary"
  },
  {
    id: "mechanical", 
    name: "Mechanical Engineering",
    icon: <Settings className="h-8 w-8" />,
    eventCount: 3,
    gradient: "from-neon-orange to-accent"
  },
  {
    id: "electrical",
    name: "Electrical Engineering", 
    icon: <Zap className="h-8 w-8" />,
    eventCount: 3,
    gradient: "from-neon-green to-secondary"
  },
  {
    id: "civil",
    name: "Civil Engineering",
    icon: <Building className="h-8 w-8" />,
    eventCount: 3,
    gradient: "from-neon-purple to-primary"
  },
  {
    id: "cse",
    name: "Computer Science Engineering",
    icon: <Code className="h-8 w-8" />,
    eventCount: 3,
    gradient: "from-primary to-neon-pink"
  },
  {
    id: "aids",
    name: "AI & Data Science",
    icon: <Brain className="h-8 w-8" />,
    eventCount: 3,
    gradient: "from-secondary to-neon-blue"
  },
  {
    id: "iot",
    name: "IoT & Cyber Security",
    icon: <Shield className="h-8 w-8" />,
    eventCount: 3,
    gradient: "from-accent to-neon-green"
  },
  {
    id: "bba",
    name: "Business Administration",
    icon: <Briefcase className="h-8 w-8" />,
    eventCount: 1,
    gradient: "from-neon-orange to-neon-purple"
  },
  {
    id: "food",
    name: "Food Technology",
    icon: <Utensils className="h-8 w-8" />,
    eventCount: 2,
    gradient: "from-neon-pink to-neon-orange"
  }
];

interface DepartmentGridProps {
  onDepartmentSelect: (department: Department) => void;
}

export const DepartmentGrid = ({ onDepartmentSelect }: DepartmentGridProps) => {
  return (
    <section id="departments" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Choose Your Department
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore events across 9 departments and showcase your skills in your area of expertise
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, index) => (
            <Card 
              key={dept.id}
              className="festival-card hover-float group cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={() => onDepartmentSelect(dept)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${dept.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 neon-glow`}>
                    <div className="text-background">
                      {dept.icon}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-gradient transition-colors duration-300">
                  {dept.name}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    {dept.eventCount} Events
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export type { Department };