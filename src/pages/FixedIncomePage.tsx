
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import FixedIncomePanel from "@/components/panels/FixedIncomePanel";
import { useUI } from "@/contexts/UIContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const FixedIncomePage = () => {
  const { isDarkMode, toggleDarkMode } = useUI();
  
  return (
    <ModulePageLayout 
      activeModule="fixed-income" 
      darkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode} 
    >
      <ScrollArea disableScrollBar={true} className="h-full">
        <div className="p-6">
          <FixedIncomePanel darkMode={isDarkMode} />
        </div>
      </ScrollArea>
    </ModulePageLayout>
  );
};

export default FixedIncomePage;
