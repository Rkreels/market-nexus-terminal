
import { useState, useEffect } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import MarketDataPanel from "@/components/panels/MarketDataPanel";
import GlobalSearch from "@/components/GlobalSearch";
import { useUI } from "@/contexts/UIContext";
import { useVoiceTrainer } from "@/contexts/VoiceTrainerContext";

const MarketDataPage = () => {
  const { isDarkMode, toggleDarkMode } = useUI();
  const { setCurrentContext } = useVoiceTrainer();
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  
  useEffect(() => {
    setCurrentContext('market-data');
    
    // Add keyboard shortcut for global search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentContext]);
  
  return (
    <ModulePageLayout 
      activeModule="market-data" 
      darkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode} 
    >
      <div className="p-6">
        <MarketDataPanel darkMode={isDarkMode} />
      </div>
      
      <GlobalSearch
        darkMode={isDarkMode}
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
      />
    </ModulePageLayout>
  );
};

export default MarketDataPage;
