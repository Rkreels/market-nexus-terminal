import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Timeframe, timeframeOptions } from "@/utils/timeframeUtils";
import { MarketDataItem } from "@/types/marketData";
import { v4 as uuidv4 } from 'uuid';

// Mock market data
const initialMarketData: MarketDataItem[] = [
  {
    id: "AAPL",
    name: "Apple Inc.",
    symbol: "AAPL",
    type: "stock",
    value: 172.82,
    change: 3.78,
    percentChange: 2.24,
    direction: "up",
    lastUpdated: new Date().toISOString(),
    description: "Consumer electronics and software company",
    sector: "Technology",
    marketCap: 2820000000000,
    volume: 58690000
  },
  {
    id: "MSFT",
    name: "Microsoft Corporation",
    symbol: "MSFT",
    type: "stock",
    value: 415.42,
    change: -1.26,
    percentChange: -0.30,
    direction: "down",
    lastUpdated: new Date().toISOString(),
    description: "Software and cloud computing company",
    sector: "Technology",
    marketCap: 3090000000000,
    volume: 24500000
  },
  {
    id: "GOOGL",
    name: "Alphabet Inc.",
    symbol: "GOOGL",
    type: "stock",
    value: 172.45,
    change: 2.18,
    percentChange: 1.28,
    direction: "up",
    lastUpdated: new Date().toISOString(),
    description: "Internet services and products company",
    sector: "Technology",
    marketCap: 2750000000000,
    volume: 26300000
  },
  {
    id: "BTC",
    name: "Bitcoin",
    symbol: "BTC",
    type: "crypto",
    value: 68421.31,
    change: 1531.24,
    percentChange: 2.29,
    direction: "up",
    lastUpdated: new Date().toISOString(),
    description: "Cryptocurrency and digital payment system",
    sector: "Cryptocurrency",
    marketCap: 1340000000000,
    volume: 32400000000
  },
  {
    id: "SPY",
    name: "SPDR S&P 500 ETF",
    symbol: "SPY",
    type: "index",
    value: 518.75,
    change: -1.32,
    percentChange: -0.25,
    direction: "down",
    lastUpdated: new Date().toISOString(),
    description: "ETF tracking the S&P 500 Index",
    sector: "Index Fund",
    marketCap: null,
    volume: 67500000
  }
];

interface UIContextProps {
  activeTimeframe: Timeframe;
  setActiveTimeframe: (timeframe: Timeframe) => void;
  handleAction: (action: string, item: string, additionalInfo?: string) => void;
  isFilterOpen: boolean;
  toggleFilter: () => void;
  applyFilter: (filterData: any) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  marketData: MarketDataItem[];
  addMarketDataItem: (item: MarketDataItem) => void;
  deleteMarketDataItem: (id: string) => void;
  editMarketDataItem: (id: string, updatedItem: Partial<MarketDataItem>) => void;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1M');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [marketData, setMarketData] = useState<MarketDataItem[]>(initialMarketData);
  const { toast } = useToast();

  // Initialize dark mode
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const addMarketDataItem = (item: MarketDataItem) => {
    const newItem = {
      ...item,
      id: item.id || uuidv4(),
      lastUpdated: new Date().toISOString()
    };
    
    setMarketData(prev => [...prev, newItem]);
    
    toast({
      title: "Market Data Added",
      description: `${item.name} (${item.symbol}) has been added to market data`,
      duration: 3000,
    });
  };

  const deleteMarketDataItem = (id: string) => {
    setMarketData(prev => {
      const itemToDelete = prev.find(item => item.id === id);
      const newData = prev.filter(item => item.id !== id);
      
      if (itemToDelete) {
        toast({
          title: "Market Data Deleted",
          description: `${itemToDelete.name} (${itemToDelete.symbol}) has been removed`,
          duration: 3000,
        });
      }
      
      return newData;
    });
  };

  const editMarketDataItem = (id: string, updatedItem: Partial<MarketDataItem>) => {
    setMarketData(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const updated = { 
            ...item, 
            ...updatedItem,
            lastUpdated: new Date().toISOString() 
          };
          
          toast({
            title: "Market Data Updated",
            description: `${updated.name} (${updated.symbol}) has been updated`,
            duration: 3000,
          });
          
          return updated;
        }
        return item;
      });
    });
  };

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
      applyFilter,
      isDarkMode,
      toggleDarkMode,
      marketData,
      addMarketDataItem,
      deleteMarketDataItem,
      editMarketDataItem
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
