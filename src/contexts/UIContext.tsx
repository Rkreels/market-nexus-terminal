
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MarketDataItem } from '@/types/marketData';

interface UIContextProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  marketData: MarketDataItem[];
  addMarketDataItem: (item: MarketDataItem) => void;
  editMarketDataItem: (id: string, updatedItem: MarketDataItem) => void;
  deleteMarketDataItem: (id: string) => void;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
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
      lastUpdated: new Date().toISOString()
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
      lastUpdated: new Date().toISOString()
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

  return (
    <UIContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      marketData,
      addMarketDataItem,
      editMarketDataItem,
      deleteMarketDataItem
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
