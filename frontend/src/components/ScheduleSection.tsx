import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";

export const ScheduleSection = () => {
  const schedule = [
    {
      day: "Day 1",
      date: "11th October 2025",
      events: [
        { time: "09:00 AM", activity: "Registration & Welcome", type: "general" },
        { time: "10:00 AM", activity: "Paper Presentations (All Departments)", type: "presentation" },
        { time: "11:30 AM", activity: "Coding Competitions (CSE, AIDS)", type: "coding" },
        { time: "01:00 PM", activity: "Lunch Break", type: "break" },
        { time: "02:00 PM", activity: "Robotics Events (Robo Race)", type: "robotics" },
        { time: "03:30 PM", activity: "Circuit Building & Troubleshooting", type: "technical" },
        { time: "05:00 PM", activity: "Day 1 Wrap-up", type: "general" }
      ]
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "presentation": return "bg-primary/20 text-primary";
      case "coding": return "bg-secondary/20 text-secondary";
      case "robotics": return "bg-accent/20 text-accent";
      case "technical": return "bg-neon-orange/20 text-neon-orange";
      case "break": return "bg-muted/40 text-muted-foreground";
      default: return "bg-card text-foreground";
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Event Schedule
          </h2>
          <p className="text-xl text-muted-foreground">
            Detailed timeline for Discovery 2K25
          </p>
        </div>

        <div className="space-y-8">
          {schedule.map((day, dayIndex) => (
            <Card key={dayIndex} className="festival-card overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Calendar className="h-6 w-6 text-primary" />
                  <span>{day.day}</span>
                  <Badge variant="outline" className="ml-auto text-primary border-primary/30">
                    {day.date}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {day.events.map((event, eventIndex) => (
                    <div 
                      key={eventIndex}
                      className="flex items-center gap-4 p-4 border-b border-border/30 last:border-b-0 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          {event.time}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="text-foreground font-medium">
                          {event.activity}
                        </span>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`${getEventTypeColor(event.type)} border-0`}
                      >
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full border border-primary/30">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-foreground font-medium">
              More events and detailed schedule will be updated soon
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};