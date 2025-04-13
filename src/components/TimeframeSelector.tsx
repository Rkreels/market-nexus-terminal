
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Timeframe, timeframeOptions, getTimeframeLabel } from "@/utils/timeframeUtils";

interface TimeframeSelectorProps {
  darkMode: boolean;
  activeTimeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
  className?: string;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ 
  darkMode, 
  activeTimeframe,
  onTimeframeChange,
  className 
}) => {
  return (
    <div className={cn("px-4 py-2 border-t border-b flex items-center justify-between",
      darkMode ? "border-zinc-700 bg-zinc-800" : "border-gray-200 bg-gray-50",
      className
    )}>
      <div className="text-sm font-medium mr-2">Timeframe:</div>
      <div className="flex space-x-1 overflow-x-auto">
        {timeframeOptions.map((timeframe) => (
          <Button
            key={timeframe}
            variant={activeTimeframe === timeframe ? "default" : "outline"}
            size="sm"
            className={cn(
              "text-xs h-7 px-2",
              activeTimeframe === timeframe
                ? ""
                : darkMode
                ? "border-zinc-600 bg-zinc-700 hover:bg-zinc-600"
                : ""
            )}
            onClick={() => onTimeframeChange(timeframe)}
          >
            {getTimeframeLabel(timeframe)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimeframeSelector;
