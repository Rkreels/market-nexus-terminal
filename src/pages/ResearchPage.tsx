
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";

const ResearchPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ModulePageLayout
      activeModule="research"
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(!darkMode)}
    />
  );
};

export default ResearchPage;
