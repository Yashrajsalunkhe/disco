import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Atom } from "lucide-react";

interface NavbarProps {
  onNavigate?: (section: string) => void;
}

export const FloatingNavbar = ({ onNavigate }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    } else {
      // Default scroll behavior for sections
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/20 backdrop-blur-xl border border-white/40"
          : "bg-black/10 backdrop-blur-lg border border-white/30"
      } rounded-full px-6 py-3 flex items-center gap-6`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 text-white">
        <div className="w-8 h-8 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
          <Atom className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-lg">Discovery</span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavClick("home")}
          className="text-white/90 hover:text-white hover:bg-white/5 rounded-full px-4 py-2 transition-all duration-200"
        >
          Home
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavClick("about")}
          className="text-white/90 hover:text-white hover:bg-white/5 rounded-full px-4 py-2 transition-all duration-200"
        >
          About
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavClick("events")}
          className="text-white/90 hover:text-white hover:bg-white/5 rounded-full px-4 py-2 transition-all duration-200"
        >
          Events
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavClick("registration")}
          className="text-white/90 hover:text-white hover:bg-white/5 rounded-full px-4 py-2 transition-all duration-200"
        >
          Register
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavClick("contact")}
          className="text-white/90 hover:text-white hover:bg-white/5 rounded-full px-4 py-2 transition-all duration-200"
        >
          Contact
        </Button>
      </div>
    </nav>
  );
};
