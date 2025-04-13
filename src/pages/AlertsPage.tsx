
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import AlertsPanel from "@/components/panels/AlertsPanel";
import { useUI } from "@/contexts/UIContext";

const AlertsPage = () => {
  const { isDarkMode, toggleDarkMode } = useUI();
  
  return (
    <ModulePageLayout 
      activeModule="alerts" 
      darkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode} 
    >
      <div className="p-6">
        <AlertsPanel darkMode={isDarkMode} />
      </div>
    </ModulePageLayout>
  );
};

export default AlertsPage;
