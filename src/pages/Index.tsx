
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";

const Index = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <ModulePageLayout 
      activeModule="dashboard" 
      darkMode={darkMode} 
      toggleDarkMode={toggleDarkMode} 
    />
  );
};

export default Index;
