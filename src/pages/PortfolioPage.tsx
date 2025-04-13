
import { useState, useEffect } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import { useDetailView } from "@/hooks/useDetailView";
import PortfolioDetail from "@/components/panels/PortfolioDetail";
import { useToast } from "@/hooks/use-toast";

const PortfolioPage = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Detail view hooks for portfolio items
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
        title: "Viewing Portfolio Item",
        description: `Viewing details for item ${id}`,
        duration: 2000,
      });
    },
    onEditItem: (id) => {
      toast({
        title: "Editing Portfolio Item",
        description: `Editing item ${id}`,
        duration: 2000,
      });
    },
    onDeleteItem: (id) => {
      toast({
        title: "Portfolio Item Deleted",
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
      activeModule="portfolio" 
      darkMode={darkMode} 
      toggleDarkMode={toggleDarkMode} 
    >
      {/* Detail view for portfolio items */}
      <PortfolioDetail
        darkMode={darkMode}
        selectedItemId={selectedItemId}
        isOpen={isDetailOpen}
        isEditMode={isEditMode}
        onClose={closeDetail}
      />
    </ModulePageLayout>
  );
};

export default PortfolioPage;
