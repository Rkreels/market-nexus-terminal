
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useVoiceTrainer } from '@/contexts/VoiceTrainerContext';
import { MicOff, Mic, PauseCircle, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUI } from '@/contexts/UIContext';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

// Comprehensive component hints with detailed functionality descriptions
const componentHints: Record<string, string> = {
  // Navigation and core elements
  '.sidebar-icon, .sidebar-menu-button': 'Navigation sidebar with module access. Click any icon to switch between Market Data, Portfolio, News, Alerts, Research, Trading, Risk Analytics, Fixed Income, Macro Economy, AI Module, and Terminal sections.',
  '.sidebar': 'Main navigation sidebar containing all module links. Each module provides specialized financial tools and analytics.',
  
  // Dashboard specific
  '[data-component="dashboard-summary-panel"]': 'Dashboard overview showing portfolio performance, market summary, and key metrics. Monitor your overall financial position and market conditions.',
  '[data-component="dashboard-view"]': 'Main dashboard with comprehensive market overview, portfolio summary, recent news, and quick access to all modules.',
  
  // Market Data specific
  '[data-component="market-data-panel"]': 'Market Data panel showing real-time financial information. Search symbols, filter by asset type, add new instruments, and view detailed charts with technical indicators.',
  '[data-component="market-data-detail"]': 'Detailed market data view with comprehensive charts, technical analysis, fundamental data, and historical performance metrics.',
  
  // Portfolio specific
  '[data-component="portfolio-panel"]': 'Portfolio management showing your holdings, asset allocation, performance metrics, and total portfolio value. Track positions and their contribution to overall returns.',
  '[data-component="portfolio-detail"]': 'Detailed portfolio holding view with position details, performance analysis, cost basis, and individual asset charts.',
  
  // Watchlist specific
  '[data-component="watchlist-panel"]': 'Personal watchlist for tracking favorite stocks and assets. Add symbols using the edit button, monitor real-time prices, and track percentage changes.',
  
  // Stock Detail specific
  '[data-component="stock-detail-panel"]': 'Comprehensive stock analysis with interactive charts, key statistics, financial metrics, and multiple timeframe options.',
  
  // News specific
  '[data-component="news-panel"]': 'Financial news feed with market-relevant articles. Filter by source, sentiment, or keywords. Click articles to read full content and analysis.',
  
  // Alerts specific
  '[data-component="alerts-panel"]': 'Price and volume alerts management. Set custom alert conditions, manage notification preferences, and track triggered alerts.',
  
  // Research specific
  '[data-component="research-panel"]': 'Research module with analyst reports, insider transactions, and AI-powered market insights. Access comprehensive investment research.',
  
  // Trading specific
  '[data-component="trading-panel"]': 'Trading execution platform for placing orders, monitoring positions, and analyzing trading performance with detailed transaction history.',
  
  // Risk analytics specific
  '[data-component="risk-panel"]': 'Risk management tools including Value at Risk calculations, stress testing, correlation analysis, and portfolio risk metrics.',
  
  // Fixed income specific
  '[data-component="fixed-income-panel"]': 'Fixed income analysis for bonds and debt instruments. Evaluate yield curves, credit ratings, duration, and interest rate sensitivity.',
  
  // Macro economy specific
  '[data-component="macro-panel"]': 'Macro economic indicators and analysis. Monitor GDP, inflation, employment data, and central bank policies affecting markets.',
  
  // AI module specific
  '[data-component="ai-panel"]': 'AI-powered market insights with machine learning forecasts, sentiment analysis, pattern recognition, and algorithmic recommendations.',
  
  // Terminal specific
  '[data-component="terminal-panel"]': 'Command-line interface for advanced operations. Execute queries, generate reports, and access API functions.',
  
  // Button types with specific functionality
  '.add-button': 'Add new items button. In Market Data, opens form to add stocks, crypto, indices, or commodities. In Portfolio, adds new holdings. In Watchlist, adds symbols to track.',
  '.filter-button': 'Advanced filtering options. Filter by asset type, categories, price ranges, performance metrics, and custom criteria for refined data views.',
  '.view-button': 'View detailed information including comprehensive charts, technical indicators, fundamental analysis, and historical performance data.',
  '.edit-button': 'Edit mode for modifying item details, quantities, notes, or configuration settings. Changes are saved automatically after confirmation.',
  '.delete-button': 'Remove items permanently. You will be asked to confirm this irreversible action before deletion.',
  '.dark-mode-toggle': 'Toggle between light and dark themes. Dark mode reduces eye strain and preferences are automatically saved.',
  
  // Charts and data visualization
  '.chart-container': 'Interactive financial charts with zoom, pan, and technical indicator capabilities. Click and drag to zoom, right-click for options.',
  
  // Stock detail timeframe controls
  'button[class*="timeframe"], .timeframe-button': 'Chart timeframe selector from 1 day to 5 years. Each shows different data granularity: 1D shows hourly, 1M shows daily, 1Y shows weekly data.',
  'button[data-timeframe="1D"]': 'One day chart view showing hourly price movements and intraday trading patterns.',
  'button[data-timeframe="1W"]': 'One week chart view displaying daily price action and short-term trends.',
  'button[data-timeframe="1M"]': 'One month chart showing daily data points and medium-term price movements.',
  'button[data-timeframe="3M"]': 'Three month chart displaying quarterly trends and seasonal patterns.',
  'button[data-timeframe="6M"]': 'Six month chart showing semi-annual performance and longer-term trends.',
  'button[data-timeframe="1Y"]': 'One year chart displaying annual performance and yearly trading patterns.',
  'button[data-timeframe="5Y"]': 'Five year chart showing long-term trends and major market cycles.',
  
  // Form elements
  'input[type="text"], input[type="search"]': 'Text input field. Click to focus and type. Use Tab to navigate between fields or Enter to submit forms.',
  'input[type="number"]': 'Numeric input for quantities, prices, or percentages. Use arrow keys or type numbers directly.',
  'select, .select-trigger': 'Dropdown menu with options. Click to open and select from available choices. Some support multi-selection.',
  'textarea': 'Multi-line text area for notes, comments, or detailed descriptions. Resize by dragging the corner.',
  'button': 'Interactive button performing specific actions. Button text indicates the operation that will be executed.',
  
  // Dialog and modal elements
  '.dialog-trigger': 'Opens detailed dialog or modal window with additional options and comprehensive forms.',
  '.dialog-content': 'Modal dialog containing forms, detailed views, or configuration options. Press Escape to close.',
  
  // Table elements
  'table, .data-table': 'Data table with sortable columns, filtering capabilities, and row selection for bulk operations.',
  'th, .table-header': 'Table column header. Click to sort data by this column in ascending or descending order.',
  'tr, .table-row': 'Data row containing item information. Click for quick actions or detailed view.',
  
  // Card components
  '.card': 'Information card containing related data and actions. Cards can be expanded for more details.',
  '.card-header': 'Card title and primary information section with key metrics and status indicators.',
  '.card-content': 'Main card content area with detailed information, charts, or interactive elements.',
};

