
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
  
  // Detailed UI Elements with extensive descriptions
  'input[type="text"], input[type="search"], .search-input': 'Text search input field. Type stock symbols, company names, or keywords to find specific instruments. Use partial matches for suggestions. Clear with backspace or clear button.',
  'input[type="number"], .number-input': 'Numeric input for quantities, prices, or percentages. Use arrow keys to increment values, or type directly. Supports decimal places for precise entries.',
  'input[type="email"]': 'Email address input with automatic validation. Must include @ symbol and valid domain format. Used for notifications and account settings.',
  'input[type="password"]': 'Secure password input with hidden characters. Use strong passwords with letters, numbers, and symbols for account security.',
  'input[type="date"], .date-picker': 'Date selection input. Click to open calendar widget, or type date in MM/DD/YYYY format. Use for filtering data by time periods.',
  'select, .select-trigger, .dropdown-menu': 'Dropdown selection menu with multiple options. Click to expand and choose from available categories, timeframes, or asset types.',
  'textarea, .text-area': 'Multi-line text input for notes, descriptions, or comments. Resize by dragging corner handle. Supports formatted text entry.',
  
  // Enhanced button descriptions with specific functionality
  '.add-button, button[aria-label*="add"], button[title*="add"], button:has(.lucide-plus)': 'Add new item button. Creates new entries like stocks in watchlist, portfolio holdings, price alerts, or market data instruments. Opens form dialog for data entry.',
  '.filter-button, button[aria-label*="filter"], button[title*="filter"], button:has(.lucide-filter)': 'Filter and search options. Opens filter panel to narrow data by asset type, date range, performance metrics, or custom criteria. Apply multiple filters simultaneously.',
  '.view-button, button[aria-label*="view"], button[title*="view"], button:has(.lucide-eye)': 'View detailed information. Opens comprehensive view with charts, analytics, historical data, and key performance metrics. Access full analysis tools.',
  '.edit-button, button[aria-label*="edit"], button[title*="edit"], button:has(.lucide-edit)': 'Edit item properties. Modify quantities, prices, alert conditions, portfolio allocations, or instrument settings. Changes are saved automatically.',
  '.delete-button, button[aria-label*="delete"], button[title*="delete"], button:has(.lucide-trash)': 'Remove items permanently. Deletes entries from watchlists, portfolios, or alert settings. Confirmation dialog prevents accidental deletion.',
  '.save-button, button[aria-label*="save"], button[title*="save"]': 'Save changes and updates to the system. All modifications are preserved and synchronized across modules.',
  '.cancel-button, button[aria-label*="cancel"], button[title*="cancel"]': 'Cancel current operation and discard unsaved changes. Returns to previous view without applying modifications.',
  '.submit-button, button[type="submit"]': 'Submit form data and process request. Validates all required fields before submission and shows confirmation.',
  '.dark-mode-toggle, .theme-toggle': 'Toggle between light and dark themes. Dark mode reduces eye strain and saves battery. Theme preference is saved automatically.',
  
  // Chart and visualization elements with detailed explanations
  '.chart-container, .recharts-wrapper, .chart-area': 'Interactive financial chart with comprehensive analysis tools. Drag to zoom into specific time periods, hover for precise data points, and use timeframe buttons for different views.',
  '.chart-tooltip, .tooltip': 'Chart data tooltip displaying precise values at cursor position. Shows timestamp, price, volume, technical indicators, and percentage changes.',
  '.chart-legend, .legend': 'Chart legend explaining line colors, indicators, and data series. Click legend items to toggle visibility of specific data sets or indicators.',
  '.price-chart, .line-chart': 'Price movement chart showing historical trends. Supports multiple timeframes from intraday to multi-year views with technical analysis overlays.',
  '.volume-chart, .bar-chart': 'Trading volume chart displaying market activity. Higher bars indicate increased trading activity and market interest.',
  
  // Table elements with comprehensive functionality
  'table, .data-table, .table-container': 'Sortable data table with filtering capabilities. Click column headers to sort ascending or descending. Use search and filters to refine displayed data.',
  'th, .table-header, .column-header': 'Sortable table column header. Click to sort data by this column. Arrow indicators show current sort direction and active column.',
  'tr, .table-row, .data-row': 'Data row containing item information. Click for quick actions menu or double-click for detailed view. Hover for row highlighting.',
  'td, .table-cell, .data-cell': 'Table cell with specific data point. May contain formatted numbers, links, status indicators, or action buttons for item management.',
  
  // Form elements with detailed usage instructions
  '.form-field, .form-item, .input-field': 'Form input field with validation. Required fields marked with asterisk. Real-time validation shows errors and formatting requirements.',
  '.form-label, .field-label': 'Field label describing input requirement. Indicates expected data type, format, and whether field is mandatory for form submission.',
  '.form-error, .error-message, .validation-error': 'Validation error message showing specific requirements. Appears when input doesn\'t meet format or value constraints.',
  '.form-help, .help-text, .field-description': 'Help text providing examples and guidance. Shows acceptable formats, ranges, or additional context for proper input.',
  
  // Card and panel elements with specific purposes
  '.card, .panel, .widget': 'Information card grouping related data and actions. Contains summary information, key metrics, and quick access buttons for detailed operations.',
  '.card-header, .panel-header': 'Card title section with primary information. Shows current status, key metrics, and navigation breadcrumbs for context.',
  '.card-content, .panel-content': 'Main card content area with detailed information, interactive charts, data tables, or configuration options.',
  '.card-footer, .panel-footer': 'Card action area with operation buttons. Contains actions like edit, delete, view details, or export data functionality.',
  
  // Dialog and modal elements with interaction details
  '.dialog-trigger, .modal-trigger, .popup-trigger': 'Opens detailed dialog window. Triggers modal with forms, settings, detailed views, or confirmation prompts for user interaction.',
  '.dialog-content, .modal-content, .popup-content': 'Modal dialog containing forms, detailed views, or configuration options. Press Escape key or click outside to close.',
  '.dialog-close, .modal-close, .close-button': 'Close dialog button. Discards any unsaved changes and returns to previous view. Keyboard shortcut: Escape key.',
  
  // Navigation elements with routing information
  '.nav-link, .navigation-link, .menu-item': 'Navigation link to different sections. Shows current location with active state highlighting. Provides access to specialized modules.',
  '.breadcrumb, .breadcrumb-nav': 'Navigation breadcrumb showing current path. Click any level to navigate back to parent sections or modules.',
  '.tab, .tab-button, .tab-item': 'Tab navigation for switching between related content sections. Active tab highlighted with different styling.',
  '.pagination, .page-nav': 'Page navigation controls for browsing large data sets. Shows current page, total pages, and jump-to-page options.',
  
  // Status and indicator elements with meanings
  '.status-indicator, .indicator, .badge': 'Visual status indicator showing current state. Colors indicate active (green), inactive (gray), warning (yellow), or error (red) conditions.',
  '.progress-bar, .progress-indicator': 'Progress indicator showing completion status of operations, loading states, or goal achievement percentages.',
  '.tag, .label, .category-tag': 'Classification label indicating category, status, or type. Used for grouping and filtering items by characteristics.',
  
  // Timeframe and chart controls with specific functions
  'button[data-timeframe="1D"], .timeframe-1d': 'One day chart view showing hourly price movements. Best for intraday trading analysis and short-term price action patterns.',
  'button[data-timeframe="1W"], .timeframe-1w': 'One week chart displaying daily price action. Useful for short-term trend analysis and weekly trading patterns.',
  'button[data-timeframe="1M"], .timeframe-1m': 'One month chart showing daily data points. Good for medium-term analysis and monthly performance evaluation.',
  'button[data-timeframe="3M"], .timeframe-3m': 'Three month chart displaying quarterly trends. Ideal for seasonal pattern analysis and quarterly performance review.',
  'button[data-timeframe="6M"], .timeframe-6m': 'Six month chart showing semi-annual performance. Useful for medium-term trend analysis and half-yearly comparisons.',
  'button[data-timeframe="1Y"], .timeframe-1y': 'One year chart displaying annual performance. Best for yearly trend analysis and annual return calculations.',
  'button[data-timeframe="5Y"], .timeframe-5y': 'Five year chart showing long-term trends. Essential for long-term investment analysis and major market cycle identification.',
  '.timeframe-button, .period-selector': 'Chart timeframe selector buttons. Changes chart resolution from minutes to years. Each timeframe offers different analytical perspectives.',
  
  // Search and filter elements with advanced options
  '.search-bar, .search-container': 'Advanced search interface with filtering options. Supports symbol lookup, company name search, and keyword-based filtering.',
  '.filter-dropdown, .filter-select': 'Filter dropdown for narrowing results by specific criteria. Multiple filters can be applied simultaneously for precise data selection.',
  '.sort-control, .sort-selector': 'Data sorting controls for ordering by different columns. Choose ascending or descending order for numerical or alphabetical sorting.',
  '.clear-filters, .reset-filters': 'Clear all applied filters and show complete data set. Resets search terms, category filters, and date ranges to default state.',
  
  // Action menus and dropdowns with available operations
  '.context-menu, .right-click-menu': 'Right-click context menu with relevant actions for selected item. Available actions depend on item type and current permissions.',
  '.action-menu, .operations-menu': 'Action menu containing operations like edit, delete, duplicate, share, or export. Provides quick access to common functions.',
  '.more-options, .overflow-menu': 'Additional options menu for less common actions. Contains advanced features and specialized operations for power users.',
  
  // Settings and preferences with configuration options
  '.settings-panel, .preferences-panel': 'Settings and configuration panel for customizing application behavior. Adjust display options, notifications, and data preferences.',
  '.preference-toggle, .setting-switch': 'Toggle switch for enabling or disabling specific features. Changes take effect immediately and are saved automatically.',
  '.configuration-option, .config-item': 'Configuration option for customizing how data is displayed, calculated, or processed. Affects application behavior and presentation.',

  // Portfolio specific elements
  '.portfolio-summary, .portfolio-overview': 'Portfolio summary displaying total value, daily change, allocation breakdown, and performance metrics. Shows overall investment performance.',
  '.holding-item, .position-row': 'Individual portfolio holding with quantity, current value, cost basis, and profit/loss. Click for detailed position analysis.',
  '.allocation-chart, .portfolio-pie-chart': 'Portfolio allocation visualization showing asset distribution by sector, asset type, or geography. Interactive segments for detailed breakdown.',
  '.performance-chart, .returns-chart': 'Portfolio performance chart showing returns over time. Compare against benchmarks and track investment strategy effectiveness.',
  
  // Market data specific elements
  '.instrument-row, .symbol-row': 'Market instrument displaying current price, change, volume, and key metrics. Click for detailed analysis and charts.',
  '.price-display, .current-price': 'Real-time price display with bid/ask spread, last trade information, and intraday high/low values.',
  '.change-indicator, .price-change': 'Price change indicator showing absolute and percentage change. Color coding: green for gains, red for losses.',
  '.volume-indicator, .trading-volume': 'Trading volume display showing current session volume, average volume, and volume ratio for market activity assessment.',
  
  // Technical analysis elements
  '.technical-indicator, .indicator-overlay': 'Technical analysis indicator overlay on charts. Includes moving averages, RSI, MACD, Bollinger Bands, and other analytical tools.',
  '.support-resistance, .price-level': 'Support and resistance level indicators on charts. Shows key price levels where reversals or breakouts may occur.',
  '.trend-line, .chart-line': 'Trend line analysis tool for identifying price direction and momentum. Draw custom trend lines for technical analysis.',
  
  // Alert and notification elements
  '.alert-item, .notification-item': 'Individual alert or notification with trigger conditions, current status, and action options. Set price, volume, or news-based alerts.',
  '.alert-condition, .trigger-setting': 'Alert condition configuration showing trigger price, condition type, and notification preferences.',
  '.notification-settings, .alert-preferences': 'Notification preferences for email, SMS, or in-app alerts. Customize frequency and delivery methods.',
};

