
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";

const FixedIncomePage = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ModulePageLayout
      activeModule="fixed-income"
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(!darkMode)}
    />
  );
};

export default FixedIncomePage;
