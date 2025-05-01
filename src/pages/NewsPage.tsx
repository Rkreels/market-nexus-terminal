
import { useEffect } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import { useUI } from "@/contexts/UIContext";
import NewsPanel from "@/components/panels/NewsPanel";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    >
      <ScrollArea disableScrollBar={true} className="h-full">
        <div className="p-6">
          <NewsPanel darkMode={isDarkMode} />
        </div>
      </ScrollArea>
    </ModulePageLayout>
  );
};

export default NewsPage;
