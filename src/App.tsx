
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UIProvider, useUI } from "@/contexts/UIContext";
import { VoiceTrainerProvider } from '@/contexts/VoiceTrainerContext';
import VoiceTrainer from '@/components/VoiceTrainer';
import { ActionModal } from "@/components/ui/modal";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MarketDataPage from "./pages/MarketDataPage";
import PortfolioPage from "./pages/PortfolioPage";
import ResearchPage from "./pages/ResearchPage";
import NewsPage from "./pages/NewsPage";
import AlertsPage from "./pages/AlertsPage";
import TradingPage from "./pages/TradingPage";
import RiskAnalyticsPage from "./pages/RiskAnalyticsPage";
import FixedIncomePage from "./pages/FixedIncomePage";
import MacroEconomyPage from "./pages/MacroEconomyPage";
import AIModulePage from "./pages/AIModulePage";
import TerminalPage from "./pages/TerminalPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <UIProvider>
            <VoiceTrainerProvider>
              <Toaster />
              <Sonner />
              <VoiceTrainer />
              <GlobalModal />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/market-data" element={<MarketDataPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/research" element={<ResearchPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/trading" element={<TradingPage />} />
                <Route path="/risk" element={<RiskAnalyticsPage />} />
                <Route path="/fixed-income" element={<FixedIncomePage />} />
                <Route path="/macro" element={<MacroEconomyPage />} />
                <Route path="/ai" element={<AIModulePage />} />
                <Route path="/terminal" element={<TerminalPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </VoiceTrainerProvider>
          </UIProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const GlobalModal = () => {
  const { modalState, closeModal } = useUI();
  
  return (
    <ActionModal
      isOpen={modalState.isOpen}
      onClose={closeModal}
      action={modalState.type}
      itemType={modalState.itemType}
      itemId={modalState.itemId}
    />
  );
};

export default App;
