
import { FC, ReactNode } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, 
         SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from "@/components/ui/sidebar";
import { LayoutDashboard, LineChart, Briefcase, Newspaper, Bell, BookOpen, CircleDollarSign, 
         BarChart3, TrendingUp, Globe, Bot, Terminal, MoonStar, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import DashboardView from "@/components/DashboardView";

interface ModulePageLayoutProps {
  activeModule: string;
  darkMode: boolean;
  toggleDarkMode: () => void;
  children?: ReactNode;
}

const ModulePageLayout: FC<ModulePageLayoutProps> = ({ 
  activeModule, 
  darkMode, 
  toggleDarkMode,
  children 
}) => {
  const { toast } = useToast();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { id: "market-data", label: "Market Data", icon: LineChart, path: "/market-data" },
    { id: "portfolio", label: "Portfolio", icon: Briefcase, path: "/portfolio" },
    { id: "news", label: "News & Sentiment", icon: Newspaper, path: "/news" },
    { id: "alerts", label: "Alerts & Watchlists", icon: Bell, path: "/alerts" },
    { id: "research", label: "Research", icon: BookOpen, path: "/research" },
    { id: "trading", label: "Trading", icon: CircleDollarSign, path: "/trading" },
    { id: "risk", label: "Risk Analytics", icon: BarChart3, path: "/risk" },
    { id: "fixed-income", label: "Fixed Income", icon: TrendingUp, path: "/fixed-income" },
    { id: "macro", label: "Macro Economy", icon: Globe, path: "/macro" },
    { id: "ai", label: "AI Module", icon: Bot, path: "/ai" },
    { id: "terminal", label: "Terminal", icon: Terminal, path: "/terminal" }
  ];

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
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      isActive={activeModule === item.id}
                      asChild={activeModule !== item.id}
                      tooltip={item.label}
                    >
                      {activeModule === item.id ? (
                        <div className="flex items-center">
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </div>
                      ) : (
                        <Link 
                          to={item.path}
                          className="flex items-center w-full"
                          onClick={() => toast({
                            title: "Module Changed",
                            description: `Navigated to ${item.label} module`,
                            duration: 2000,
                          })}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className={cn("p-4 text-xs text-center", darkMode ? "text-gray-400" : "text-gray-500")}>
              Market Nexus Terminal v1.0
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            {children || <DashboardView activeModule={activeModule} darkMode={darkMode} />}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ModulePageLayout;
