
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useVoiceTrainer } from '@/contexts/VoiceTrainerContext';
import { MicOff, Mic, PauseCircle, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUI } from '@/contexts/UIContext';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

// Enhanced component hints with detailed functionality descriptions
const componentHints: Record<string, string> = {
  // Navigation and core elements
  '.sidebar-icon, .sidebar-menu-button': 'Navigation sidebar with module access. Click any icon to switch between Market Data, Portfolio, News, Alerts, Research, Trading, Risk Analytics, Fixed Income, Macro Economy, AI Module, and Terminal sections.',
  
  // Market Data specific
  '[data-component="market-data-panel"]': 'Market Data panel showing real-time financial information. You can filter by asset type, search symbols, add new market data items, and view detailed charts with technical indicators.',
  '.add-button': 'Click to add new items. In Market Data, this opens a form to add stocks, crypto, indices, or commodities. Fill in symbol, name, type, and initial price.',
  '.filter-button': 'Opens advanced filtering options. Filter by asset type like stocks or crypto, categories like technology or healthcare, price ranges, and performance metrics.',
  '.view-button': 'View detailed information about selected item including price history, technical indicators, and comprehensive analytics with interactive charts.',
  '.edit-button': 'Modify existing item details such as name, symbol, category, or notes. Changes are saved automatically after confirmation.',
  '.delete-button': 'Permanently remove selected item from your data. You will be asked to confirm this irreversible action.',
  
  // Watchlist specific
  '[data-component="watchlist-panel"]': 'Personal watchlist for tracking favorite stocks and assets. Add symbols using the edit button, monitor real-time prices, and track percentage changes.',
  
  // Portfolio specific
  '[data-component="portfolio-panel"]': 'Portfolio management showing your holdings, asset allocation, performance metrics, and total portfolio value. View individual positions and their contribution to overall returns.',
  
  // News specific
  '[data-component="news-panel"]': 'Financial news feed with market-relevant articles. Filter by source, sentiment, or keywords. Click articles to read full content and analysis.',
  
  // Charts and data visualization
  '.chart-container': 'Interactive financial charts with zoom, pan, and indicator capabilities. Click and drag to zoom into specific time periods. Right-click for additional chart options and technical analysis tools.',
  
  // Stock detail timeframe controls
  'button[class*="timeframe"], .timeframe-button': 'Select chart timeframe from 1 day to 5 years. Each timeframe shows different data granularity - 1D shows hourly data, 1M shows daily data, 1Y shows weekly data.',
  
  // Trading specific
  '[data-component="trading-panel"]': 'Execute trades and manage orders. Place market, limit, or stop orders. Monitor order status and trading history with performance analytics.',
  
  // Risk analytics specific
  '[data-component="risk-panel"]': 'Risk management tools including Value at Risk calculations, stress testing, correlation analysis, and portfolio risk metrics.',
  
  // AI module specific
  '[data-component="ai-panel"]': 'AI-powered market insights and predictions. View machine learning generated forecasts, sentiment analysis, and pattern recognition results.',
  
  // Terminal specific
  '[data-component="terminal-panel"]': 'Command-line interface for advanced users. Execute custom queries, generate reports, and access API functions using terminal commands.',
  
  // Form elements
  'input[type="text"], input[type="search"]': 'Text input field. Click to focus and type your input. Use Tab to move between fields or Enter to submit forms.',
  'select, .select-trigger': 'Dropdown menu with multiple options. Click to open and select from available choices. Some dropdowns support multi-selection.',
  'button': 'Interactive button that performs specific actions. Button text indicates the action that will be performed when clicked.',
  
  // Dark mode
  '.dark-mode-toggle': 'Toggle between light and dark themes. Dark mode reduces eye strain in low-light environments and preferences are saved.',
};

// Comprehensive route-specific welcome messages
const routeWelcomeMessages: Record<string, string> = {
  '/': 'Welcome to Market Nexus Terminal dashboard. This is your financial command center with real-time market overview, portfolio summary, watchlists, and news feed. Navigate using the sidebar to access specialized modules for detailed analysis.',
  
  '/market-data': 'Market Data module provides comprehensive financial instrument analysis. Search and filter stocks, crypto, indices, and commodities. Add items to track, view detailed charts with technical indicators, and analyze price movements across different timeframes.',
  
  '/portfolio': 'Portfolio Management module tracks your investments and performance. View holdings, asset allocation, profit and loss, and portfolio analytics. Add positions, edit quantities, and monitor your investment strategy effectiveness.',
  
  '/watchlist': 'Watchlist module for monitoring favorite stocks and assets. Add symbols you are interested in, track real-time price changes, and organize by categories. Use the edit function to customize your lists.',
  
  '/news': 'News and Sentiment module aggregates financial news from multiple sources. Filter by relevance, sentiment analysis, and market impact. Stay informed about events affecting your investments and market trends.',
  
  '/alerts': 'Alerts and Notifications module for setting price alerts, volume alerts, and news notifications. Create custom alert conditions and manage notification preferences to stay updated on important market movements.',
  
  '/research': 'Research module provides in-depth market analysis, company reports, and investment research. Access fundamental data, analyst opinions, and comparative analysis tools for informed decision making.',
  
  '/trading': 'Trading module for executing market orders and managing trading activities. Place buy and sell orders, monitor execution status, and analyze trading performance with detailed transaction history.',
  
  '/risk': 'Risk Analytics module helps assess and manage investment risks. Calculate Value at Risk, perform stress tests, analyze correlations, and evaluate portfolio risk exposure across different scenarios.',
  
  '/fixed-income': 'Fixed Income module specialized for bond and debt instrument analysis. Evaluate yield curves, credit ratings, duration, and interest rate sensitivity for fixed income investments.',
  
  '/macro': 'Macro Economy module tracks broader economic indicators and their market impact. Monitor GDP, inflation, employment data, and central bank policies to understand market-driving forces.',
  
  '/ai': 'AI Module leverages machine learning for market insights and predictions. Access AI-generated forecasts, pattern recognition, sentiment analysis, and algorithmic trading recommendations.',
  
  '/terminal': 'Terminal module provides command-line interface for advanced operations. Execute complex queries, generate custom reports, and access API functions using professional-grade terminal commands.',
};

