
import { useEffect } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import { useUI } from "@/contexts/UIContext";

const RiskAnalyticsPage = () => {
  const { isDarkMode, toggleDarkMode } = useUI();
  
  // Add data attributes to elements when component mounts
  useEffect(() => {
    // Add data attributes to risk elements for voice guidance
    const riskElements = document.querySelectorAll('.risk-metric, .risk-chart, .risk-summary');
    riskElements.forEach(element => {
      element.setAttribute('data-component', 'risk-panel');
    });
  }, []);

  return (
    <ModulePageLayout 
      activeModule="risk" 
      darkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode} 
    />
  );
};

export default RiskAnalyticsPage;
