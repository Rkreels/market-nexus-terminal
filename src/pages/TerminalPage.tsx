
import { useEffect } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";
import { useUI } from "@/contexts/UIContext";

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
    />
  );
};

export default TerminalPage;
