
import { useState, useEffect } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import { useDetailView } from "@/hooks/useDetailView";
import { useToast } from "@/hooks/use-toast";
import MarketDataPanel from "@/components/panels/MarketDataPanel";

const MarketDataPage = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Detail view hooks for market data items (used globally)
  const {
    isDetailOpen,
    isEditMode,
    isDeleteDialogOpen,
    selectedItemId,
    viewItem,
    editItem,
    closeDetail,
    confirmDelete,
    cancelDelete,
    handleDelete
  } = useDetailView({
    onViewItem: (id) => {
      toast({
        title: "Viewing Market Data",
        description: `Viewing details for item ${id}`,
        duration: 2000,
      });
    },
    onEditItem: (id) => {
      toast({
        title: "Editing Market Data",
        description: `Editing item ${id}`,
        duration: 2000,
      });
    },
    onDeleteItem: (id) => {
      toast({
        title: "Market Data Deleted",
        description: `Item ${id} has been deleted`,
        duration: 2000,
      });
    }
  });
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Add dark mode class to root on initial load
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <ModulePageLayout 
      activeModule="market-data" 
      darkMode={darkMode} 
      toggleDarkMode={toggleDarkMode} 
    >
      <MarketDataPanel darkMode={darkMode} />
    </ModulePageLayout>
  );
};

export default MarketDataPage;
