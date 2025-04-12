
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Timeframe, timeframeOptions } from "@/utils/timeframeUtils";

interface UIContextProps {
  activeTimeframe: Timeframe;
  setActiveTimeframe: (timeframe: Timeframe) => void;
  handleAction: (action: string, item: string, additionalInfo?: string) => void;
  isFilterOpen: boolean;
  toggleFilter: () => void;
  applyFilter: (filterData: any) => void;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1M');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { toast } = useToast();

  const handleAction = (action: string, item: string, additionalInfo?: string) => {
    let message = '';
    let description = '';
    
    switch (action) {
      case 'add':
        message = `Add ${item}`;
        description = `Adding new ${item.toLowerCase()}`;
        break;
      case 'edit':
        message = `Edit ${item}`;
        description = `Editing ${item.toLowerCase()} ${additionalInfo ? additionalInfo : ''}`;
        break;
      case 'view':
        message = `View ${item}`;
        description = `Viewing ${item.toLowerCase()} details ${additionalInfo ? additionalInfo : ''}`;
        break;
      case 'delete':
        message = `Delete ${item}`;
        description = `${item} has been deleted ${additionalInfo ? additionalInfo : ''}`;
        break;
      default:
        message = action;
        description = additionalInfo || '';
    }

    toast({
      title: message,
      description: description,
      duration: 3000,
    });
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const applyFilter = (filterData: any) => {
    toast({
      title: "Filters Applied",
      description: `Applied filters: ${Object.keys(filterData).join(', ')}`,
      duration: 3000,
    });
  };

  return (
    <UIContext.Provider value={{
      activeTimeframe,
      setActiveTimeframe,
      handleAction,
      isFilterOpen,
      toggleFilter,
      applyFilter
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextProps => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
