
import { useUI } from "@/contexts/UIContext";
import ModulePageLayout from "@/components/ModulePageLayout";
import AlertsPanel from "@/components/panels/AlertsPanel";

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
