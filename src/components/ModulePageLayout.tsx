
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
  Sun,
  Search,
  ExternalLink
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
import { Button } from "@/components/ui/button";
import DashboardView from "@/components/DashboardView";
import GlobalSearch from "@/components/GlobalSearch";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVoiceTrainer } from "@/contexts/VoiceTrainerContext";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { speak, setCurrentContext, announceNavigation } = useVoiceTrainer();
  const isMobile = useIsMobile();

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

  // Set voice context on module change
  useEffect(() => {
    setCurrentContext(activeModule);
    speak(`Now viewing ${activeModule.replace('-', ' ')} module. Use keyboard shortcuts or navigation menu to explore features.`, 'medium');
  }, [activeModule, setCurrentContext, speak]);

  // Enhanced keyboard shortcuts with voice feedback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        speak('Global search opened. Type to search across all modules and data.', 'high');
      }
      
      // Voice shortcut - V key
      if (e.key === 'v' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeElement = document.activeElement;
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          speak(`Current module: ${activeModule.replace('-', ' ')}. Available features: Market data analysis, portfolio management, news sentiment, and trading tools. Use tab to navigate or say help for assistance.`, 'high');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeModule, speak]);

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
      speak(`Already in ${moduleId.replace('-', ' ')} module`, 'medium');
      return;
    }

    const fromModule = activeModule.replace('-', ' ');
    const toModule = moduleId.replace('-', ' ');
    
    announceNavigation(fromModule, toModule);
    
    toast({
      title: "Module Changed",
      description: `Navigating to ${moduleId} module`,
      duration: 2000,
    });

    navigate(routes[moduleId]);
  };

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
    speak('Search activated. You can search for stocks, news, portfolio items, and market data across all modules.', 'medium');
  };

  const handleThemeToggle = () => {
    toggleDarkMode();
    speak(darkMode ? 'Switched to light theme' : 'Switched to dark theme', 'medium');
  };

  return (
    <div className={cn("min-h-screen transition-colors", darkMode ? "dark bg-zinc-900" : "bg-white")}>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex min-h-screen w-full">
          <Sidebar 
            side="left" 
            variant="sidebar" 
            collapsible="icon"
            className={cn(
              "transition-all duration-300",
              isMobile ? "w-full sm:w-64" : "w-64"
            )}
          >
            <SidebarHeader className="flex items-center justify-between px-2 sm:px-4 py-2">
              <h1 className={cn(
                "text-sm sm:text-lg font-bold truncate", 
                darkMode ? "text-white" : "text-black"
              )}>
                Market Nexus
              </h1>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSearchOpen}
                  className={cn(
                    "p-1 sm:p-2", 
                    darkMode ? "text-white hover:bg-zinc-800" : "text-black hover:bg-gray-200"
                  )}
                  title="Global Search (Ctrl+K)"
                >
                  <Search size={isMobile ? 14 : 16} />
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleThemeToggle}
                  className={cn(
                    "dark-mode-toggle p-1 sm:p-2", 
                    darkMode ? "text-white hover:bg-zinc-800" : "text-black hover:bg-gray-200"
                  )}
                  title="Toggle theme"
                >
                  {darkMode ? <Sun size={isMobile ? 14 : 16} /> : <MoonStar size={isMobile ? 14 : 16} />}
                </Button>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "dashboard"} 
                    onClick={() => handleModuleChange("dashboard")}
                    tooltip="Dashboard - Main overview"
                    className="sidebar-icon text-xs sm:text-sm"
                  >
                    <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "market-data"} 
                    onClick={() => handleModuleChange("market-data")}
                    tooltip="Market Data - Real-time market information"
                    className="text-xs sm:text-sm"
                  >
                    <LineChart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Market Data</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "portfolio"} 
                    onClick={() => handleModuleChange("portfolio")}
                    tooltip="Portfolio - Manage your investments"
                    className="text-xs sm:text-sm"
                  >
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Portfolio</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "news"} 
                    onClick={() => handleModuleChange("news")}
                    tooltip="News & Sentiment Analysis"
                    className="text-xs sm:text-sm"
                  >
                    <Newspaper className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">News & Sentiment</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "alerts"} 
                    onClick={() => handleModuleChange("alerts")}
                    tooltip="Alerts & Watchlists - Price alerts and tracking"
                    className="text-xs sm:text-sm"
                  >
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Alerts & Watchlists</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "research"} 
                    onClick={() => handleModuleChange("research")}
                    tooltip="Research - Market analysis and reports"
                    className="text-xs sm:text-sm"
                  >
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Research</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "trading"} 
                    onClick={() => handleModuleChange("trading")}
                    tooltip="Trading - Execute trades and orders"
                    className="text-xs sm:text-sm"
                  >
                    <CircleDollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Trading</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "risk"} 
                    onClick={() => handleModuleChange("risk")}
                    tooltip="Risk Analytics - Portfolio risk assessment"
                    className="text-xs sm:text-sm"
                  >
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Risk Analytics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "fixed-income"} 
                    onClick={() => handleModuleChange("fixed-income")}
                    tooltip="Fixed Income - Bonds and fixed income securities"
                    className="text-xs sm:text-sm"
                  >
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Fixed Income</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "macro"} 
                    onClick={() => handleModuleChange("macro")}
                    tooltip="Macro Economy - Economic indicators and trends"
                    className="text-xs sm:text-sm"
                  >
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Macro Economy</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "ai"} 
                    onClick={() => handleModuleChange("ai")}
                    tooltip="AI Module - Artificial intelligence insights"
                    className="text-xs sm:text-sm"
                  >
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">AI Module</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeModule === "terminal"} 
                    onClick={() => handleModuleChange("terminal")}
                    tooltip="Terminal - Advanced trading terminal"
                    className="text-xs sm:text-sm"
                  >
                    <Terminal className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Terminal</span>
                  </SidebarMenuButton>
                 </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => window.open('https://skillsim.vercel.app/dashboard', '_self')}
                    tooltip="Master Dashboard - External dashboard portal"
                    className="text-xs sm:text-sm"
                  >
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Master Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className={cn(
              "p-2 sm:p-4 text-xs text-center", 
              darkMode ? "text-gray-400" : "text-gray-500"
            )}>
              <div className="hidden sm:block">Market Nexus Terminal v1.0</div>
              <div className="text-xs text-center">Press V for voice help</div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="flex-1">
            <ScrollArea disableScrollBar={true} className="flex-1 overflow-y-auto">
              <DashboardView activeModule={activeModule} darkMode={darkMode} />
              {children}
            </ScrollArea>
          </SidebarInset>
        </div>
      </SidebarProvider>
      
      <GlobalSearch 
        darkMode={darkMode}
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          speak('Search closed', 'low');
        }}
      />
    </div>
  );
};

export default ModulePageLayout;
