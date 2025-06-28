
import { useState, useEffect } from 'react';
import { Timeframe } from '@/types/marketData';
import { useUI } from '@/contexts/UIContext';

export const useTimeframeSelection = (initialTimeframe: Timeframe = '1M') => {
  const { activeTimeframe, setActiveTimeframe } = useUI();
  const [localTimeframe, setLocalTimeframe] = useState<Timeframe>(initialTimeframe);
  
  useEffect(() => {
    if (activeTimeframe !== localTimeframe) {
      setLocalTimeframe(activeTimeframe);
    }
  }, [activeTimeframe]);

  const handleTimeframeChange = (timeframe: Timeframe) => {
    setLocalTimeframe(timeframe);
    setActiveTimeframe(timeframe);
  };

  return {
    timeframe: localTimeframe,
    handleTimeframeChange
  };
};
