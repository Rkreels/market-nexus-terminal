
import React from 'react';
import { Button } from "@/components/ui/button";
import { Timeframe, timeframeOptions } from "@/utils/timeframeUtils";
import { useUI } from "@/contexts/UIContext";
import { cn } from "@/lib/utils";

interface TimeframeSelectorProps {
  darkMode: boolean;
  className?: string;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ darkMode, className }) => {
  const { activeTimeframe, setActiveTimeframe } = useUI();

  const handleTimeframeChange = (timeframe: Timeframe) => {
    setActiveTimeframe(timeframe);
  };

  return (
    <div className={cn("flex border-t border-b px-4 py-2 overflow-x-auto gap-2 whitespace-nowrap scrollbar-none", 
      darkMode ? "border-gray-700" : "border-gray-200",
      className
    )}>
      {timeframeOptions.map(timeframe => (
        <Button 
          key={timeframe}
          variant={activeTimeframe === timeframe ? "default" : "outline"}
          size="sm"
          onClick={() => handleTimeframeChange(timeframe)}
          className="min-w-16"
        >
          {timeframe}
        </Button>
      ))}
    </div>
  );
};

export default TimeframeSelector;
