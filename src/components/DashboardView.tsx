
import { FC, useEffect } from "react";
import { cn } from "@/lib/utils";
import MarketDataPanel from "./panels/MarketDataPanel";
import StockDetailPanel from "./panels/StockDetailPanel";
import WatchlistPanel from "./panels/WatchlistPanel";
import NewsPanel from "./panels/NewsPanel";
import PortfolioPanel from "./panels/PortfolioPanel";
import ResearchPanel from "./panels/ResearchPanel";
import AlertsPanel from "./panels/AlertsPanel";
import TradingPanel from "./panels/TradingPanel";
import RiskAnalyticsPanel from "./panels/RiskAnalyticsPanel";
import FixedIncomePanel from "./panels/FixedIncomePanel";
import MacroEconomyPanel from "./panels/MacroEconomyPanel";
import AIModulePanel from "./panels/AIModulePanel";
import TerminalPanel from "./panels/TerminalPanel";
import DashboardSummaryPanel from "./panels/DashboardSummaryPanel";
import { useVoiceTrainer } from "@/contexts/VoiceTrainerContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardViewProps {
  activeModule: string;
  darkMode: boolean;
}

const DashboardView: FC<DashboardViewProps> = ({ activeModule, darkMode }) => {
  const { speak } = useVoiceTrainer();
  const isMobile = useIsMobile();

  console.log(`DashboardView: Rendering activeModule = ${activeModule}`);
  
  // Announce module details when component mounts or module changes
  useEffect(() => {
    const moduleDescriptions: Record<string, string> = {
      "dashboard": "Main dashboard with overview of portfolio, market data, and news. Contains summary cards and key metrics.",
      "market-data": "Real-time market data with stock prices, charts, and market analytics. Add symbols and create watchlists.",
      "portfolio": "Portfolio management with holdings, performance tracking, and allocation analysis.",
      "news": "Latest financial news with sentiment analysis and market impact scores.",
      "alerts": "Price alerts and watchlist management with customizable notification settings.",
      "research": "Research reports, analyst recommendations, and fundamental analysis tools.",
      "trading": "Trading interface with order management, execution, and trading history.",
      "risk": "Risk analytics with portfolio risk metrics, VaR calculations, and stress testing.",
      "fixed-income": "Fixed income securities analysis with bond pricing and yield calculations.",
      "macro": "Macroeconomic indicators, central bank data, and economic calendar.",
      "ai": "AI-powered insights, predictions, and automated analysis tools.",
      "terminal": "Advanced trading terminal with professional tools and real-time data feeds."
    };

    const description = moduleDescriptions[activeModule] || "Module under development";
    speak(description, 'low');
  }, [activeModule, speak]);

  // Render the appropriate content based on the active module
  const renderContent = () => {
    switch (activeModule) {
      case "dashboard":
        console.log("DashboardView: Rendering dashboard module");
        return (
          <div className="grid grid-cols-1 gap-2 sm:gap-4 p-2 sm:p-4">
            <DashboardSummaryPanel darkMode={darkMode} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4">
              <MarketDataPanel darkMode={darkMode} />
              <PortfolioPanel darkMode={darkMode} />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 sm:gap-4">
              <div className="xl:col-span-2">
                <NewsPanel darkMode={darkMode} />
              </div>
              <div>
                <WatchlistPanel darkMode={darkMode} />
              </div>
            </div>
          </div>
        );
      case "market-data":
        console.log("DashboardView: Rendering market-data module");
        return (
          <div className="p-2 sm:p-4">
            <h2 className={cn(
              "text-xl sm:text-2xl font-bold mb-2 sm:mb-4", 
              darkMode ? "text-white" : "text-black"
            )}>
              Market Data & Analytics
            </h2>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 sm:gap-4">
              <div className="xl:col-span-2">
                <MarketDataPanel darkMode={darkMode} />
              </div>
              <div className="xl:col-span-1">
                <WatchlistPanel darkMode={darkMode} />
              </div>
              <div className="xl:col-span-3">
                <StockDetailPanel darkMode={darkMode} />
              </div>
            </div>
          </div>
        );
      case "portfolio":
        console.log("DashboardView: Rendering portfolio module");
        return (
          <div className="p-2 sm:p-4">
            <h2 className={cn(
              "text-xl sm:text-2xl font-bold mb-2 sm:mb-4", 
              darkMode ? "text-white" : "text-black"
            )}>
              Portfolio Management
            </h2>
            <PortfolioPanel darkMode={darkMode} />
          </div>
        );
      case "research":
        console.log("DashboardView: Rendering research module");
        return (
          <div className="p-2 sm:p-4">
            <h2 className={cn(
              "text-xl sm:text-2xl font-bold mb-2 sm:mb-4", 
              darkMode ? "text-white" : "text-black"
            )}>
              Research & Intelligence
            </h2>
            <ResearchPanel darkMode={darkMode} />
          </div>
        );
      case "news":
        console.log("DashboardView: Rendering news module");
        return (
          <div className="p-2 sm:p-4">
            <h2 className={cn(
              "text-xl sm:text-2xl font-bold mb-2 sm:mb-4", 
              darkMode ? "text-white" : "text-black"
            )}>
              News & Sentiment
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4">
              <NewsPanel darkMode={darkMode} />
              <StockDetailPanel darkMode={darkMode} />
            </div>
          </div>
        );
      case "alerts":
        console.log("DashboardView: Rendering alerts module");
        return (
          <div className="p-2 sm:p-4">
            <h2 className={cn(
              "text-xl sm:text-2xl font-bold mb-2 sm:mb-4", 
              darkMode ? "text-white" : "text-black"
            )}>
              Alerts & Watchlists
            </h2>
            <AlertsPanel darkMode={darkMode} />
          </div>
        );
      case "trading":
        console.log("DashboardView: Rendering trading module");
        return (
          <div className="p-2 sm:p-4">
            <h2 className={cn(
              "text-xl sm:text-2xl font-bold mb-2 sm:mb-4", 
              darkMode ? "text-white" : "text-black"
            )}>
              Trading
            </h2>
            <TradingPanel darkMode={darkMode} />
          </div>
        );
      case "risk":
        console.log("DashboardView: Rendering risk module");
        return (
          <div className="p-2 sm:p-4">
            <h2 className={cn(
              "text-xl sm:text-2xl font-bold mb-2 sm:mb-4", 
              darkMode ? "text-white" : "text-black"
            )}>
              Risk Analytics
            </h2>
            <RiskAnalyticsPanel darkMode={darkMode} />
          </div>
        );
      case "fixed-income":
        console.log("DashboardView: Rendering fixed-income module");
        return (
          <div className="p-2 sm:p-4">
            <h2 className={cn(
              "text-xl sm:text-2xl font-bold mb-2 sm:mb-4", 
              darkMode ? "text-white" : "text-black"
            )}>
              Fixed Income
            </h2>
            <FixedIncomePanel darkMode={darkMode} />
          </div>
        );
      case "macro":
        console.log("DashboardView: Rendering macro module");
        return (
          <div className="p-2 sm:p-4">
            <h2 className={cn(
              "text-xl sm:text-2xl font-bold mb-2 sm:mb-4", 
              darkMode ? "text-white" : "text-black"
            )}>
              Macro Economy
            </h2>
            <MacroEconomyPanel darkMode={darkMode} />
          </div>
        );
      case "ai":
        console.log("DashboardView: Rendering ai module");
        return (
          <div className="p-2 sm:p-4">
            <h2 className={cn(
              "text-xl sm:text-2xl font-bold mb-2 sm:mb-4", 
              darkMode ? "text-white" : "text-black"
            )}>
              AI Module
            </h2>
            <AIModulePanel darkMode={darkMode} />
          </div>
        );
      case "terminal":
        console.log("DashboardView: Rendering terminal module");
        return (
          <div className="p-2 sm:p-4">
            <h2 className={cn(
              "text-xl sm:text-2xl font-bold mb-2 sm:mb-4", 
              darkMode ? "text-white" : "text-black"
            )}>
              Terminal
            </h2>
            <TerminalPanel darkMode={darkMode} />
          </div>
        );
      default:
        console.log(`DashboardView: Rendering default module for ${activeModule}`);
        return (
          <div className="flex items-center justify-center h-full p-4">
            <div className={cn("text-center p-4 sm:p-8", darkMode ? "text-white" : "text-black")}>
              <h2 className="text-lg sm:text-2xl font-bold mb-2">
                {activeModule.charAt(0).toUpperCase() + activeModule.slice(1).replace(/-/g, ' ')} Module
              </h2>
              <p className={cn("text-sm sm:text-lg", darkMode ? "text-gray-300" : "text-gray-700")}>
                This module is under development. Check back soon for updates.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={cn("w-full h-full transition-colors", 
      darkMode ? "bg-zinc-900 text-white" : "bg-gray-100 text-black"
    )}>
      <header className={cn(
        "border-b px-3 sm:px-6 py-2 sm:py-3", 
        darkMode ? "border-gray-800 bg-zinc-800" : "border-gray-200 bg-white"
      )}>
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold truncate">
            {activeModule.charAt(0).toUpperCase() + activeModule.slice(1).replace(/-/g, ' ')}
          </h1>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className={cn(
              "px-2 sm:px-3 py-1 rounded-full text-xs", 
              darkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800"
            )}>
              Market Open
            </div>
            <div className={cn(
              "text-xs sm:text-sm", 
              darkMode ? "text-gray-300" : "text-gray-600"
            )}>
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>
      <main className={cn(
        "overflow-auto",
        isMobile ? "h-[calc(100vh-57px)]" : "h-[calc(100vh-57px)]"
      )}>
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardView;
