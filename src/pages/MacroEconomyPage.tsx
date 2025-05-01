
import { useEffect } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import { useUI } from "@/contexts/UIContext";
import MacroEconomyPanel from "@/components/panels/MacroEconomyPanel";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    >
      <ScrollArea disableScrollBar={true} className="h-full">
        <div className="p-6">
          <MacroEconomyPanel darkMode={isDarkMode} />
        </div>
      </ScrollArea>
    </ModulePageLayout>
  );
};

export default MacroEconomyPage;
