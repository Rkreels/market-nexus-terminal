
import { useEffect } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import { useUI } from "@/contexts/UIContext";

const NewsPage = () => {
  const { isDarkMode, toggleDarkMode } = useUI();
  
  // Add data attributes to elements when component mounts
  useEffect(() => {
    // Add data attributes to news elements for voice guidance
    const newsElements = document.querySelectorAll('.news-item, .news-feed, .news-filter');
    newsElements.forEach(element => {
      element.setAttribute('data-component', 'news-panel');
    });
  }, []);

  return (
    <ModulePageLayout 
      activeModule="news" 
      darkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode} 
    />
  );
};

export default NewsPage;
