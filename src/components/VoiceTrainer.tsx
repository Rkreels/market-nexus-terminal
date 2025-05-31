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
  
  // Detailed UI Elements
  'input[type="text"], input[type="search"]': 'Text input field for entering search terms, symbols, or text data. Click to focus and type your query.',
  'input[type="number"]': 'Numeric input field for entering quantities, prices, percentages, or numerical values. Use arrow keys or type numbers directly.',
  'input[type="email"]': 'Email input field for entering email addresses. Validation will check for proper email format.',
  'input[type="password"]': 'Password input field for secure text entry. Characters are hidden for security.',
  'input[type="date"]': 'Date picker input for selecting dates. Click to open calendar widget or type date directly.',
  'select, .select-trigger': 'Dropdown selection menu with multiple options. Click to expand and choose from available items.',
  'textarea': 'Multi-line text area for entering longer text, notes, or descriptions. Resize by dragging the corner handle.',
  
  // Button types with specific functionality
  '.add-button, button[aria-label*="add"], button[title*="add"]': 'Add new item button. Creates new entries like stocks, portfolio holdings, alerts, or watchlist items.',
  '.filter-button, button[aria-label*="filter"], button[title*="filter"]': 'Filter and search options. Narrow down data by criteria like asset type, date range, or performance metrics.',
  '.view-button, button[aria-label*="view"], button[title*="view"]': 'View detailed information including charts, analytics, historical data, and comprehensive metrics.',
  '.edit-button, button[aria-label*="edit"], button[title*="edit"]': 'Edit item properties like quantities, prices, alert conditions, or portfolio allocations.',
  '.delete-button, button[aria-label*="delete"], button[title*="delete"]': 'Remove items permanently from your lists, portfolios, or alert settings.',
  '.save-button, button[aria-label*="save"], button[title*="save"]': 'Save your changes and updates to the system. All modifications will be preserved.',
  '.cancel-button, button[aria-label*="cancel"], button[title*="cancel"]': 'Cancel current operation and discard any unsaved changes.',
  '.submit-button, button[type="submit"]': 'Submit form data and process your request. Validates input before submission.',
  '.dark-mode-toggle': 'Toggle between light and dark themes. Dark mode reduces eye strain and preferences are saved automatically.',
  
  // Chart and data visualization elements
  '.chart-container, .recharts-wrapper': 'Interactive financial chart with zoom, pan, and analysis tools. Drag to zoom, hover for data points.',
  '.chart-tooltip': 'Chart data tooltip showing precise values at cursor position. Displays time, price, volume, and technical indicators.',
  '.chart-legend': 'Chart legend explaining line colors, indicators, and data series. Toggle visibility by clicking legend items.',
  
  // Table elements with enhanced descriptions
  'table, .data-table': 'Data table with sortable columns and filtering. Click headers to sort, use filters to refine data.',
  'th, .table-header': 'Table column header with sorting capability. Click to sort data ascending or descending by this column.',
  'tr, .table-row': 'Data row containing item information. Click row for quick actions or detailed view of the item.',
  'td, .table-cell': 'Table cell containing specific data point. May include links, buttons, or formatted values.',
  
  // Form elements
  '.form-field, .form-item': 'Form input field with validation. Required fields are marked with asterisk.',
  '.form-label': 'Field label describing the input requirement. Indicates data type and format expected.',
  '.form-error, .error-message': 'Validation error message. Shows specific requirements or corrections needed.',
  '.form-help, .help-text': 'Help text providing additional guidance or examples for proper input format.',
  
  // Card and panel elements
  '.card, .panel': 'Information card containing related data and actions. Cards group related functionality together.',
  '.card-header': 'Card title section with primary information and key metrics. Shows current status and main data.',
  '.card-content': 'Main card content with detailed information, charts, or interactive elements.',
  '.card-footer': 'Card action area with buttons for operations like edit, delete, or view details.',
  
  // Dialog and modal elements
  '.dialog-trigger, .modal-trigger': 'Opens detailed dialog window with forms, settings, or additional information.',
  '.dialog-content, .modal-content': 'Modal dialog containing forms, detailed views, or configuration options. Press Escape to close.',
  '.dialog-close, .modal-close': 'Close dialog button. Discards unsaved changes and returns to previous view.',
  
  // Navigation elements
  '.nav-link, .navigation-link': 'Navigation link to different sections or pages. Shows current location with active state.',
  '.breadcrumb': 'Navigation breadcrumb showing current location path. Click any level to navigate back.',
  '.tab': 'Tab navigation for switching between related content sections.',
  '.pagination': 'Page navigation controls for browsing through large data sets.',
  
  // Status and indicator elements
  '.status-indicator': 'Visual status indicator showing current state like active, inactive, loading, or error.',
  '.progress-bar': 'Progress indicator showing completion status of operations or loading states.',
  '.badge, .tag': 'Label or tag indicating category, status, or classification of items.',
  
  // Timeframe and chart controls
  'button[data-timeframe="1D"]': 'One day chart view showing hourly price movements and intraday trading patterns.',
  'button[data-timeframe="1W"]': 'One week chart view displaying daily price action and short-term trends.',
  'button[data-timeframe="1M"]': 'One month chart showing daily data points and medium-term price movements.',
  'button[data-timeframe="3M"]': 'Three month chart displaying quarterly trends and seasonal patterns.',
  'button[data-timeframe="6M"]': 'Six month chart showing semi-annual performance and longer-term trends.',
  'button[data-timeframe="1Y"]': 'One year chart displaying annual performance and yearly trading patterns.',
  'button[data-timeframe="5Y"]': 'Five year chart showing long-term trends and major market cycles.',
  '.timeframe-button': 'Chart timeframe selector. Changes chart resolution from hourly to monthly data.',
  
  // Search and filter elements
  '.search-input': 'Search field for finding specific items by name, symbol, or keywords.',
  '.filter-dropdown': 'Filter dropdown for narrowing results by category, type, or criteria.',
  '.sort-control': 'Sorting controls for ordering data by different columns or criteria.',
  '.clear-filters': 'Clear all applied filters and show complete data set.',
  
  // Action menus and dropdowns
  '.dropdown-menu': 'Dropdown menu with additional actions and options for the current item.',
  '.context-menu': 'Right-click context menu with relevant actions for the selected item.',
  '.action-menu': 'Action menu containing operations like edit, delete, duplicate, or share.',
  
  // Settings and preferences
  '.settings-panel': 'Settings and preferences panel for customizing application behavior.',
  '.preference-toggle': 'Toggle switch for enabling or disabling specific features or preferences.',
  '.configuration-option': 'Configuration option for customizing how data is displayed or calculated.',
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
  const mousePositionRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  
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
        
        // Priority 3: Check for specific button types by class names
        const buttonClasses = [
          'add-button', 'filter-button', 'view-button', 'edit-button', 
          'delete-button', 'save-button', 'cancel-button', 'dark-mode-toggle'
        ];
        for (const btnClass of buttonClasses) {
          if (el.classList.contains(btnClass)) {
            return `.${btnClass}`;
          }
        }
        
        // Priority 4: Check for button types by aria-label or title attributes
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
        
        // Priority 5: Check for timeframe buttons by class or content
        if (el.classList.contains('timeframe-button') || 
            (el.tagName === 'BUTTON' && el.textContent?.match(/^(1D|1W|1M|3M|6M|1Y|5Y)$/))) {
          return '.timeframe-button';
        }
        
        // Priority 6: Check specific input types
        if (el.tagName === 'INPUT') {
          const inputType = el.getAttribute('type') || 'text';
          const inputSelector = `input[type="${inputType}"]`;
          if (componentHints[inputSelector]) return inputSelector;
        }
        
        // Priority 7: Check for form elements
        const formClasses = ['form-field', 'form-item', 'form-label', 'form-error', 'form-help'];
        for (const formClass of formClasses) {
          if (el.classList.contains(formClass)) {
            return `.${formClass}`;
          }
        }
        
        // Priority 8: Check for UI component classes
        const uiClasses = [
          'search-input', 'filter-dropdown', 'sort-control', 'clear-filters',
          'dropdown-menu', 'context-menu', 'action-menu', 'settings-panel',
          'preference-toggle', 'configuration-option', 'status-indicator',
          'progress-bar', 'badge', 'tag', 'nav-link', 'navigation-link',
          'breadcrumb', 'tab', 'pagination'
        ];
        for (const uiClass of uiClasses) {
          if (el.classList.contains(uiClass)) {
            return `.${uiClass}`;
          }
        }
        
        // Priority 9: Check generic element types and classes
        const genericSelectors = [
          'select', '.select-trigger', 'textarea', 'button',
          '.dialog-trigger', '.dialog-content', '.dialog-close',
          '.modal-trigger', '.modal-content', '.modal-close',
          'table', '.data-table', 'th', '.table-header', 
          'tr', '.table-row', 'td', '.table-cell',
          '.card', '.card-header', '.card-content', '.card-footer',
          '.panel', '.chart-container', '.chart-tooltip', '.chart-legend',
          '.recharts-wrapper', '.sidebar', '.sidebar-icon', '.sidebar-menu-button'
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
        
        // Priority 10: Check if element matches any selector directly
        for (const selector of Object.keys(componentHints)) {
          try {
            if (el.matches(selector) || el.closest(selector)) {
              return selector;
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
        
        // Reduced delay for better responsiveness
        cursorTimeoutRef.current = window.setTimeout(() => {
          const guidance = componentHints[matchedSelector];
          if (guidance) {
            console.log(`Voice Trainer: Providing guidance for ${matchedSelector}`);
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
    
    // Click handler to provide immediate feedback with element context
    const handleClick = (e: MouseEvent) => {
      const element = e.target as Element;
      if (!element) return;
      
      // Stop any current speech immediately
      stopSpeaking();
      
      // Get element context for more specific feedback
      const getClickContext = (el: Element): string => {
        const tagName = el.tagName.toLowerCase();
        const className = el.className;
        const textContent = el.textContent?.trim() || '';
        const type = el.getAttribute('type');
        const role = el.getAttribute('role');
        
        // Button specific feedback
        if (tagName === 'button' || role === 'button') {
          if (textContent && textContent.length < 50) {
            return `${textContent} button activated`;
          }
          if (className.includes('add')) return 'Add button activated';
          if (className.includes('edit')) return 'Edit button activated';
          if (className.includes('delete')) return 'Delete button activated';
          if (className.includes('save')) return 'Save button activated';
          if (className.includes('cancel')) return 'Cancel button activated';
          if (className.includes('filter')) return 'Filter button activated';
          if (className.includes('view')) return 'View button activated';
          return 'Button activated';
        }
        
        // Input specific feedback
        if (tagName === 'input') {
          if (type === 'text' || type === 'search') return 'Text input field focused';
          if (type === 'number') return 'Number input field focused';
          if (type === 'email') return 'Email input field focused';
          if (type === 'password') return 'Password input field focused';
          if (type === 'date') return 'Date input field focused';
          if (type === 'checkbox') return 'Checkbox toggled';
          if (type === 'radio') return 'Radio button selected';
          return 'Input field focused';
        }
        
        // Other element types
        if (tagName === 'select') return 'Dropdown menu opened';
        if (tagName === 'textarea') return 'Text area focused';
        if (tagName === 'a') return 'Link activated';
        if (tagName === 'td' || tagName === 'th') return 'Table cell selected';
        if (className.includes('tab')) return 'Tab switched';
        if (className.includes('card')) return 'Card selected';
        
        return 'Element activated';
      };
      
      const contextMessage = getClickContext(element);
      speak(contextMessage, 'high');
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
              {currentElement && (
                <div className="mt-1 text-xs text-gray-500">
                  <strong>Current:</strong> {currentElement}
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
