
import { useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, 
         SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from "@/components/ui/sidebar";
import { LayoutDashboard, LineChart, Briefcase, Newspaper, Bell, BookOpen, CircleDollarSign, 
         BarChart3, TrendingUp, Globe, Bot, Terminal, MoonStar, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import DashboardView from "@/components/DashboardView";

const PortfolioPage = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const { toast } = useToast();
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
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
                    isActive={false} 
                    onClick={() => toast({
                      title: "Module Changed",
                      description: "Navigated to Dashboard module",
                      duration: 2000,
                    })}
                    tooltip="Dashboard"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={false} 
                    onClick={() => toast({
                      title: "Module Changed",
                      description: "Navigated to Market Data module",
                      duration: 2000,
                    })}
                    tooltip="Market Data"
                  >
                    <LineChart className="w-5 h-5" />
                    <span>Market Data</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={true}
                    tooltip="Portfolio"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>Portfolio</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={false} 
                    onClick={() => toast({
                      title: "Module Changed",
                      description: "Navigated to News module",
                      duration: 2000,
                    })}
                    tooltip="News"
                  >
                    <Newspaper className="w-5 h-5" />
                    <span>News & Sentiment</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={false} 
                    onClick={() => toast({
                      title: "Module Changed",
                      description: "Navigated to Alerts module",
                      duration: 2000,
                    })}
                    tooltip="Alerts"
                  >
                    <Bell className="w-5 h-5" />
                    <span>Alerts & Watchlists</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={false} 
                    onClick={() => toast({
                      title: "Module Changed",
                      description: "Navigated to Research module",
                      duration: 2000,
                    })}
                    tooltip="Research"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Research</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={false} 
                    onClick={() => toast({
                      title: "Module Changed",
                      description: "Navigated to Trading module",
                      duration: 2000,
                    })}
                    tooltip="Trading"
                  >
                    <CircleDollarSign className="w-5 h-5" />
                    <span>Trading</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={false} 
                    onClick={() => toast({
                      title: "Module Changed",
                      description: "Navigated to Risk module",
                      duration: 2000,
                    })}
                    tooltip="Risk"
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>Risk Analytics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={false} 
                    onClick={() => toast({
                      title: "Module Changed",
                      description: "Navigated to Fixed Income module",
                      duration: 2000,
                    })}
                    tooltip="Fixed Income"
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>Fixed Income</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={false} 
                    onClick={() => toast({
                      title: "Module Changed",
                      description: "Navigated to Macro module",
                      duration: 2000,
                    })}
                    tooltip="Macro"
                  >
                    <Globe className="w-5 h-5" />
                    <span>Macro Economy</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={false} 
                    onClick={() => toast({
                      title: "Module Changed",
                      description: "Navigated to AI module",
                      duration: 2000,
                    })}
                    tooltip="AI"
                  >
                    <Bot className="w-5 h-5" />
                    <span>AI Module</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={false} 
                    onClick={() => toast({
                      title: "Module Changed",
                      description: "Navigated to Terminal module",
                      duration: 2000,
                    })}
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
            <DashboardView activeModule="portfolio" darkMode={darkMode} />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default PortfolioPage;
