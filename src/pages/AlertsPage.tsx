
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";

const AlertsPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ModulePageLayout
      activeModule="alerts"
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(!darkMode)}
    />
  );
};

export default AlertsPage;
