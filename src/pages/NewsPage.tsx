
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";

const NewsPage = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <ModulePageLayout 
      activeModule="news" 
      darkMode={darkMode} 
      toggleDarkMode={toggleDarkMode} 
    />
  );
};

export default NewsPage;
