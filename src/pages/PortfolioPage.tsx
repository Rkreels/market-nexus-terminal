
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";

const PortfolioPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ModulePageLayout
      activeModule="portfolio"
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(!darkMode)}
    />
  );
};

export default PortfolioPage;