const VoiceTrainer: React.FC = () => {
  const location = useLocation();
  const { speak, stopSpeaking, isMuted, toggleMute, isPaused, setPaused, speakingText, setCurrentContext } = useVoiceTrainer();
  const { isDarkMode } = useUI();
  const [currentElement, setCurrentElement] = useState<string | null>(null);
  const cursorTimeoutRef = useRef<number | null>(null);
  const lastElementRef = useRef<string | null>(null);
  
  // Handle route changes with immediate context switching
  useEffect(() => {
    const path = location.pathname;
    
    // Stop any current speech immediately when route changes
    stopSpeaking();
    
    // Set new context
    setCurrentContext(path);
    
    const welcomeMessage = routeWelcomeMessages[path] || 
      `You are now in the ${path.substring(1).replace(/-/g, ' ')} section. This module provides specialized tools for ${path.substring(1).replace(/-/g, ' ')} operations. Explore the interface by hovering over different elements to learn about their specific functions.`;
    
    // Small delay for route transition
    const timer = setTimeout(() => {
      speak(welcomeMessage, 'high');
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location.pathname, speak, stopSpeaking, setCurrentContext]);
  
  // Enhanced cursor tracking with immediate response
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPaused || isMuted) return;
      
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (!element) return;
      
      const findMatchingElement = (el: Element | null): string | null => {
        if (!el) return null;
        
        // Check data-component first
        if (el.getAttribute('data-component')) {
          const dataComponentValue = el.getAttribute('data-component');
          const selector = `[data-component="${dataComponentValue}"]`;
          if (componentHints[selector]) return selector;
        }
        
        // Check for timeframe buttons specifically
        if (el.classList.contains('timeframe-button') || 
            el.tagName === 'BUTTON' && el.textContent?.match(/^(1D|1W|1M|3M|6M|1Y|5Y)$/)) {
          return 'button[class*="timeframe"], .timeframe-button';
        }
        
        // Check button types
        if (el.classList.contains('add-button')) return '.add-button';
        if (el.classList.contains('filter-button')) return '.filter-button';
        if (el.classList.contains('view-button')) return '.view-button';
        if (el.classList.contains('edit-button')) return '.edit-button';
        if (el.classList.contains('delete-button')) return '.delete-button';
        if (el.classList.contains('dark-mode-toggle')) return '.dark-mode-toggle';
        
        // Check element selectors
        for (const selector in componentHints) {
          try {
            if (el.matches(selector) || el.closest(selector)) {
              return selector;
            }
          } catch (error) {
            continue;
          }
        }
        
        // Check parent elements
        return findMatchingElement(el.parentElement);
      };
      
      const matchedSelector = findMatchingElement(element);
      
      if (matchedSelector && matchedSelector !== currentElement) {
        // Clear timeout and stop current speech immediately
        if (cursorTimeoutRef.current) {
          window.clearTimeout(cursorTimeoutRef.current);
        }
        
        // Stop current speech for immediate response
        if (matchedSelector !== lastElementRef.current) {
          stopSpeaking();
        }
        
        setCurrentElement(matchedSelector);
        lastElementRef.current = matchedSelector;
        
        // Shorter delay for better responsiveness
        cursorTimeoutRef.current = window.setTimeout(() => {
          const guidance = componentHints[matchedSelector];
          if (guidance) {
            speak(guidance, 'medium');
          }
          cursorTimeoutRef.current = null;
        }, 500);
      }
    };
    
    // Mouse leave handler to clear timeouts
    const handleMouseLeave = () => {
      if (cursorTimeoutRef.current) {
        window.clearTimeout(cursorTimeoutRef.current);
        cursorTimeoutRef.current = null;
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (cursorTimeoutRef.current) {
        window.clearTimeout(cursorTimeoutRef.current);
      }
    };
  }, [speak, stopSpeaking, currentElement, isPaused, isMuted]);
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 flex gap-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPaused(!isPaused)}
        className={`rounded-full p-2 ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-white hover:bg-gray-100'}`}
        title={isPaused ? "Resume voice assistant" : "Pause voice assistant"}
      >
        {isPaused ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
      </Button>
      
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMute}
            className={`rounded-full p-2 ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-white hover:bg-gray-100'}`}
            title={isMuted ? "Unmute voice assistant" : "Mute voice assistant"}
          >
            {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className={isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white"}>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Voice Assistant</h4>
            <p className="text-xs">
              {isMuted ? "Muted - Click to enable guidance" : "Active - Hover over elements for help"}
            </p>
            {speakingText && (
              <div className="mt-2 pt-2 border-t text-xs italic max-w-xs">
                Speaking: "{speakingText.slice(0, 80)}..."
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default VoiceTrainer;
