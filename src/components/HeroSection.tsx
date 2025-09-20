import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trophy, Users, UserPlus } from "lucide-react";
import { memo, useState, useEffect, lazy, Suspense } from "react";

// Lazy load Galaxy component
const Galaxy = lazy(() => import("./Galaxy"));

interface HeroSectionProps {
  onExploreEvents: () => void;
  onRegister?: () => void;
}

export const HeroSection = memo(({ onExploreEvents, onRegister }: HeroSectionProps) => {
  const [showGalaxy, setShowGalaxy] = useState(false);

  useEffect(() => {
    // Always enable high performance and show Galaxy
    // Delay Galaxy loading to ensure page is fully loaded
    setTimeout(() => setShowGalaxy(true), 2000);
  }, []);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Galaxy Background - Always enabled for high performance */}
      <div className="absolute inset-0 z-0">
        {showGalaxy ? (
          <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-background via-primary/5 to-secondary/10" />}>
            <Galaxy 
              mouseRepulsion={true}
              mouseInteraction={true}
              density={0.8}
              glowIntensity={0.2}
              saturation={0.4}
              hueShift={240}
              transparent={false}
              speed={0.5}
              rotationSpeed={0.05}
            />
          </Suspense>
        ) : (
          /* Loading gradient background */
          <div className="w-full h-full bg-gradient-to-br from-background via-primary/5 to-secondary/10" />
        )}
      </div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10 z-10" />
      
      {/* Main content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight">
            <span className="text-gradient">DISCOVERY</span>
            <br />
            <span className="text-4xl md:text-6xl lg:text-7xl text-foreground">2K25</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground/90 mb-4 animate-slide-in-left">
            National Level Technical Festival
          </p>
          
          {/* Event Details */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 animate-slide-in-right">
            <div className="flex items-center gap-2 text-foreground/80">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-medium">11th October 2025</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/80">
              <MapPin className="h-5 w-5 text-secondary" />
              <span className="font-medium">ADCET Campus, Ashta</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/80">
              <Trophy className="h-5 w-5 text-accent" />
              <span className="font-medium">24+ Events</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/80">
              <Users className="h-5 w-5 text-neon-orange" />
              <span className="font-medium">₹100/- per participant</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="animate-scale-in flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="hero" 
              size="xl" 
              onClick={onExploreEvents}
              className="animate-float"
            >
              Explore Events
            </Button>
            {onRegister && (
              <Button 
                variant="outline" 
                size="xl" 
                onClick={onRegister}
                className="animate-float border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                style={{ animationDelay: '0.2s' }}
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Register Now
              </Button>
            )}
          </div>
          
          {/* Organizing Institution */}
          <div className="mt-12 text-center animate-fade-in">
            <p className="text-sm text-muted-foreground mb-2">Organized by</p>
            <h2 className="text-lg md:text-xl font-semibold text-foreground">
              Annasaheb Dange College of Engineering and Technology, Ashta
            </h2>
            <p className="text-sm text-muted-foreground">
              NAAC A++ Accredited | Shivaji University Affiliated
            </p>
          </div>
        </div>
      </div>
      
      {/* Floating geometric elements - disabled for better performance */}
      {/* <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-lg animate-float z-15" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-20 w-16 h-16 bg-secondary/20 rounded-full animate-float z-15" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-20 w-12 h-12 bg-accent/20 rotate-45 animate-float z-15" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-neon-orange/20 rounded-lg animate-float z-15" style={{ animationDelay: '0.5s' }} /> */}
    </section>
  );
});