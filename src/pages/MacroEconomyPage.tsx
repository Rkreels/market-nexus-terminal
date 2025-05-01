
import { useEffect } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import { useUI } from "@/contexts/UIContext";

const MacroEconomyPage = () => {
  const { isDarkMode, toggleDarkMode } = useUI();
  
  // Add data attributes to elements when component mounts
  useEffect(() => {
    // Add data attributes to macro economy elements for voice guidance
    const macroElements = document.querySelectorAll('.macro-indicator, .macro-chart, .macro-table');
    macroElements.forEach(element => {
      element.setAttribute('data-component', 'macro-panel');
    });
  }, []);

  return (
    <ModulePageLayout 
      activeModule="macro" 
      darkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode} 
    />
  );
};

export default MacroEconomyPage;
