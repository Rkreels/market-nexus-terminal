
import { useEffect } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import { useDetailView } from "@/hooks/useDetailView";
import PortfolioDetail from "@/components/panels/PortfolioDetail";
import { useUI } from "@/contexts/UIContext";
import { useToast } from "@/hooks/use-toast";

const PortfolioPage = () => {
  const { isDarkMode, toggleDarkMode } = useUI();
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
  
  // Add data attributes to elements when component mounts
  useEffect(() => {
    // Add data attributes to portfolio-related elements for voice guidance
    const portfolioElements = document.querySelectorAll('.portfolio-item, .portfolio-chart, .portfolio-summary');
    portfolioElements.forEach(element => {
      element.setAttribute('data-component', 'portfolio-panel');
    });
  }, []);

  return (
    <ModulePageLayout 
      activeModule="portfolio" 
      darkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode} 
    >
      {/* Detail view for portfolio items */}
      <PortfolioDetail
        darkMode={isDarkMode}
        selectedItemId={selectedItemId}
        isOpen={isDetailOpen}
        isEditMode={isEditMode}
        onClose={closeDetail}
      />
    </ModulePageLayout>
  );
};

export default PortfolioPage;
