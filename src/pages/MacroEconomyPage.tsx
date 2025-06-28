
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";

const MacroEconomyPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ModulePageLayout
      activeModule="macro"
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(!darkMode)}
    />
  );
};

export default MacroEconomyPage;
