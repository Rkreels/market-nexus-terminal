
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MarketDataItem, Timeframe } from '@/types/marketData';

interface UIContextProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  marketData: MarketDataItem[];
  addMarketDataItem: (item: MarketDataItem) => void;
  editMarketDataItem: (id: string, updatedItem: MarketDataItem) => void;
  deleteMarketDataItem: (id: string) => void;
  handleAction: (action: string, itemType: string, itemId?: string) => void;
  toggleFilter: () => void;
  activeTimeframe: Timeframe;
  setActiveTimeframe: (timeframe: Timeframe) => void;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1M');
  const [marketData, setMarketData] = useState<MarketDataItem[]>([
    {
      id: "1",
      symbol: "AAPL",
      name: "Apple Inc.",
      type: "stock",
      value: 150.25,
      change: 2.5,
      percentChange: 1.69,
      direction: "up",
      sector: "Technology",
      lastUpdated: new Date().toISOString(),
      volume: 50000000,
      marketCap: 2500000000000,
      description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide."
    },
    {
      id: "2",
      symbol: "MSFT",
      name: "Microsoft Corporation",
      type: "stock",
      value: 285.6,
      change: -1.2,
      percentChange: -0.42,
      direction: "down",
      sector: "Technology",
      lastUpdated: new Date().toISOString(),
      volume: 35000000,
      marketCap: 2100000000000,
      description: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide."
    }
  ]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const addMarketDataItem = (item: MarketDataItem) => {
    setMarketData(prev => [...prev, item]);
  };

  const editMarketDataItem = (id: string, updatedItem: MarketDataItem) => {
    setMarketData(prev => prev.map(item => item.id === id ? updatedItem : item));
  };

  const deleteMarketDataItem = (id: string) => {
    setMarketData(prev => prev.filter(item => item.id !== id));
  };

  const handleAction = (action: string, itemType: string, itemId?: string) => {
    console.log(`Action: ${action}, Type: ${itemType}, ID: ${itemId}`);
    // Handle different actions here
    switch (action) {
      case 'add':
        console.log(`Adding new ${itemType}`);
        break;
      case 'edit':
        console.log(`Editing ${itemType} with ID: ${itemId}`);
        break;
      case 'view':
        console.log(`Viewing ${itemType} with ID: ${itemId}`);
        break;
      case 'delete':
        console.log(`Deleting ${itemType} with ID: ${itemId}`);
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  };

  const toggleFilter = () => {
    console.log('Toggling filter');
    // Implement filter toggle logic here
  };

  return (
    <UIContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      marketData,
      addMarketDataItem,
      editMarketDataItem,
      deleteMarketDataItem,
      handleAction,
      toggleFilter,
      activeTimeframe,
      setActiveTimeframe
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
