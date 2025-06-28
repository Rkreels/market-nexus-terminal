
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ModulePageLayout
      activeModule="dashboard"
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
    />
  );
};

export default Index;
