
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useVoiceTrainer } from '@/contexts/VoiceTrainerContext';
import { MicOff, Mic, PauseCircle, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUI } from '@/contexts/UIContext';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

// Enhanced micro-component hints with step-by-step instructions
const componentHints: Record<string, string> = {
  // Navigation and core elements with detailed instructions
  '.sidebar-icon, .sidebar-menu-button': 'Navigation sidebar for accessing different financial modules. Click any icon to switch between: Market Data for real-time prices and charts, Portfolio for investment tracking, News for market updates, Alerts for price notifications, Research for analysis tools, Trading for order execution, Risk Analytics for portfolio assessment, Fixed Income for bond analysis, Macro Economy for economic indicators, AI Module for machine learning insights, and Terminal for advanced commands. Each module opens specialized tools for that area.',
  '.sidebar': 'Main navigation panel containing all financial module access points. This is your command center - each icon represents a complete financial workspace. Start with Market Data to explore real-time prices, then move to Portfolio to track your investments. The sidebar remains accessible from any module for quick navigation.',
  
  // Dashboard specific with actionable guidance
  '[data-component="dashboard-summary-panel"]': 'Dashboard overview displaying your complete financial picture. View total portfolio value, daily performance changes, asset allocation breakdown, and market condition summary. Click on any metric for detailed analysis. Use this as your daily starting point to assess market conditions and portfolio health.',
  '[data-component="dashboard-view"]': 'Main financial command center showing integrated market overview, portfolio performance, latest news, and quick access shortcuts. This is your financial cockpit - monitor everything at a glance, then drill down into specific modules for detailed analysis and trading actions.',
  
  // Market Data with step-by-step usage
  '[data-component="market-data-panel"]': 'Real-time market data center. To add new instruments: click the Add Item button, enter symbol and details, then save. To search: type in the search box for stocks, ETFs, crypto, or indices. To filter: click Filter button and select asset type, sector, or price range. Charts show price movements with hover details. Click any instrument row for comprehensive analysis.',
  '[data-component="market-data-detail"]': 'Comprehensive instrument analysis workspace. View real-time price with bid/ask spread, technical indicators, volume analysis, and historical performance. Use timeframe buttons (1D, 1W, 1M, etc.) to adjust chart period. Technical overlays include moving averages, RSI, and volume indicators. Access fundamental data, news, and analyst recommendations.',
  
  // Portfolio with actionable steps
  '[data-component="portfolio-panel"]': 'Investment portfolio management center. View current holdings with real-time values, cost basis, and profit/loss calculations. To add positions: click Add Item, enter symbol, quantity, and purchase price. Monitor asset allocation pie chart for diversification. Track total portfolio value and daily performance changes.',
  '[data-component="portfolio-detail"]': 'Individual position analysis showing detailed holding information. View quantity owned, current market value, cost basis, unrealized gains/losses, and percentage allocation. Access position history, dividend information, and performance analytics. Use edit function to adjust quantities or add to positions.',
  
  // Watchlist with clear instructions
  '[data-component="watchlist-panel"]': 'Personal stock monitoring center. Add symbols you are considering for investment or want to track. Click the edit button (pencil icon) to add new symbols - enter ticker symbols separated by commas. Monitor real-time prices, daily changes, and percentage moves. Remove symbols by clicking the trash icon.',
  
  // Stock Detail with comprehensive guidance
  '[data-component="stock-detail-panel"]': 'Advanced stock analysis workspace with interactive price charts, key financial statistics, and multiple timeframe views. Analyze price movements using 1D for intraday, 1W for short-term trends, 1M for monthly patterns, up to 5Y for long-term analysis. Key stats include P/E ratio, market cap, 52-week range, and trading volume.',
  
  // Enhanced button descriptions with clear actions
  '.add-button, button[aria-label*="add"], button[title*="add"], button:has([data-lucide="plus"])': 'Add new item button - creates new entries in the current module. In Market Data: adds new financial instruments to track. In Portfolio: adds new investment positions with quantity and price. In Watchlist: adds stocks to monitor. In Alerts: creates price or volume notifications. Click to open entry form, fill required fields, then save.',
  '.filter-button, button[aria-label*="filter"], button[title*="filter"], button:has([data-lucide="filter"])': 'Advanced filtering system. Opens filter panel with multiple criteria options. In Market Data: filter by asset type (stocks, crypto, ETFs), sector (technology, healthcare, finance), price range, or volume. In Portfolio: filter by allocation percentage, performance, or asset class. Apply multiple filters simultaneously for precise data selection.',
  '.view-button, button[aria-label*="view"], button[title*="view"], button:has([data-lucide="eye"])': 'Detailed view access - opens comprehensive analysis window. Shows complete information including price charts, financial metrics, news, and analytics. In Market Data: technical analysis with indicators. In Portfolio: position details with performance history. In Alerts: trigger conditions and notification history.',
  '.edit-button, button[aria-label*="edit"], button[title*="edit"], button:has([data-lucide="edit"])': 'Modify item properties. In Portfolio: adjust position quantities, update cost basis, or change allocation targets. In Market Data: update instrument details or categories. In Alerts: modify trigger conditions, price levels, or notification preferences. Changes save automatically upon confirmation.',
  '.delete-button, button[aria-label*="delete"], button[title*="delete"], button:has([data-lucide="trash"])': 'Permanent removal action. Removes items from lists, portfolios, or alert systems. In Watchlist: removes stocks from monitoring. In Portfolio: removes investment positions (use carefully). In Alerts: deletes notification rules. Confirmation dialog prevents accidental deletion.',
  
  // Input fields with detailed usage
  'input[type="text"], input[type="search"], .search-input': 'Universal search and text entry field. For symbol search: type stock ticker (AAPL), company name (Apple), or partial matches for suggestions. For general search: use keywords related to your query. Auto-complete provides suggestions as you type. Clear field with delete key or clear button.',
  'input[type="number"], .number-input': 'Numeric data entry for quantities, prices, percentages, or financial values. Use decimal points for precise entries (e.g., 1.50 for $1.50). Arrow keys increment/decrement values. In Portfolio: enter share quantities or purchase prices. In Alerts: set trigger price levels.',
  'input[type="date"], .date-picker': 'Date selection for time-based filtering and analysis. Click to open calendar picker or type MM/DD/YYYY format. Use for filtering historical data, setting alert expiration dates, or analyzing performance over specific periods.',
  
  // Chart elements with interaction details
  '.chart-container, .recharts-wrapper, .chart-area': 'Interactive financial chart with zoom and analysis capabilities. Hover over data points for precise values and timestamps. Drag to zoom into specific time periods. Use mouse wheel to zoom in/out. Chart displays price movements, volume data, and technical indicators with color-coded legend.',
  '.timeframe-button, .period-selector, button[data-timeframe]': 'Chart timeframe selector for different analysis periods. 1D shows hourly intraday data for day trading. 1W displays daily data for weekly trends. 1M shows monthly patterns. 3M, 6M, 1Y for medium-term analysis. 5Y for long-term investment perspective. Each timeframe offers different insights.',
  
  // Table interaction with sorting and selection
  'table, .data-table, .table-container': 'Interactive data table with sorting, filtering, and selection capabilities. Click column headers to sort data ascending or descending. Use search box above table to filter rows. Click table rows for quick actions or detailed view. Pagination controls at bottom for large datasets.',
  'th, .table-header, .column-header': 'Sortable column header. Click to sort table data by this column. Arrow indicators show current sort direction. Double-click for reverse sort. Common sortable columns: price (high to low), change percentage, volume, market cap, or alphabetical by name.',
  
  // Enhanced form guidance
  '.form-field, .form-item, .input-field': 'Data entry form field with validation. Required fields marked with red asterisk (*). Green checkmark indicates valid input. Red border shows validation errors. Real-time validation provides immediate feedback. Tab key moves to next field.',
  '.form-error, .error-message, .validation-error': 'Input validation error with specific correction guidance. Common errors: invalid symbol format (use ticker like AAPL), price must be positive number, quantity cannot be zero, date must be future for alerts. Correct the highlighted field to proceed.',
  
  // Dialog and modal interaction
  '.dialog-trigger, .modal-trigger, .popup-trigger': 'Opens detailed configuration or information window. Modal overlays current view with focused task. Forms for adding items, settings panels, or detailed analytics. Click outside modal or press Escape key to close without saving.',
  '.dialog-content, .modal-content, .popup-content': 'Modal window with focused task or detailed information. Contains forms for data entry, comprehensive charts, or settings panels. Use Tab key to navigate between fields. Save button applies changes, Cancel discards modifications.',
  
  // Status indicators with meaning
  '.status-indicator, .indicator, .badge': 'Visual status indicator showing current state or condition. Green: active, profitable, or positive. Red: inactive, loss, or error. Yellow: warning or neutral. Blue: informational. Gray: disabled or pending. Hover for detailed status information.',
  '.change-indicator, .price-change': 'Price movement indicator with direction and magnitude. Green with up arrow: price increase. Red with down arrow: price decrease. Percentage shows magnitude of change. Dollar amount shows absolute change. Based on previous close or selected timeframe.',
  
  // News and alerts with actionable info
  '[data-component="news-panel"]': 'Financial news aggregation with relevance filtering. Articles sorted by recency and market impact. Filter by sentiment (positive, negative, neutral), source credibility, or keyword relevance. Click articles for full text and related market analysis. Set news alerts for specific topics or companies.',
  '[data-component="alerts-panel"]': 'Price and event notification management system. Create alerts for: price targets (above/below), percentage changes, volume spikes, or news events. Set notification methods: email, SMS, or in-app. Monitor triggered alerts and adjust conditions. Active alerts shown with green status.',
  
  // Research tools with analysis guidance
  '[data-component="research-panel"]': 'Comprehensive investment research platform. Access analyst reports with buy/sell/hold recommendations. View insider trading activity, institutional ownership changes, and earnings estimates. Technical analysis tools include support/resistance levels, trend analysis, and momentum indicators.',
  
  // Trading functionality
  '[data-component="trading-panel"]': 'Order execution and trading management platform. Place market orders (immediate execution) or limit orders (specific price). Monitor order status: pending, filled, or cancelled. View trading history with profit/loss analysis. Set stop-loss orders for risk management.',
  
  // Risk management tools
  '[data-component="risk-panel"]': 'Portfolio risk assessment and management tools. Value at Risk (VaR) calculations show potential losses. Stress testing simulates market crash scenarios. Correlation analysis shows how holdings move together. Diversification metrics indicate concentration risk.',
  
  // Macro economic analysis
  '[data-component="macro-panel"]': 'Economic indicator tracking and market impact analysis. Monitor GDP growth, inflation rates, employment data, and central bank policies. Understand how macro events affect different asset classes. Fed interest rate changes impact bond and stock valuations.',
  
  // AI insights
  '[data-component="ai-panel"]': 'Artificial intelligence market analysis and predictions. Machine learning algorithms identify patterns, predict price movements, and suggest portfolio optimizations. Sentiment analysis of news and social media. Risk assessment using big data analytics.',
  
  // Terminal commands
  '[data-component="terminal-panel"]': 'Advanced command-line interface for power users. Execute complex queries, generate custom reports, and access API functions. Commands include: portfolio analysis, bulk data imports, automated trading strategies, and system configuration.',
  
  // Specific timeframe guidance
  'button[data-timeframe="1D"], .timeframe-1d': 'One day intraday chart showing hourly price movements and volume. Perfect for day trading analysis, identifying entry/exit points, and monitoring real-time market sentiment. Shows opening gap, intraday highs/lows, and closing price action.',
  'button[data-timeframe="1W"], .timeframe-1w': 'Weekly chart displaying five days of trading data. Ideal for swing trading strategies, identifying short-term trends, and analyzing weekly patterns. Shows Monday opening through Friday closing with daily price bars.',
  'button[data-timeframe="1M"], .timeframe-1m': 'Monthly chart with daily price points for trend analysis. Best for identifying monthly patterns, earnings impact, and medium-term investment decisions. Shows approximately 22 trading days with daily resolution.',
  'button[data-timeframe="3M"], .timeframe-3m': 'Quarterly chart for seasonal analysis and earnings cycle evaluation. Three months of daily data perfect for identifying quarterly trends, seasonal patterns, and earnings announcement impacts on stock price.',
  'button[data-timeframe="6M"], .timeframe-6m': 'Semi-annual chart for medium-term investment analysis. Six months of data ideal for identifying intermediate trends, half-year performance evaluation, and medium-term technical pattern recognition.',
  'button[data-timeframe="1Y"], .timeframe-1y': 'Annual chart for yearly performance analysis and long-term trend identification. Twelve months of data perfect for annual comparisons, long-term trend analysis, and identifying major support/resistance levels.',
  'button[data-timeframe="5Y"], .timeframe-5y': 'Five-year chart for long-term investment perspective and major trend analysis. Multi-year view essential for identifying market cycles, long-term growth trends, and major economic impact periods.',
};

