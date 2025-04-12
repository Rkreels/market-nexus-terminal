
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";

const ResearchPage = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <ModulePageLayout 
      activeModule="research" 
      darkMode={darkMode} 
      toggleDarkMode={toggleDarkMode} 
    />
  );
};

export default ResearchPage;
