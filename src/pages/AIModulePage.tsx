
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";

const AIModulePage = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ModulePageLayout
      activeModule="ai"
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(!darkMode)}
    />
  );
};

export default AIModulePage;
