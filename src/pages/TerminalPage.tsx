
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";

const TerminalPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ModulePageLayout
      activeModule="terminal"
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(!darkMode)}
    />
  );
};

export default TerminalPage;
