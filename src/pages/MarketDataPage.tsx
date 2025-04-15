
import ModulePageLayout from "@/components/ModulePageLayout";
import MarketDataPanel from "@/components/panels/MarketDataPanel";
import { useUI } from "@/contexts/UIContext";

const MarketDataPage = () => {
  const { isDarkMode, toggleDarkMode } = useUI();
  
  return (
    <ModulePageLayout 
      activeModule="market-data" 
      darkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode} 
    >
      <div className="p-6">
        <MarketDataPanel darkMode={isDarkMode} />
      </div>
    </ModulePageLayout>
  );
};

export default MarketDataPage;
