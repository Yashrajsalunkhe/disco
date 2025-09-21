import { memo, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Zap, ZapOff, X } from "lucide-react";

interface PerformanceToggleProps {
  onToggle: (enabled: boolean) => void;
  initialState?: boolean;
}

export const PerformanceToggle = memo(({ onToggle, initialState = true }: PerformanceToggleProps) => {
  const [isHighPerformance, setIsHighPerformance] = useState(initialState);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    // Load saved preference
    const saved = localStorage.getItem('galaxy-performance');
    if (saved !== null) {
      const enabled = JSON.parse(saved);
      setIsHighPerformance(enabled);
      onToggle(enabled);
    }
  }, [onToggle]);

  const handleToggle = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    // If clicked 3 times quickly, completely disable Galaxy
    if (newClickCount >= 3) {
      setIsHighPerformance(false);
      localStorage.setItem('galaxy-performance', JSON.stringify(false));
      onToggle(false);
      setClickCount(0);
      return;
    }
    
    const newState = !isHighPerformance;
    setIsHighPerformance(newState);
    localStorage.setItem('galaxy-performance', JSON.stringify(newState));
    onToggle(newState);
    
    // Reset click count after 2 seconds
    setTimeout(() => setClickCount(0), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border"
      title={
        clickCount >= 2 
          ? "Click once more to completely disable animations" 
          : isHighPerformance 
          ? "Disable animations for better performance" 
          : "Enable animations"
      }
    >
      {isHighPerformance ? (
        <>
          <Zap className="h-4 w-4 mr-2" />
          High Performance
        </>
      ) : (
        <>
          <ZapOff className="h-4 w-4 mr-2" />
          Low Performance
        </>
      )}
      {clickCount >= 2 && <X className="h-3 w-3 ml-1 text-destructive" />}
    </Button>
  );
});