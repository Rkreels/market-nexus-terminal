
import { useEffect } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import { useUI } from "@/contexts/UIContext";

const AIModulePage = () => {
  const { isDarkMode, toggleDarkMode } = useUI();
  
  // Add data attributes to elements when component mounts
  useEffect(() => {
    // Add data attributes to AI module elements for voice guidance
    const aiElements = document.querySelectorAll('.ai-prediction, .ai-insight, .ai-recommendation');
    aiElements.forEach(element => {
      element.setAttribute('data-component', 'ai-panel');
    });
  }, []);

  return (
    <ModulePageLayout 
      activeModule="ai" 
      darkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode} 
    />
  );
};

export default AIModulePage;
