
import { useState } from "react";
import ModulePageLayout from "@/components/ModulePageLayout";

const NewsPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ModulePageLayout
      activeModule="news"
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(!darkMode)}
    />
  );
};

export default NewsPage;
