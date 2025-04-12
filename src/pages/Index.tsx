
import { useState, useEffect } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";

const Index = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Add dark mode class to root on initial load
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <ModulePageLayout 
      activeModule="dashboard" 
      darkMode={darkMode} 
      toggleDarkMode={toggleDarkMode} 
    />
  );
};

export default Index;
