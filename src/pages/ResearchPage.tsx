
import { useEffect } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import { useUI } from "@/contexts/UIContext";
import ResearchPanel from "@/components/panels/ResearchPanel";
import { ScrollArea } from "@/components/ui/scroll-area";

const ResearchPage = () => {
  const { isDarkMode, toggleDarkMode } = useUI();
  
  // Add data attributes to elements when component mounts
  useEffect(() => {
    // Add data attributes to research elements for voice guidance
    const researchElements = document.querySelectorAll('.research-paper, .research-report, .research-analysis');
    researchElements.forEach(element => {
      element.setAttribute('data-component', 'research-panel');
    });
  }, []);

  return (
    <ModulePageLayout 
      activeModule="research" 
      darkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode} 
    >
      <ScrollArea disableScrollBar={true} className="h-full">
        <div className="p-6">
          <ResearchPanel darkMode={isDarkMode} />
        </div>
      </ScrollArea>
    </ModulePageLayout>
  );
};

export default ResearchPage;
