
import { useEffect } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import { useUI } from "@/contexts/UIContext";
import TerminalPanel from "@/components/panels/TerminalPanel";
import { ScrollArea } from "@/components/ui/scroll-area";

const TerminalPage = () => {
  const { isDarkMode, toggleDarkMode } = useUI();
  
  // Add data attributes to elements when component mounts
  useEffect(() => {
    // Add data attributes to terminal elements for voice guidance
    const terminalElements = document.querySelectorAll('.terminal-command, .terminal-output, .terminal-history');
    terminalElements.forEach(element => {
      element.setAttribute('data-component', 'terminal-panel');
    });
  }, []);

  return (
    <ModulePageLayout 
      activeModule="terminal" 
      darkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode} 
    >
      <ScrollArea disableScrollBar={true} className="h-full">
        <div className="p-6">
          <TerminalPanel darkMode={isDarkMode} />
        </div>
      </ScrollArea>
    </ModulePageLayout>
  );
};

export default TerminalPage;
