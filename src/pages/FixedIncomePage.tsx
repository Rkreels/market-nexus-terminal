
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import FixedIncomePanel from "@/components/panels/FixedIncomePanel";
import { useUI } from "@/contexts/UIContext";

const FixedIncomePage = () => {
  const { isDarkMode, toggleDarkMode } = useUI();
  
  return (
    <ModulePageLayout 
      activeModule="fixed-income" 
      darkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode} 
    >
      <div className="p-6">
        <FixedIncomePanel darkMode={isDarkMode} />
      </div>
    </ModulePageLayout>
  );
};

export default FixedIncomePage;
