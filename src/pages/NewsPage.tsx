
import { useState, useEffect } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";

const NewsPage = () => {
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
      activeModule="news" 
      darkMode={darkMode} 
      toggleDarkMode={toggleDarkMode} 
    />
  );
};

export default NewsPage;
