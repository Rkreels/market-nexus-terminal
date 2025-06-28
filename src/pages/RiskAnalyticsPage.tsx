
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";

const RiskAnalyticsPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ModulePageLayout
      activeModule="risk"
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(!darkMode)}
    />
  );
};

export default RiskAnalyticsPage;