// Comprehensive route-specific welcome messages
const routeWelcomeMessages: Record<string, string> = {
  '/': 'Welcome to Market Nexus Terminal dashboard. Your comprehensive financial command center with real-time market overview, portfolio summary, watchlists, and news feed. Use the sidebar to navigate between specialized modules for detailed analysis and trading operations.',
  
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
  const hoverTimeoutRef = useRef<number | null>(null);
  
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
    }, 1200);
    
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

        // Priority 3: Check for Lucide React icons in buttons
        if (el.tagName === 'BUTTON' || el.closest('button')) {
          const button = el.tagName === 'BUTTON' ? el : el.closest('button');
          if (button) {
            const svgIcon = button.querySelector('svg');
            if (svgIcon) {
              const iconClasses = svgIcon.className || '';
              if (iconClasses.includes('lucide-plus')) return '.add-button, button[aria-label*="add"], button[title*="add"], button:has(.lucide-plus)';
              if (iconClasses.includes('lucide-filter')) return '.filter-button, button[aria-label*="filter"], button[title*="filter"], button:has(.lucide-filter)';
              if (iconClasses.includes('lucide-eye')) return '.view-button, button[aria-label*="view"], button[title*="view"], button:has(.lucide-eye)';
              if (iconClasses.includes('lucide-edit')) return '.edit-button, button[aria-label*="edit"], button[title*="edit"], button:has(.lucide-edit)';
              if (iconClasses.includes('lucide-trash')) return '.delete-button, button[aria-label*="delete"], button[title*="delete"], button:has(.lucide-trash)';
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
          return '.timeframe-button, .period-selector';
        }
        
        // Priority 7: Check specific input types
        if (el.tagName === 'INPUT') {
          const inputType = el.getAttribute('type') || 'text';
          const inputSelector = `input[type="${inputType}"]`;
          if (componentHints[inputSelector]) return inputSelector;
          
          // Check for search inputs specifically
          if (el.classList.contains('search-input') || el.placeholder?.toLowerCase().includes('search')) {
            return 'input[type="text"], input[type="search"], .search-input';
          }
        }
        
        // Priority 8: Check for form elements
        const formClasses = ['form-field', 'form-item', 'form-label', 'form-error', 'form-help', 'input-field'];
        for (const formClass of formClasses) {
          if (el.classList.contains(formClass)) {
            return `.${formClass}`;
          }
        }
        
        // Priority 9: Check for portfolio and financial specific elements
        const portfolioClasses = [
          'portfolio-summary', 'portfolio-overview', 'holding-item', 'position-row',
          'allocation-chart', 'portfolio-pie-chart', 'performance-chart', 'returns-chart',
          'instrument-row', 'symbol-row', 'price-display', 'current-price',
          'change-indicator', 'price-change', 'volume-indicator', 'trading-volume'
        ];
        for (const portfolioClass of portfolioClasses) {
          if (el.classList.contains(portfolioClass)) {
            return `.${portfolioClass}`;
          }
        }
        
        // Priority 10: Check for UI component classes
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
        
        // Priority 11: Check generic element types and classes
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
        
        // Priority 12: Check if element matches any selector directly
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
        if (hoverTimeoutRef.current) {
          window.clearTimeout(hoverTimeoutRef.current);
        }
        
        setCurrentElement(matchedSelector);
        
        // Immediate guidance without delay for better responsiveness
        hoverTimeoutRef.current = window.setTimeout(() => {
          const guidance = componentHints[matchedSelector];
          if (guidance && matchedSelector !== lastElementRef.current) {
            console.log(`Voice Trainer: Providing guidance for ${matchedSelector}`);
            // Stop any current speech and provide new guidance
            stopSpeaking();
            speak(guidance, 'medium');
            lastElementRef.current = matchedSelector;
          }
          hoverTimeoutRef.current = null;
        }, 300);
      }
    };
    
    // Mouse leave handler to clear timeouts
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
                {isMuted ? "🔇 Muted - Click to enable detailed guidance" : "🎤 Active - Hover over elements for comprehensive help"}
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
