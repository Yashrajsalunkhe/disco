import { useState, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, ArrowLeft, BookOpen } from "lucide-react";
import { Event, getEventsByDepartment } from "@/data/events";
import { Department } from "./DepartmentGrid";

interface EventsListProps {
  department: Department;
  onBack: () => void;
  onEventSelect: (event: Event) => void;
}

export const EventsList = memo(({ department, onBack, onEventSelect }: EventsListProps) => {
  const events = getEventsByDepartment(department.id);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBack} className="hover:bg-primary/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Departments
          </Button>
        </div>
        
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            {department.name}
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose from {events.length} exciting events in this department
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <Card 
              key={event.id}
              className="festival-card hover-float group cursor-pointer"
              onClick={() => onEventSelect(event)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold group-hover:text-gradient transition-colors duration-300">
                  {event.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {event.description || "Click to view detailed rules and information"}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Max {event.maxTeamSize} {event.maxTeamSize === 1 ? 'participant' : 'participants'}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1 text-primary border-primary/30">
                    <DollarSign className="h-3 w-3" />
                    ₹{event.entryFee}/- per participant
                  </Badge>
                </div>

                <Button variant="festival" className="w-full group-hover:bg-primary/30">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Rules
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});