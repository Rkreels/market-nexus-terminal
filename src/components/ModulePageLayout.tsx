import React, { useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  LineChart, 
  Briefcase, 
  Newspaper, 
  Bell, 
  BookOpen, 
  CircleDollarSign, 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Bot, 
  Terminal,
  MoonStar,
  Sun
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarFooter,
  SidebarInset
} from "@/components/ui/sidebar";
import DashboardView from "@/components/DashboardView";
import { useToast } from "@/hooks/use-toast";
import FilterPanel from "@/components/FilterPanel";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ModulePageLayoutProps {
  activeModule: string;
  darkMode: boolean;
  toggleDarkMode: () => void;
  children?: ReactNode;
}

const ModulePageLayout: React.FC<ModulePageLayoutProps> = ({ 
  activeModule, 
  darkMode, 
  toggleDarkMode,
  children
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      setIsInitialized(true);
    }
  }, [darkMode, isInitialized]);

  const handleModuleChange = (moduleId: string) => {
    const routes: Record<string, string> = {
      "dashboard": "/",
      "market-data": "/market-data",
      "portfolio": "/portfolio",
      "news": "/news",
      "alerts": "/alerts",
      "research": "/research",
      "trading": "/trading",
      "risk": "/risk",
      "fixed-income": "/fixed-income",
      "macro": "/macro",
      "ai": "/ai",
      "terminal": "/terminal"
    };

    if (location.pathname === routes[moduleId]) {
      return;
    }

    toast({
      title: "Module Changed",
      description: `Navigating to ${moduleId} module`,
      duration: 2000,
    });

    navigate(routes[moduleId]);
  };

  return (
    <div className={cn("min-h-screen transition-colors", darkMode ? "dark bg-zinc-900" : "bg-white")}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <Sidebar side="left" variant="sidebar" collapsible="icon">
            <SidebarHeader className="flex items-center justify-between px-4 py-2">
              <h1 className={cn("text-lg font-bold truncate", darkMode ? "text-white" : "text-black")}>
                Market Nexus
              </h1>
              <button 
                onClick={toggleDarkMode}
                className={cn("p-2 rounded-md", 
                  darkMode ? "text-white hover:bg-zinc-800" : "text-black hover:bg-gray-200"
                )}
              >
                {darkMode ? <Sun size={18} /> : <MoonStar size={18} />}
              </button>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "dashboard"} 
                    onClick={() => handleModuleChange("dashboard")}
                    tooltip="Dashboard"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "market-data"} 
                    onClick={() => handleModuleChange("market-data")}
                    tooltip="Market Data"
                  >
                    <LineChart className="w-5 h-5" />
                    <span>Market Data</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "portfolio"} 
                    onClick={() => handleModuleChange("portfolio")}
                    tooltip="Portfolio"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>Portfolio</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "news"} 
                    onClick={() => handleModuleChange("news")}
                    tooltip="News"
                  >
                    <Newspaper className="w-5 h-5" />
                    <span>News & Sentiment</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "alerts"} 
                    onClick={() => handleModuleChange("alerts")}
                    tooltip="Alerts"
                  >
                    <Bell className="w-5 h-5" />
                    <span>Alerts & Watchlists</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "research"} 
                    onClick={() => handleModuleChange("research")}
                    tooltip="Research"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Research</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "trading"} 
                    onClick={() => handleModuleChange("trading")}
                    tooltip="Trading"
                  >
                    <CircleDollarSign className="w-5 h-5" />
                    <span>Trading</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "risk"} 
                    onClick={() => handleModuleChange("risk")}
                    tooltip="Risk"
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>Risk Analytics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "fixed-income"} 
                    onClick={() => handleModuleChange("fixed-income")}
                    tooltip="Fixed Income"
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>Fixed Income</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "macro"} 
                    onClick={() => handleModuleChange("macro")}
                    tooltip="Macro"
                  >
                    <Globe className="w-5 h-5" />
                    <span>Macro Economy</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "ai"} 
                    onClick={() => handleModuleChange("ai")}
                    tooltip="AI"
                  >
                    <Bot className="w-5 h-5" />
                    <span>AI Module</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "terminal"} 
                    onClick={() => handleModuleChange("terminal")}
                    tooltip="Terminal"
                  >
                    <Terminal className="w-5 h-5" />
                    <span>Terminal</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className={cn("p-4 text-xs text-center", darkMode ? "text-gray-400" : "text-gray-500")}>
              Market Nexus Terminal v1.0
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <ScrollArea disableScrollBar={true} className="flex-1 overflow-y-auto">
              <DashboardView activeModule={activeModule} darkMode={darkMode} />
              {children}
            </ScrollArea>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ModulePageLayout;
