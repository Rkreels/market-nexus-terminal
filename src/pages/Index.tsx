
import { useEffect } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import { useUI } from "@/contexts/UIContext";

const Index = () => {
  const { isDarkMode, toggleDarkMode } = useUI();
  
  // Add data attributes to elements when component mounts
  useEffect(() => {
    // Add data attributes to dashboard elements for voice guidance
    const dashboardElements = document.querySelectorAll('.dashboard-widget, .dashboard-summary, .dashboard-chart');
    dashboardElements.forEach(element => {
      if (element.getAttribute('data-component') === null) {
        element.setAttribute('data-component', 'dashboard-panel');
      }
    });
  }, []);

  return (
    <ModulePageLayout 
      activeModule="dashboard" 
      darkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode} 
    />
  );
};

export default Index;
