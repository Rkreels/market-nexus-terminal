
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";

const TradingPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ModulePageLayout
      activeModule="trading"
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(!darkMode)}
    />
  );
};

export default TradingPage;
