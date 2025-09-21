import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Target, Zap } from "lucide-react";

export const AboutSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            About Discovery 2K25
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discovery is a national-level technical event featuring 24+ competitions across 
            engineering, management, IT, and food technology disciplines, designed to promote 
            innovation, technical excellence, and creativity among students.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="festival-card hover-float group">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">Innovation Focus</h3>
              <p className="text-muted-foreground">
                Encouraging cutting-edge solutions and creative thinking across multiple engineering disciplines.
              </p>
            </CardContent>
          </Card>
          
          <Card className="festival-card hover-float group">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-secondary to-secondary/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-secondary-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">Technical Excellence</h3>
              <p className="text-muted-foreground">
                Promoting the highest standards of technical knowledge and practical application.
              </p>
            </CardContent>
          </Card>
          
          <Card className="festival-card hover-float group">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent to-accent/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-accent-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">Student Empowerment</h3>
              <p className="text-muted-foreground">
                Providing a platform for students to showcase their skills and compete at the national level.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full border border-primary/30">
            <span className="text-2xl font-bold text-primary">₹100/-</span>
            <span className="text-foreground">per participant</span>
          </div>
        </div>
      </div>
    </section>
  );
};