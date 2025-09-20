import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Users, 
  DollarSign, 
  Calendar, 
  Mail, 
  Phone, 
  User, 
  GraduationCap,
  BookOpen,
  Target,
  CheckCircle,
  UserPlus
} from "lucide-react";
import { Event } from "@/data/events";

interface EventDetailsProps {
  event: Event;
  onBack: () => void;
  onRegister?: () => void;
}

export const EventDetails = ({ event, onBack, onRegister }: EventDetailsProps) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Button variant="ghost" onClick={onBack} className="hover:bg-primary/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
          {onRegister && (
            <Button onClick={onRegister} className="bg-primary hover:bg-primary/90">
              <UserPlus className="h-4 w-4 mr-2" />
              Register Now
            </Button>
          )}
        </div>

        {/* Event Title */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            {event.name}
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            {event.department}
          </p>
          
          {/* Key Info */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 text-base">
              <Users className="h-4 w-4" />
              Max {event.maxTeamSize} {event.maxTeamSize === 1 ? 'Participant' : 'Participants'}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-base text-primary border-primary/30">
              <DollarSign className="h-4 w-4" />
              ₹{event.entryFee}/- per participant
            </Badge>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Description */}
          {event.description && (
            <Card className="festival-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Event Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Topics */}
          {event.topics && event.topics.length > 0 && (
            <Card className="festival-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Topics (for Paper Presentation)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {event.topics.map((topic, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-foreground">{topic}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rules */}
          {event.rules && event.rules.length > 0 && (
            <Card className="festival-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Rules & Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-foreground">{rule}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Coordinators */}
          {event.coordinators && (
            <Card className="festival-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Event Coordinators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Faculty Coordinator */}
                  {event.coordinators.faculty && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-secondary">
                        <GraduationCap className="h-5 w-5" />
                        <span className="font-semibold">Faculty Coordinator</span>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                        <h4 className="font-semibold text-foreground">
                          {event.coordinators.faculty.name}
                        </h4>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{event.coordinators.faculty.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="break-all">{event.coordinators.faculty.email}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Student Coordinator */}
                  {event.coordinators.student && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-accent">
                        <User className="h-5 w-5" />
                        <span className="font-semibold">Student Coordinator</span>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                        <h4 className="font-semibold text-foreground">
                          {event.coordinators.student.name}
                        </h4>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{event.coordinators.student.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="break-all">{event.coordinators.student.email}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Important Dates */}
          <Card className="festival-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">Abstract Submission Deadline</span>
                  <span className="text-primary font-semibold">7th October 2025</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">Event Date</span>
                  <span className="text-primary font-semibold">11th October 2025</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Call to Action */}
          {onRegister && (
            <Card className="festival-card border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-primary">Ready to Participate?</h3>
                  <p className="text-muted-foreground">
                    Register now to secure your spot in this exciting event!
                  </p>
                  <Button 
                    onClick={onRegister} 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Register for {event.name}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};