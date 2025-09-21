import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Globe, MessageCircle } from "lucide-react";

export const ContactSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Get In Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about Discovery 2K25? We're here to help! For event-specific queries, 
            please contact the coordinators listed in the respective event rules.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* General Contact */}
          <Card className="festival-card hover-float">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <MessageCircle className="h-6 w-6 text-primary" />
                General Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium text-foreground">Email Us</p>
                  <p className="text-sm text-muted-foreground">discovery2025@adcet.in</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-secondary mt-1" />
                <div>
                  <p className="font-medium text-foreground">Call Us</p>
                  <p className="text-sm text-muted-foreground">+91 9876543210</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-accent mt-1" />
                <div>
                  <p className="font-medium text-foreground">Website</p>
                  <p className="text-sm text-muted-foreground">www.adcet.in</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* College Information */}
          <Card className="festival-card hover-float">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <MapPin className="h-6 w-6 text-secondary" />
                Visit Our Campus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-foreground mb-2">
                  Annasaheb Dange College of Engineering and Technology
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ashta, Dist. Sangli, Maharashtra 416301<br />
                  (NAAC A++ Grade Accredited)<br />
                  (Affiliated to Shivaji University, Kolhapur)
                </p>
              </div>
              <Button variant="neon" className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Important Note */}
        <Card className="festival-card bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-4 text-foreground">
              Event-Specific Queries
            </h3>
            <p className="text-muted-foreground">
              For specific questions about event rules, registration, or technical details, 
              please contact the respective faculty and student coordinators listed in each event's detailed page.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};