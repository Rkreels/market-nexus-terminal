
import { useEffect } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import { useUI } from "@/contexts/UIContext";

const TradingPage = () => {
  const { isDarkMode, toggleDarkMode } = useUI();
  
  // Add data attributes to elements when component mounts
  useEffect(() => {
    // Add data attributes to trading elements for voice guidance
    const tradingElements = document.querySelectorAll('.trading-order, .trading-history, .trading-position');
    tradingElements.forEach(element => {
      element.setAttribute('data-component', 'trading-panel');
    });
  }, []);

  return (
    <ModulePageLayout 
      activeModule="trading" 
      darkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode} 
    />
  );
};

export default TradingPage;
