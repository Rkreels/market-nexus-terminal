
import { useEffect } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import { useUI } from "@/contexts/UIContext";
import TradingPanel from "@/components/panels/TradingPanel";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    >
      <ScrollArea disableScrollBar={true} className="h-full">
        <div className="p-6">
          <TradingPanel darkMode={isDarkMode} />
        </div>
      </ScrollArea>
    </ModulePageLayout>
  );
};

export default TradingPage;