// Comprehensive route-specific welcome messages
const routeWelcomeMessages: Record<string, string> = {
  '/': 'Welcome to Market Nexus Terminal dashboard. Your financial command center with real-time market overview, portfolio summary, watchlists, and news feed. Use the sidebar to navigate between specialized modules for detailed analysis and trading operations.',
  
  '/market-data': 'Market Data module provides comprehensive financial instrument analysis. Search and filter stocks, cryptocurrencies, indices, and commodities. Add new instruments, view detailed charts with technical indicators, and analyze price movements across multiple timeframes.',
  
  '/portfolio': 'Portfolio Management module tracks your investments and performance. View current holdings, asset allocation, profit and loss calculations, and detailed portfolio analytics. Add new positions, edit quantities, and monitor investment strategy effectiveness.',
  
  '/watchlist': 'Watchlist module for monitoring favorite stocks and assets. Add symbols you are interested in tracking, monitor real-time price changes, and organize investments by categories. Use the edit function to customize your monitoring lists.',
  
  '/news': 'News and Sentiment module aggregates financial news from multiple sources. Filter articles by relevance, sentiment analysis, and market impact. Stay informed about events affecting your investments and broader market trends.',
  
  '/alerts': 'Alerts and Notifications module for setting price alerts, volume thresholds, and news notifications. Create custom alert conditions with specific triggers and manage notification preferences to stay updated on important market movements.',
  
  '/research': 'Research module provides in-depth market analysis, company reports, and investment research. Access fundamental data, analyst opinions, insider transactions, and comparative analysis tools for informed investment decision making.',
  
  '/trading': 'Trading module for executing market orders and managing trading activities. Place buy and sell orders with various order types, monitor execution status, and analyze trading performance with detailed transaction history and metrics.',
  
  '/risk': 'Risk Analytics module helps assess and manage investment risks. Calculate Value at Risk metrics, perform stress testing scenarios, analyze portfolio correlations, and evaluate risk exposure across different market conditions.',
  
  '/fixed-income': 'Fixed Income module specialized for bond and debt instrument analysis. Evaluate yield curves, credit ratings, duration calculations, and interest rate sensitivity for fixed income investment strategies.',
  
  '/macro': 'Macro Economy module tracks broader economic indicators and their market impact. Monitor GDP growth, inflation trends, employment data, and central bank policies to understand fundamental market-driving forces.',
  
  '/ai': 'AI Module leverages machine learning for advanced market insights and predictions. Access AI-generated forecasts, pattern recognition algorithms, sentiment analysis, and algorithmic trading recommendations based on market data.',
  
  '/terminal': 'Terminal module provides command-line interface for advanced operations. Execute complex queries, generate custom reports, and access API functions using professional-grade terminal commands and scripting capabilities.',
};