// Comprehensive route-specific welcome messages with actionable guidance
const routeWelcomeMessages: Record<string, string> = {
  '/': 'Welcome to Market Nexus Terminal - your comprehensive financial command center. This dashboard provides real-time market overview, portfolio performance summary, latest financial news, and quick access to all specialized modules. Start by reviewing your portfolio performance in the summary panel, then check market conditions and recent news. Use the sidebar to navigate to specific modules: Market Data for price analysis, Portfolio for investment tracking, or Alerts for price notifications.',
  
  '/market-data': 'Market Data Center - your real-time financial information hub. Here you can search, filter, and analyze thousands of financial instruments including stocks, ETFs, cryptocurrencies, indices, and commodities. To get started: use the search box to find specific symbols, click Add Item to track new instruments, or use the Filter button to browse by categories. Click any instrument for detailed charts with technical analysis, volume data, and key financial metrics.',
  
  '/portfolio': 'Portfolio Management - track and analyze your investment holdings with comprehensive performance metrics. View your current positions with real-time values, profit/loss calculations, and asset allocation breakdown. To add new positions: click Add Item and enter symbol, quantity, and purchase price. Monitor your total portfolio value, daily changes, and allocation percentages. Use the charts to visualize your asset distribution and performance over time.',
  
  '/watchlist': 'Personal Watchlist - monitor stocks and assets you are considering for investment or want to track closely. This is your personal monitoring center for market opportunities. To add symbols: click the edit button and enter ticker symbols separated by commas. Monitor real-time prices, daily percentage changes, and volume activity. Remove symbols using the delete button when no longer needed.',
  
  '/news': 'Financial News Center - stay informed with curated market news, earnings reports, and economic updates. Articles are filtered for market relevance and impact. Use the filter options to narrow news by sentiment analysis, source credibility, or specific topics. Click articles for full content and related market analysis. Set up news alerts for companies or topics you follow closely.',
  
  '/alerts': 'Alert Management System - create and manage price notifications, volume alerts, and news triggers. Set price targets above or below current levels, percentage change thresholds, or volume spike notifications. Choose notification methods: email, SMS, or in-app alerts. Monitor triggered alerts and adjust conditions as market conditions change. Active alerts are shown with status indicators.',
  
  '/research': 'Investment Research Platform - access comprehensive analysis tools, analyst reports, and fundamental data. Review professional analyst recommendations with price targets and rating changes. Monitor insider trading activity and institutional ownership changes. Use fundamental analysis tools for earnings estimates, financial ratios, and peer comparisons.',
  
  '/trading': 'Trading Execution Platform - place and manage orders with comprehensive trading tools. Execute market orders for immediate fills or limit orders at specific prices. Monitor order status from pending to execution. Review trading history with profit/loss analysis. Set stop-loss orders for risk management and trailing stops for profit protection.',
  
  '/risk': 'Risk Analytics Center - assess and manage portfolio risk with advanced metrics and stress testing. Calculate Value at Risk showing potential losses under normal market conditions. Run stress tests simulating market crash scenarios. Analyze correlations between holdings to identify concentration risks. Monitor diversification metrics and risk-adjusted returns.',
  
  '/fixed-income': 'Fixed Income Analysis - specialized tools for bond and debt instrument evaluation. Analyze yield curves across different maturities and credit ratings. Monitor interest rate sensitivity with duration calculations. Evaluate credit risk with rating changes and spread analysis. Compare yields across government, corporate, and municipal bonds.',
  
  '/macro': 'Macro Economic Center - track economic indicators and their market impact. Monitor GDP growth rates, inflation trends, employment statistics, and central bank policies. Understand how macro events affect different asset classes and market sectors. Federal Reserve interest rate decisions significantly impact bond yields and stock valuations.',
  
  '/ai': 'AI Insights Module - leverage artificial intelligence for market analysis and investment recommendations. Machine learning algorithms identify price patterns, predict market movements, and suggest portfolio optimizations. Natural language processing analyzes news sentiment and social media trends. Risk assessment models use big data for comprehensive market analysis.',
  
  '/terminal': 'Advanced Terminal Interface - command-line access for power users and advanced operations. Execute complex queries for custom analysis, generate detailed reports, and access API functions. Available commands include portfolio analytics, bulk data operations, automated trading strategies, and system configuration. Type help for command reference.',
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
  const mousePositionRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<number | null>(null);
  const elementHoverStartRef = useRef<number>(0);
  
  // Handle route changes with improved context switching
  useEffect(() => {
    const path = location.pathname;
    
    if (path === lastRouteRef.current) {
      return;
    }
    
    lastRouteRef.current = path;
    console.log(`Voice Trainer: Route changed to ${path}`);
    
    if (routeTimeoutRef.current) {
      clearTimeout(routeTimeoutRef.current);
    }
    
    stopSpeaking();
    clearSpokenContexts();
    setCurrentContext(path);
    
    const welcomeMessage = routeWelcomeMessages[path] || 
      `You are now in the ${path.substring(1).replace(/-/g, ' ')} section. This specialized module provides tools and analytics for ${path.substring(1).replace(/-/g, ' ')} operations. Hover over interface elements to learn about their specific functions and how to use them effectively.`;
    
    routeTimeoutRef.current = window.setTimeout(() => {
      speak(welcomeMessage, 'high');
    }, 1000);
    
    return () => {
      if (routeTimeoutRef.current) {
        clearTimeout(routeTimeoutRef.current);
      }
    };
  }, [location.pathname, speak, stopSpeaking, setCurrentContext, clearSpokenContexts]);
  
  // Enhanced cursor tracking with comprehensive element detection
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPaused || isMuted) return;
      
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (!element) return;
      
      const findMatchingElement = (el: Element | null): string | null => {
        if (!el) return null;
        
        // Priority 1: Check data-component first (highest priority)
        const dataComponent = el.getAttribute('data-component');
        if (dataComponent) {
          const selector = `[data-component="${dataComponent}"]`;
          if (componentHints[selector]) return selector;
        }
        
        // Priority 2: Check data-timeframe for specific timeframe buttons
        const dataTimeframe = el.getAttribute('data-timeframe');
        if (dataTimeframe) {
          const selector = `button[data-timeframe="${dataTimeframe}"]`;
          if (componentHints[selector]) return selector;
        }

        // Priority 3: Check for Lucide React icons in buttons using data-lucide attribute
        if (el.tagName === 'BUTTON' || el.closest('button')) {
          const button = el.tagName === 'BUTTON' ? el : el.closest('button');
          if (button) {
            const svgIcon = button.querySelector('svg[data-lucide]');
            if (svgIcon) {
              const iconName = svgIcon.getAttribute('data-lucide');
              if (iconName === 'plus') return '.add-button, button[aria-label*="add"], button[title*="add"], button:has([data-lucide="plus"])';
              if (iconName === 'filter') return '.filter-button, button[aria-label*="filter"], button[title*="filter"], button:has([data-lucide="filter"])';
              if (iconName === 'eye') return '.view-button, button[aria-label*="view"], button[title*="view"], button:has([data-lucide="eye"])';
              if (iconName === 'edit') return '.edit-button, button[aria-label*="edit"], button[title*="edit"], button:has([data-lucide="edit"])';
              if (iconName === 'trash-2') return '.delete-button, button[aria-label*="delete"], button[title*="delete"], button:has([data-lucide="trash"])';
            }
          }
        }
        
        // Priority 4: Check for specific button types by class names
        const buttonClasses = [
          'add-button', 'filter-button', 'view-button', 'edit-button', 
          'delete-button', 'save-button', 'cancel-button', 'dark-mode-toggle',
          'search-button', 'submit-button', 'timeframe-button'
        ];
        for (const btnClass of buttonClasses) {
          if (el.classList.contains(btnClass)) {
            return `.${btnClass}`;
          }
        }
        
        // Priority 5: Check for button types by aria-label or title attributes
        const ariaLabel = el.getAttribute('aria-label')?.toLowerCase() || '';
        const title = el.getAttribute('title')?.toLowerCase() || '';
        if (el.tagName === 'BUTTON' && (ariaLabel || title)) {
          for (const [selector, hint] of Object.entries(componentHints)) {
            if (selector.includes('aria-label') || selector.includes('title')) {
              const match = selector.match(/\[(aria-label|title)\*="([^"]+)"\]/);
              if (match && (ariaLabel.includes(match[2]) || title.includes(match[2]))) {
                return selector;
              }
            }
          }
        }
        
        // Priority 6: Check for timeframe buttons by class or content
        if (el.classList.contains('timeframe-button') || 
            (el.tagName === 'BUTTON' && el.textContent?.match(/^(1D|1W|1M|3M|6M|1Y|5Y)$/))) {
          return '.timeframe-button, .period-selector, button[data-timeframe]';
        }
        
        // Priority 7: Check specific input types
        if (el.tagName === 'INPUT') {
          const inputType = el.getAttribute('type') || 'text';
          const inputSelector = `input[type="${inputType}"]`;
          if (componentHints[inputSelector]) return inputSelector;
          
          // Check for search inputs specifically
          const inputElement = el as HTMLInputElement;
          if (el.classList.contains('search-input') || inputElement.placeholder?.toLowerCase().includes('search')) {
            return 'input[type="text"], input[type="search"], .search-input';
          }
        }
        
        // Continue with remaining priorities...
        const formClasses = ['form-field', 'form-item', 'form-label', 'form-error', 'form-help', 'input-field'];
        for (const formClass of formClasses) {
          if (el.classList.contains(formClass)) {
            return `.${formClass}`;
          }
        }
        
        // Check for financial specific elements
        const financialClasses = [
          'portfolio-summary', 'portfolio-overview', 'holding-item', 'position-row',
          'allocation-chart', 'portfolio-pie-chart', 'performance-chart', 'returns-chart',
          'instrument-row', 'symbol-row', 'price-display', 'current-price',
          'change-indicator', 'price-change', 'volume-indicator', 'trading-volume'
        ];
        for (const financialClass of financialClasses) {
          if (el.classList.contains(financialClass)) {
            return `.${financialClass}`;
          }
        }
        
        // Check for UI component classes
        const uiClasses = [
          'search-input', 'filter-dropdown', 'sort-control', 'clear-filters',
          'dropdown-menu', 'context-menu', 'action-menu', 'settings-panel',
          'preference-toggle', 'configuration-option', 'status-indicator',
          'progress-bar', 'badge', 'tag', 'nav-link', 'navigation-link',
          'breadcrumb', 'tab', 'pagination', 'chart-container', 'chart-tooltip',
          'chart-legend', 'data-table', 'table-header', 'table-row', 'table-cell'
        ];
        for (const uiClass of uiClasses) {
          if (el.classList.contains(uiClass)) {
            return `.${uiClass}`;
          }
        }
        
        // Check generic element types and classes
        const genericSelectors = [
          'select', '.select-trigger', 'textarea', 'button',
          '.dialog-trigger', '.dialog-content', '.dialog-close',
          '.modal-trigger', '.modal-content', '.modal-close',
          'table', '.data-table', 'th', '.table-header', 
          'tr', '.table-row', 'td', '.table-cell',
          '.card', '.card-header', '.card-content', '.card-footer',
          '.panel', '.recharts-wrapper', '.sidebar', '.sidebar-icon', '.sidebar-menu-button'
        ];
        
        for (const selector of genericSelectors) {
          try {
            if (selector.startsWith('.')) {
              if (el.classList.contains(selector.substring(1))) {
                if (componentHints[selector]) return selector;
              }
            } else {
              if (el.matches(selector)) {
                if (componentHints[selector]) return selector;
              }
            }
          } catch (error) {
            continue;
          }
        }
        
        // Check if element matches any selector directly
        for (const selector of Object.keys(componentHints)) {
          try {
            if (el.matches(selector) || el.closest(selector)) {
              return selector;
            }
          } catch (error) {
            continue;
          }
        }
        
        return findMatchingElement(el.parentElement);
      };
      
      const matchedSelector = findMatchingElement(element);
      
      if (matchedSelector && matchedSelector !== currentElement) {
        if (hoverTimeoutRef.current) {
          window.clearTimeout(hoverTimeoutRef.current);
        }
        
        setCurrentElement(matchedSelector);
        elementHoverStartRef.current = Date.now();
        
        // Provide guidance with appropriate delay
        hoverTimeoutRef.current = window.setTimeout(() => {
          const guidance = componentHints[matchedSelector];
          if (guidance && matchedSelector !== lastElementRef.current) {
            const hoverDuration = Date.now() - elementHoverStartRef.current;
            console.log(`Voice Trainer: Providing detailed guidance for ${matchedSelector} (hovered for ${hoverDuration}ms)`);
            stopSpeaking();
            speak(guidance, 'medium');
            lastElementRef.current = matchedSelector;
          }
          hoverTimeoutRef.current = null;
        }, 400);
      }
    };
    
    const handleMouseLeave = () => {
      if (hoverTimeoutRef.current) {
        window.clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (hoverTimeoutRef.current) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [speak, stopSpeaking, currentElement, isPaused, isMuted]);
  
  // Handle pause/resume state changes
  useEffect(() => {
    if (isPaused) {
      stopSpeaking();
      console.log('Voice Trainer: Paused - guidance temporarily disabled');
    } else {
      console.log('Voice Trainer: Resumed - detailed guidance active');
    }
  }, [isPaused, stopSpeaking]);
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 flex gap-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPaused(!isPaused)}
        className={`rounded-full p-2 ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-600' : 'bg-white hover:bg-gray-100 border-gray-300'}`}
        title={isPaused ? "Resume detailed voice guidance" : "Pause voice guidance"}
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
            title={isMuted ? "Enable detailed voice guidance" : "Disable voice guidance"}
          >
            {isMuted ? <MicOff size={16} className="text-red-500" /> : <Mic size={16} className="text-green-500" />}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className={isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Enhanced Voice Assistant</h4>
            <div className="text-xs space-y-1">
              <p className={`${isMuted ? 'text-red-500' : 'text-green-500'}`}>
                {isMuted ? "🔇 Disabled - Click to enable comprehensive guidance" : "🎤 Active - Providing detailed micro-component guidance"}
              </p>
              <p className={`${isPaused ? 'text-yellow-500' : 'text-blue-500'}`}>
                {isPaused ? "⏸️ Paused - Guidance temporarily disabled" : "▶️ Running - Hover elements for step-by-step instructions"}
              </p>
              {speakingText && (
                <div className="mt-2 pt-2 border-t text-xs italic max-w-xs">
                  <strong>Current Guidance:</strong> "{speakingText.slice(0, 80)}..."
                </div>
              )}
              {currentElement && (
                <div className="mt-1 text-xs text-gray-500">
                  <strong>Element:</strong> {currentElement.split(',')[0]}
                </div>
              )}
              <div className="mt-2 pt-2 border-t text-xs">
                <strong>Features:</strong> Step-by-step instructions, detailed component explanations, actionable guidance for all interface elements
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default VoiceTrainer;
