
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";

const PortfolioPage = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <ModulePageLayout 
      activeModule="portfolio" 
      darkMode={darkMode} 
      toggleDarkMode={toggleDarkMode} 
    />
  );
};

export default PortfolioPage;
