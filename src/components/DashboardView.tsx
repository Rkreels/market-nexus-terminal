
import { FC } from "react";
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

interface DashboardViewProps {
  activeModule: string;
  darkMode: boolean;
}

const DashboardView: FC<DashboardViewProps> = ({ activeModule, darkMode }) => {
  // Render the appropriate content based on the active module
  const renderContent = () => {
    switch (activeModule) {
      case "dashboard":
        return (
          <div className="grid grid-cols-1 gap-4 p-4">
            <DashboardSummaryPanel darkMode={darkMode} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <NewsPanel darkMode={darkMode} />
              </div>
              <div>
                <WatchlistPanel darkMode={darkMode} />
              </div>
            </div>
          </div>
        );
      case "market-data":
        return (
          <div className="p-4">
            <h2 className={cn("text-2xl font-bold mb-4", darkMode ? "text-white" : "text-black")}>
              Market Data & Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <MarketDataPanel darkMode={darkMode} />
              </div>
              <div className="lg:col-span-1">
                <WatchlistPanel darkMode={darkMode} />
              </div>
              <div className="lg:col-span-3">
                <StockDetailPanel darkMode={darkMode} />
              </div>
            </div>
          </div>
        );
      case "portfolio":
        return (
          <div className="p-4">
            <h2 className={cn("text-2xl font-bold mb-4", darkMode ? "text-white" : "text-black")}>
              Portfolio Management
            </h2>
            <PortfolioPanel darkMode={darkMode} />
          </div>
        );
      case "research":
        return (
          <div className="p-4">
            <h2 className={cn("text-2xl font-bold mb-4", darkMode ? "text-white" : "text-black")}>
              Research & Intelligence
            </h2>
            <ResearchPanel darkMode={darkMode} />
          </div>
        );
      case "news":
        return (
          <div className="p-4">
            <h2 className={cn("text-2xl font-bold mb-4", darkMode ? "text-white" : "text-black")}>
              News & Sentiment
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <NewsPanel darkMode={darkMode} />
              <StockDetailPanel darkMode={darkMode} />
            </div>
          </div>
        );
      case "alerts":
        return (
          <div className="p-4">
            <h2 className={cn("text-2xl font-bold mb-4", darkMode ? "text-white" : "text-black")}>
              Alerts & Watchlists
            </h2>
            <AlertsPanel darkMode={darkMode} />
          </div>
        );
      case "trading":
        return (
          <div className="p-4">
            <h2 className={cn("text-2xl font-bold mb-4", darkMode ? "text-white" : "text-black")}>
              Trading
            </h2>
            <TradingPanel darkMode={darkMode} />
          </div>
        );
      case "risk":
        return (
          <div className="p-4">
            <h2 className={cn("text-2xl font-bold mb-4", darkMode ? "text-white" : "text-black")}>
              Risk Analytics
            </h2>
            <RiskAnalyticsPanel darkMode={darkMode} />
          </div>
        );
      case "fixed-income":
        return (
          <div className="p-4">
            <h2 className={cn("text-2xl font-bold mb-4", darkMode ? "text-white" : "text-black")}>
              Fixed Income
            </h2>
            <FixedIncomePanel darkMode={darkMode} />
          </div>
        );
      case "macro":
        return (
          <div className="p-4">
            <h2 className={cn("text-2xl font-bold mb-4", darkMode ? "text-white" : "text-black")}>
              Macro Economy
            </h2>
            <MacroEconomyPanel darkMode={darkMode} />
          </div>
        );
      case "ai":
        return (
          <div className="p-4">
            <h2 className={cn("text-2xl font-bold mb-4", darkMode ? "text-white" : "text-black")}>
              AI Module
            </h2>
            <AIModulePanel darkMode={darkMode} />
          </div>
        );
      case "terminal":
        return (
          <div className="p-4">
            <h2 className={cn("text-2xl font-bold mb-4", darkMode ? "text-white" : "text-black")}>
              Terminal
            </h2>
            <TerminalPanel darkMode={darkMode} />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className={cn("text-center p-8", darkMode ? "text-white" : "text-black")}>
              <h2 className="text-2xl font-bold mb-2">
                {activeModule.charAt(0).toUpperCase() + activeModule.slice(1).replace(/-/g, ' ')} Module
              </h2>
              <p className={cn("text-lg", darkMode ? "text-gray-300" : "text-gray-700")}>
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
      <header className={cn("border-b px-6 py-3", 
        darkMode ? "border-gray-800 bg-zinc-800" : "border-gray-200 bg-white"
      )}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {activeModule.charAt(0).toUpperCase() + activeModule.slice(1).replace(/-/g, ' ')}
          </h1>
          <div className="flex items-center space-x-2">
            <div className={cn("px-3 py-1 rounded-full text-xs", 
              darkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800"
            )}>
              Market Open
            </div>
            <div className={cn("text-sm", 
              darkMode ? "text-gray-300" : "text-gray-600"
            )}>
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>
      <main className="h-[calc(100vh-57px)] overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardView;
