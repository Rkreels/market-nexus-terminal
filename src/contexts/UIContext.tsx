
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

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
      setSelectedModule
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