const VoiceTrainer: React.FC = () => {
  const location = useLocation();
  const { speak, stopSpeaking, isMuted, toggleMute, isPaused, setPaused, speakingText, setCurrentContext, clearSpokenContexts } = useVoiceTrainer();
  const { isDarkMode } = useUI();
  const [currentElement, setCurrentElement] = useState<string | null>(null);
  const cursorTimeoutRef = useRef<number | null>(null);
  const lastElementRef = useRef<string | null>(null);
  const routeTimeoutRef = useRef<number | null>(null);
  const lastRouteRef = useRef<string>('');
  
  // Handle route changes with improved context switching
  useEffect(() => {
    const path = location.pathname;
    
    // Prevent duplicate route processing
    if (path === lastRouteRef.current) {
      return;
    }
    
    lastRouteRef.current = path;
    
    console.log(`Voice Trainer: Route changed to ${path}`);
    
    // Clear any pending timeouts
    if (routeTimeoutRef.current) {
      clearTimeout(routeTimeoutRef.current);
    }
    
    // Stop any current speech immediately when route changes
    stopSpeaking();
    
    // Clear spoken contexts for new route
    clearSpokenContexts();
    
    // Set new context
    setCurrentContext(path);
    
    const welcomeMessage = routeWelcomeMessages[path] || 
      `You are now in the ${path.substring(1).replace(/-/g, ' ')} section. This module provides specialized tools for ${path.substring(1).replace(/-/g, ' ')} operations. Explore the interface by hovering over different elements to learn about their specific functions and capabilities.`;
    
    // Delay for route transition completion
    routeTimeoutRef.current = window.setTimeout(() => {
      speak(welcomeMessage, 'high');
    }, 800);
    
    return () => {
      if (routeTimeoutRef.current) {
        clearTimeout(routeTimeoutRef.current);
      }
    };
  }, [location.pathname, speak, stopSpeaking, setCurrentContext, clearSpokenContexts]);
  
  // Enhanced cursor tracking with improved element detection
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPaused || isMuted) return;
      
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (!element) return;
      
      const findMatchingElement = (el: Element | null): string | null => {
        if (!el) return null;
        
        // Check data-component first (highest priority)
        const dataComponent = el.getAttribute('data-component');
        if (dataComponent) {
          const selector = `[data-component="${dataComponent}"]`;
          if (componentHints[selector]) return selector;
        }
        
        // Check data-timeframe for specific timeframe buttons
        const dataTimeframe = el.getAttribute('data-timeframe');
        if (dataTimeframe) {
          const selector = `button[data-timeframe="${dataTimeframe}"]`;
          if (componentHints[selector]) return selector;
        }
        
        // Check for timeframe buttons by class or content
        if (el.classList.contains('timeframe-button') || 
            (el.tagName === 'BUTTON' && el.textContent?.match(/^(1D|1W|1M|3M|6M|1Y|5Y)$/))) {
          return 'button[class*="timeframe"], .timeframe-button';
        }
        
        // Check specific button types by class
        const buttonClasses = ['add-button', 'filter-button', 'view-button', 'edit-button', 'delete-button', 'dark-mode-toggle'];
        for (const btnClass of buttonClasses) {
          if (el.classList.contains(btnClass)) {
            return `.${btnClass}`;
          }
        }
        
        // Check generic element types
        const elementSelectors = [
          'input[type="text"]', 'input[type="search"]', 'input[type="number"]',
          'select', '.select-trigger', 'textarea', 'button',
          '.dialog-trigger', '.dialog-content', 'table', '.data-table',
          'th', '.table-header', 'tr', '.table-row',
          '.card', '.card-header', '.card-content',
          '.chart-container', '.sidebar', '.sidebar-icon', '.sidebar-menu-button'
        ];
        
        for (const selector of elementSelectors) {
          try {
            if (el.matches(selector) || el.closest(selector)) {
              if (componentHints[selector]) return selector;
            }
          } catch (error) {
            continue;
          }
        }
        
        // Recursively check parent elements
        return findMatchingElement(el.parentElement);
      };
      
      const matchedSelector = findMatchingElement(element);
      
      if (matchedSelector && matchedSelector !== currentElement) {
        // Clear any pending timeout
        if (cursorTimeoutRef.current) {
          window.clearTimeout(cursorTimeoutRef.current);
        }
        
        // Stop current speech for immediate response on new elements
        if (matchedSelector !== lastElementRef.current) {
          stopSpeaking();
        }
        
        setCurrentElement(matchedSelector);
        lastElementRef.current = matchedSelector;
        
        // Improved delay for better responsiveness
        cursorTimeoutRef.current = window.setTimeout(() => {
          const guidance = componentHints[matchedSelector];
          if (guidance) {
            console.log(`Voice Trainer: Providing guidance for ${matchedSelector}`);
            speak(guidance, 'medium');
          }
          cursorTimeoutRef.current = null;
        }, 700);
      }
    };
    
    // Mouse leave handler to clear timeouts
    const handleMouseLeave = () => {
      if (cursorTimeoutRef.current) {
        window.clearTimeout(cursorTimeoutRef.current);
        cursorTimeoutRef.current = null;
      }
    };
    
    // Click handler to provide immediate feedback
    const handleClick = (e: MouseEvent) => {
      const element = e.target as Element;
      if (!element) return;
      
      // Provide immediate feedback for button clicks
      if (element.tagName === 'BUTTON' || element.closest('button')) {
        const buttonText = element.textContent?.trim() || '';
        if (buttonText && buttonText.length < 50) {
          speak(`${buttonText} activated`, 'high');
        }
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('click', handleClick);
      if (cursorTimeoutRef.current) {
        window.clearTimeout(cursorTimeoutRef.current);
      }
    };
  }, [speak, stopSpeaking, currentElement, isPaused, isMuted]);
  
  // Handle pause/resume state changes
  useEffect(() => {
    if (isPaused) {
      stopSpeaking();
      console.log('Voice Trainer: Paused');
    } else {
      console.log('Voice Trainer: Resumed');
    }
  }, [isPaused, stopSpeaking]);
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 flex gap-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPaused(!isPaused)}
        className={`rounded-full p-2 ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-600' : 'bg-white hover:bg-gray-100 border-gray-300'}`}
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
            className={`rounded-full p-2 ${
              isDarkMode 
                ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-600' 
                : 'bg-white hover:bg-gray-100 border-gray-300'
            } ${isMuted ? 'border-red-500' : ''}`}
            title={isMuted ? "Unmute voice assistant" : "Mute voice assistant"}
          >
            {isMuted ? <MicOff size={16} className="text-red-500" /> : <Mic size={16} className="text-green-500" />}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className={isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Voice Assistant Status</h4>
            <div className="text-xs space-y-1">
              <p className={`${isMuted ? 'text-red-500' : 'text-green-500'}`}>
                {isMuted ? "🔇 Muted - Click to enable guidance" : "🎤 Active - Hover over elements for help"}
              </p>
              <p className={`${isPaused ? 'text-yellow-500' : 'text-blue-500'}`}>
                {isPaused ? "⏸️ Paused" : "▶️ Running"}
              </p>
              {speakingText && (
                <div className="mt-2 pt-2 border-t text-xs italic max-w-xs">
                  <strong>Speaking:</strong> "{speakingText.slice(0, 60)}..."
                </div>
              )}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default VoiceTrainer;
