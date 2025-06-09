
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MarketDataItem } from '@/types/marketData';
import { Timeframe } from '@/utils/timeframeUtils';

interface UIContextProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  handleAction: (action: string, type: string, id?: string, data?: any) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  selectedModule: string;
  setSelectedModule: (module: string) => void;
  toggleFilter: () => void;
  marketData: MarketDataItem[];
  addMarketDataItem: (item: MarketDataItem) => void;
  deleteMarketDataItem: (id: string) => void;
  editMarketDataItem: (id: string, updatedItem: MarketDataItem) => void;
  activeTimeframe: Timeframe;
  setActiveTimeframe: (timeframe: Timeframe) => void;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('dashboard');
  const [marketData, setMarketData] = useState<MarketDataItem[]>([
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      type: 'stock',
      value: 150.25,
      change: 2.5,
      percentChange: 1.69,
      direction: 'up',
      sector: 'Technology',
      lastUpdated: new Date().toISOString()
    },
    {
      id: '2',
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      type: 'stock',
      value: 285.60,
      change: -1.2,
      percentChange: -0.42,
      direction: 'down',
      sector: 'Technology',
      lastUpdated: new Date().toISOString()
    }
  ]);
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1M');
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    toast({
      title: "Theme Changed",
      description: `Switched to ${!isDarkMode ? 'dark' : 'light'} mode`,
      duration: 2000,
    });
  };

  const toggleFilter = () => {
    console.log('Toggle filter clicked');
    toast({
      title: "Filter Toggled",
      description: "Filter panel toggled",
      duration: 2000,
    });
  };

  const addMarketDataItem = (item: MarketDataItem) => {
    setMarketData(prev => [...prev, item]);
    console.log('Added market data item:', item);
  };

  const deleteMarketDataItem = (id: string) => {
    setMarketData(prev => prev.filter(item => item.id !== id));
    console.log('Deleted market data item:', id);
  };

  const editMarketDataItem = (id: string, updatedItem: MarketDataItem) => {
    setMarketData(prev => prev.map(item => 
      item.id === id ? { ...updatedItem, id } : item
    ));
    console.log('Updated market data item:', id, updatedItem);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleAction = (action: string, type: string, id?: string, data?: any) => {
    console.log(`UI Action: ${action} ${type}${id ? ` (ID: ${id})` : ''}`, data);
    
    try {
      setLoading(true);
      
      switch (action) {
        case 'add':
          toast({
            title: "Item Added",
            description: `New ${type} has been added successfully`,
            duration: 3000,
          });
          break;
        case 'edit':
          toast({
            title: "Item Updated",
            description: `${type} has been updated successfully`,
            duration: 3000,
          });
          break;
        case 'delete':
          toast({
            title: "Item Deleted",
            description: `${type} has been deleted successfully`,
            duration: 3000,
          });
          break;
        case 'view':
          toast({
            title: "Viewing Details",
            description: `Opening ${type} details`,
            duration: 2000,
          });
          break;
        case 'export':
          toast({
            title: "Export Started",
            description: `Exporting ${type} data`,
            duration: 2000,
          });
          break;
        case 'filter':
          toast({
            title: "Filter Applied",
            description: `Filtering ${type} data`,
            duration: 2000,
          });
          break;
        case 'search':
          toast({
            title: "Search Executed",
            description: `Searching ${type}`,
            duration: 2000,
          });
          break;
        default:
          toast({
            title: "Action Executed",
            description: `${action} performed on ${type}`,
            duration: 2000,
          });
      }
    } catch (error) {
      console.error('UI Action Error:', error);
      toast({
        title: "Action Failed",
        description: `Failed to ${action} ${type}`,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <UIContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      handleAction,
      isLoading,
      setLoading,
      globalSearchQuery,
      setGlobalSearchQuery,
      selectedModule,
      setSelectedModule,
      toggleFilter,
      marketData,
      addMarketDataItem,
      deleteMarketDataItem,
      editMarketDataItem,
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
