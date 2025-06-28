
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";

const MarketDataPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ModulePageLayout
      activeModule="market-data"
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(!darkMode)}
    />
  );
};

export default MarketDataPage;
