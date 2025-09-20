import { useState, useCallback, memo } from "react";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { DepartmentGrid, Department } from "@/components/DepartmentGrid";
import { EventsList } from "@/components/EventsList";
import { EventDetails } from "@/components/EventDetails";
import { ScheduleSection } from "@/components/ScheduleSection";
import { ContactSection } from "@/components/ContactSection";
import { RegistrationForm } from "@/components/RegistrationForm";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { Event } from "@/data/events";

type ViewState = 
  | { type: 'home' }
  | { type: 'events'; department: Department }
  | { type: 'event-details'; event: Event }
  | { type: 'registration'; event?: Event };

const Index = memo(() => {
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'home' });

  const handleExploreEvents = useCallback(() => {
    const departmentsSection = document.getElementById('departments');
    departmentsSection?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleDepartmentSelect = useCallback((department: Department) => {
    setCurrentView({ type: 'events', department });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleEventSelect = useCallback((event: Event) => {
    setCurrentView({ type: 'event-details', event });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleEventRegister = useCallback((event?: Event) => {
    setCurrentView({ type: 'registration', event });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGeneralRegister = useCallback(() => {
    setCurrentView({ type: 'registration' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackToHome = useCallback(() => {
    setCurrentView({ type: 'home' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigation = useCallback((section: string) => {
    if (section === 'home') {
      handleBackToHome();
    } else if (section === 'registration') {
      setCurrentView({ type: 'registration' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Ensure we're on the home view first
      if (currentView.type !== 'home') {
        setCurrentView({ type: 'home' });
        // Wait for the view to change, then scroll
        setTimeout(() => {
          const element = document.getElementById(section);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [currentView.type, handleBackToHome]);

  const handleBackToEvents = useCallback(() => {
    if (currentView.type === 'event-details' || currentView.type === 'registration') {
      // Get the department from the event to go back to the right events list
      const event = currentView.event;
      const departmentId = event.department.toLowerCase().replace(/[^a-z]/g, '');
      
      // Find the matching department
      const departmentMap: Record<string, Department> = {
        'aeronauticalengineering': {
          id: 'aeronautical',
          name: 'Aeronautical Engineering',
          icon: null,
          eventCount: 3,
          gradient: 'from-neon-blue to-primary'
        },
        'mechanicalengineering': {
          id: 'mechanical',
          name: 'Mechanical Engineering', 
          icon: null,
          eventCount: 3,
          gradient: 'from-neon-orange to-accent'
        },
        'electricalengineering': {
          id: 'electrical',
          name: 'Electrical Engineering',
          icon: null,
          eventCount: 3,
          gradient: 'from-neon-green to-secondary'
        },
        'civilengineering': {
          id: 'civil',
          name: 'Civil Engineering',
          icon: null,
          eventCount: 3,
          gradient: 'from-neon-purple to-primary'
        },
        'computerscienceengineering': {
          id: 'cse',
          name: 'Computer Science Engineering',
          icon: null,
          eventCount: 3,
          gradient: 'from-primary to-neon-pink'
        },
        'aidatascience': {
          id: 'aids',
          name: 'AI & Data Science',
          icon: null,
          eventCount: 3,
          gradient: 'from-secondary to-neon-blue'
        },
        'iotcybersecurity': {
          id: 'iot',
          name: 'IoT & Cyber Security',
          icon: null,
          eventCount: 3,
          gradient: 'from-accent to-neon-green'
        },
        'businessadministration': {
          id: 'bba',
          name: 'Business Administration',
          icon: null,
          eventCount: 1,
          gradient: 'from-neon-orange to-neon-purple'
        },
        'foodtechnology': {
          id: 'food',
          name: 'Food Technology',
          icon: null,
          eventCount: 2,
          gradient: 'from-neon-pink to-neon-orange'
        }
      };

      const department = departmentMap[departmentId];
      if (department) {
        setCurrentView({ type: 'events', department });
      } else {
        handleBackToHome();
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, handleBackToHome]);

  if (currentView.type === 'registration') {
    return (
      <div>
        <FloatingNavbar onNavigate={handleNavigation} />
        <RegistrationForm 
          eventTitle={currentView.event?.name}
          onBack={currentView.event ? handleBackToEvents : handleBackToHome}
        />
      </div>
    );
  }

  if (currentView.type === 'events') {
    return (
      <div>
        <FloatingNavbar onNavigate={handleNavigation} />
        <EventsList 
          department={currentView.department}
          onBack={handleBackToHome}
          onEventSelect={handleEventSelect}
        />
      </div>
    );
  }

  if (currentView.type === 'event-details') {
    return (
      <div>
        <FloatingNavbar onNavigate={handleNavigation} />
        <EventDetails 
          event={currentView.event}
          onBack={handleBackToEvents}
          onRegister={() => handleEventRegister(currentView.event)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <FloatingNavbar onNavigate={handleNavigation} />
      <div id="home">
        <HeroSection 
          onExploreEvents={handleExploreEvents} 
          onRegister={handleGeneralRegister}
        />
      </div>
      <div id="about">
        <AboutSection />
      </div>
      <div id="events">
        <DepartmentGrid onDepartmentSelect={handleDepartmentSelect} />
      </div>
      <ScheduleSection />
      <div id="contact">
        <ContactSection />
      </div>
    </div>
  );
});

export default Index;