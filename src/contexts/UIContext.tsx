
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MarketDataItem, Timeframe, Alert, Watchlist, WatchlistItem } from '@/types/marketData';
import { getPortfolioHoldings } from '@/services/mockDataService';

interface UIContextProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  marketData: MarketDataItem[];
  addMarketDataItem: (item: MarketDataItem) => void;
  editMarketDataItem: (id: string, updatedItem: MarketDataItem) => void;
  deleteMarketDataItem: (id: string) => void;
  watchlists: Watchlist[];
  addWatchlist: (watchlist: Omit<Watchlist, 'id'>) => void;
  editWatchlist: (id: number, updatedWatchlist: Watchlist) => void;
  deleteWatchlist: (id: number) => void;
  addToWatchlist: (watchlistId: number, item: WatchlistItem) => void;
  removeFromWatchlist: (watchlistId: number, symbol: string) => void;
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id'>) => void;
  editAlert: (id: number, updatedAlert: Alert) => void;
  deleteAlert: (id: number) => void;
  portfolioHoldings: any[];
  addHolding: (holding: any) => void;
  editHolding: (id: string, updatedHolding: any) => void;
  deleteHolding: (id: string) => void;
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
    },
    {
      id: "3",
      symbol: "TSLA",
      name: "Tesla Inc.",
      type: "stock",
      value: 245.50,
      change: 5.2,
      percentChange: 2.17,
      direction: "up",
      sector: "Automotive",
      lastUpdated: new Date().toISOString(),
      volume: 45000000,
      marketCap: 780000000000,
      description: "Tesla Inc. designs, develops, manufactures, and sells electric vehicles and energy storage systems."
    },
    {
      id: "4",
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      type: "stock",
      value: 140.25,
      change: -1.1,
      percentChange: -0.78,
      direction: "down",
      sector: "Technology",
      lastUpdated: new Date().toISOString(),
      volume: 28000000,
      marketCap: 1800000000000,
      description: "Alphabet Inc. provides online advertising services through its subsidiary Google."
    }
  ]);

  const [watchlists, setWatchlists] = useState<Watchlist[]>([
    {
      id: 1,
      name: "Tech Stocks",
      symbols: [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 150.25, change: 2.5, direction: 'up' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 285.6, change: -1.2, direction: 'down' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 140.25, change: -1.1, direction: 'down' }
      ]
    },
    {
      id: 2,
      name: "EV Leaders",
      symbols: [
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.50, change: 5.2, direction: 'up' }
      ]
    }
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: 'price',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      condition: 'above',
      value: 160,
      currentValue: 150.25,
      status: 'pending',
      created: new Date().toISOString()
    },
    {
      id: 2,
      type: 'volume',
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      condition: 'above',
      value: 50000000,
      currentValue: 45000000,
      status: 'pending',
      created: new Date().toISOString()
    }
  ]);

  const [portfolioHoldings, setPortfolioHoldings] = useState(getPortfolioHoldings());

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

  // Watchlist functions
  const addWatchlist = (watchlist: Omit<Watchlist, 'id'>) => {
    const newWatchlist = { ...watchlist, id: Date.now() };
    setWatchlists(prev => [...prev, newWatchlist]);
  };

  const editWatchlist = (id: number, updatedWatchlist: Watchlist) => {
    setWatchlists(prev => prev.map(w => w.id === id ? updatedWatchlist : w));
  };

  const deleteWatchlist = (id: number) => {
    setWatchlists(prev => prev.filter(w => w.id !== id));
  };

  const addToWatchlist = (watchlistId: number, item: WatchlistItem) => {
    setWatchlists(prev => prev.map(w => 
      w.id === watchlistId 
        ? { ...w, symbols: [...w.symbols.filter(s => s.symbol !== item.symbol), item] }
        : w
    ));
  };

  const removeFromWatchlist = (watchlistId: number, symbol: string) => {
    setWatchlists(prev => prev.map(w => 
      w.id === watchlistId 
        ? { ...w, symbols: w.symbols.filter(s => s.symbol !== symbol) }
        : w
    ));
  };

  // Alert functions
  const addAlert = (alert: Omit<Alert, 'id'>) => {
    const newAlert = { ...alert, id: Date.now() };
    setAlerts(prev => [...prev, newAlert]);
  };

  const editAlert = (id: number, updatedAlert: Alert) => {
    setAlerts(prev => prev.map(a => a.id === id ? updatedAlert : a));
  };

  const deleteAlert = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Portfolio functions  
  const addHolding = (holding: any) => {
    const newHolding = { ...holding, id: `holding-${Date.now()}` };
    setPortfolioHoldings(prev => [...prev, newHolding]);
  };

  const editHolding = (id: string, updatedHolding: any) => {
    setPortfolioHoldings(prev => prev.map(h => h.id === id ? updatedHolding : h));
  };

  const deleteHolding = (id: string) => {
    setPortfolioHoldings(prev => prev.filter(h => h.id !== id));
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
      watchlists,
      addWatchlist,
      editWatchlist,
      deleteWatchlist,
      addToWatchlist,
      removeFromWatchlist,
      alerts,
      addAlert,
      editAlert,
      deleteAlert,
      portfolioHoldings,
      addHolding,
      editHolding,
      deleteHolding,
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
