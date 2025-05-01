
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useVoiceTrainer } from '@/contexts/VoiceTrainerContext';
import { MicOff, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUI } from '@/contexts/UIContext';

// Map of component hints by their selectors - enhanced with more descriptive content
const componentHints: Record<string, string> = {
  // Navigation
  '.sidebar-icon': 'This is the navigation sidebar with quick access icons. Each icon represents a different module of the application. Hover over each icon to see its name, and click to navigate directly to that section. For example, clicking on the chart icon will take you to the Market Data section where you can analyze various financial instruments.',
  
  // Dashboard components
  '[data-component="market-data-panel"]': 'This is the market data panel displaying real-time financial information. You can track various assets like stocks, cryptocurrencies, and indices here. Try clicking on a specific asset to view detailed charts and historical performance. You can also customize the timeframe using the selector above the chart to view data from different periods.',
  '[data-component="watchlist-panel"]': 'This is your personalized watchlist panel. You can add symbols of interest to track their performance in real-time. To add a new symbol, use the plus button at the top right. For better organization, you can create multiple watchlists for different asset categories like tech stocks, energy sector, or cryptocurrencies.',
  '[data-component="news-panel"]': 'This panel displays the latest financial news and market updates that might impact your investment decisions. Articles are ranked by relevance and recency. You can click on any headline to read the full article. Consider using the filter option to focus on news related to specific sectors or companies in your portfolio.',
  '[data-component="portfolio-panel"]': 'Here you can monitor your portfolio performance, holdings, and asset allocations. The visual charts help you understand your diversification across different sectors and asset classes. For a deeper dive into specific holdings, click on any position to see its detailed performance metrics and contribution to your overall portfolio.',
  
  // Action buttons
  '.add-button': 'This button allows you to add a new item to the current section. For example, in the watchlist, it will let you add new symbols to track; in the portfolio section, you can add new positions. After clicking, you\'ll see a form where you can enter the relevant details.',
  '.filter-button': 'The filter button helps you narrow down the displayed data based on specific criteria. Click it to reveal filtering options such as date ranges, price thresholds, market capitalization, or performance metrics, depending on the section you\'re in.',
  '.view-button': 'This button provides a detailed view of the selected item. Clicking it will open a comprehensive panel with all available information, historical data, and related analytics for the selected asset or report.',
  '.edit-button': 'Use this button to modify the details of the selected item. For instance, in your portfolio, you might want to update the purchase price or quantity of a position. The system will save your changes automatically once confirmed.',
  '.delete-button': 'This button removes the selected item from the current view. You\'ll be asked to confirm this action since deletion cannot be undone. Consider archiving items instead of deleting if you might need them for future reference.',
  
  // Charts and visualizations
  '.chart-container': 'This interactive chart visualizes financial data to help you identify trends and patterns. You can zoom in on specific time periods by clicking and dragging across the area of interest. Use the chart controls to toggle between different visualization types like candlestick, line, or bar charts. For technical analysis, you can add indicators such as moving averages or RSI from the chart settings.',
  
  // Forms and inputs
  'input[type="text"]': 'This is a text input field where you can type information. Click inside the field and use your keyboard to enter data. Press Tab to move to the next field or Enter to submit the form if it\'s the last field.',
  'input[type="search"]': 'Use this search field to quickly find specific items. Start typing keywords related to what you\'re looking for, and the system will display matching results as you type. This real-time filtering helps you locate information efficiently without having to scroll through large datasets.',
  'select': 'This dropdown menu contains a list of options to choose from. Click on it to view all available options, then select the one that best matches your needs. In some cases, you can select multiple options by holding the Ctrl or Command key while clicking.',
  
  // Tables
  'table': 'This data table presents information in an organized format with rows and columns. You can sort the data by clicking on column headers, and in many cases, filter the content using the filter button. To interact with a specific row, click on it to select it before using the action buttons above or below the table.',
  
  // Module-specific guidance based on routes
  '/market-data': 'You\'re in the Market Data module where you can analyze various financial instruments and their performance. From here, you can explore price charts, compare different assets, and access technical indicators to inform your trading decisions. Try selecting different timeframes to view how assets have performed over various periods, from intraday to multi-year trends.',
  '/portfolio': 'You\'re in the Portfolio Management module which provides a comprehensive view of your investments. Here you can track your holdings, analyze performance, and review your asset allocation. Consider using the performance metrics to evaluate how your portfolio is doing against market benchmarks. You might also want to check the risk analysis section to ensure your diversification aligns with your investment goals.',
  '/news': 'You\'re in the News & Sentiment module which aggregates financial news from various sources. This information can be crucial for making informed investment decisions based on current events. Pay attention to sentiment indicators that analyze whether news is generally positive or negative for specific assets. You can also set up alerts for news mentioning companies or sectors you\'re interested in.',
  '/alerts': 'You\'re in the Alerts & Watchlists module where you can configure notifications for important market events. Consider setting up price alerts for assets you\'re monitoring, or volatility alerts to be notified of unusual market activity. Your watchlists are also managed here, allowing you to organize assets into meaningful groups for easier tracking.',
  '/research': 'You\'re in the Research module which provides in-depth analysis and reports. Here you can access expert opinions, fundamental data, and detailed company profiles to support your investment research. The comparative analysis tools allow you to evaluate similar companies side by side based on key financial metrics and performance indicators.',
  '/trading': 'You\'re in the Trading module where you can execute market orders and manage your trading activities. Before placing a trade, review the order details carefully, including the asset, quantity, and order type. You can also access your order history and analyze past transactions to improve your trading strategy over time.',
  '/risk': 'You\'re in the Risk Analytics module which helps you understand and manage investment risks. The tools here calculate metrics like Value at Risk (VaR), volatility, and Sharpe ratio to quantify the risk-reward profile of your investments. Consider using scenario analysis to see how your portfolio might perform under different market conditions.',
  '/fixed-income': 'You\'re in the Fixed Income module focused on bonds and other debt securities. Here you can analyze yield curves, credit spreads, and duration metrics to make informed decisions about fixed income investments. The bond calculator can help you determine fair values and potential returns based on current interest rate environments.',
  '/macro': 'You\'re in the Macro Economy module which tracks broader economic indicators and their potential impact on financial markets. Pay attention to metrics like GDP growth, inflation rates, unemployment figures, and central bank policies. Understanding these macro trends can help you position your investments ahead of major economic shifts.',
  '/ai': 'You\'re in the AI Module which leverages artificial intelligence to generate market insights and predictions. The machine learning models here analyze vast amounts of market data to identify patterns that might not be obvious through traditional analysis. Consider using the AI-generated scenarios to complement your own research rather than replacing it entirely.',
  '/terminal': 'You\'re in the Terminal module which provides a command-line interface for advanced users. Here you can execute complex queries and generate custom reports using specialized syntax. This power-user feature allows for more efficient workflows once you\'re familiar with the command structure and parameters.',
  
  // Dark mode toggle
  '.dark-mode-toggle': 'This button toggles between dark and light display modes. Dark mode can reduce eye strain during extended use, especially in low-light environments. Your preference will be remembered for future sessions.',
};

// Route-specific welcome messages
const routeWelcomeMessages: Record<string, string> = {
  '/': 'You\'re in the Market Nexus Terminal dashboard. This centralized view provides a comprehensive overview of your financial data, market insights, and portfolio performance. I recommend exploring the various panels to familiarize yourself with the available information. Try hovering over different elements to learn more about their functionality, or use the sidebar icons to navigate to specialized modules for deeper analysis.',
  '/market-data': 'You\'re in the Market Data module, your gateway to comprehensive financial market information. Here you can analyze price movements, compare different assets, and identify potential trading opportunities. I suggest starting with the main chart view where you can select different assets and timeframes. For technical analysis, try adding indicators from the chart controls menu. You can also create custom watchlists to track specific sectors or strategies.',
  '/portfolio': 'You\'re in the Portfolio Management module which serves as your investment command center. From here, you can track performance across all your holdings and analyze your allocation strategy. I recommend first checking the portfolio summary for a high-level overview, then diving into individual positions for more detailed analysis. Consider using the rebalancing tool if your allocations have drifted from your target percentages.',
  '/research': 'You\'re in the Research & Intelligence module, your resource for in-depth market analysis. This section combines expert research, fundamental data, and technical indicators to support your investment decisions. Begin by browsing the latest research reports, then use the screening tools to find opportunities matching your investment criteria. The company comparison feature is particularly useful for evaluating similar investments side by side.',
  '/news': 'You\'re in the News & Sentiment module which keeps you informed about market-moving events. Staying up-to-date with relevant news is crucial for anticipating market reactions. I suggest customizing your news feed by selecting industries and companies of interest. The sentiment analysis feature can help you quickly gauge whether recent news is generally positive or negative for specific assets. Consider setting up notifications for breaking news related to your holdings.',
  '/alerts': 'You\'re in the Alerts & Watchlists module where you can set up custom notifications and organize assets you\'re monitoring. To get started, try creating a new alert by selecting a trigger condition such as price threshold or percentage change. You might want to set different alert priorities based on the significance of the trigger events. For watchlists, consider creating separate lists for different investment strategies or asset classes.',
  '/trading': 'You\'re in the Trading module which allows you to execute orders and manage your trading activities. Before placing your first trade, familiarize yourself with the order types available, such as market, limit, and stop orders. The trading simulator is an excellent tool to practice strategies without risking real capital. After executing trades, use the performance analytics to evaluate your trading decisions and identify areas for improvement.',
  '/risk': 'You\'re in the Risk Analytics module designed to help you understand and manage investment uncertainties. Start by reviewing the risk overview dashboard which highlights key metrics across your entire portfolio. The correlation matrix shows how your different holdings relate to each other, which is crucial for proper diversification. Try the stress testing feature to see how your portfolio might perform under adverse market conditions like historical crashes or rising inflation scenarios.',
  '/fixed-income': 'You\'re in the Fixed Income module specialized for analyzing bonds and debt instruments. Here you can evaluate yield curves, credit quality, and maturity distributions. I recommend starting with the bond screener to find opportunities matching your income requirements and risk tolerance. The yield calculator helps you compare different bonds on an equal footing by calculating metrics like yield to maturity and current yield. Also check the interest rate sensitivity analysis to understand how potential rate changes might affect your holdings.',
  '/macro': 'You\'re in the Macro Economy module which connects broader economic trends to market performance. Begin by exploring the economic calendar which highlights upcoming data releases and events that could impact markets. The indicator dashboard tracks key metrics like GDP, inflation, and employment across major economies. Consider using the correlation tools to understand how specific economic indicators have historically affected asset classes you\'re interested in.',
  '/ai': 'You\'re in the AI Module where advanced machine learning models provide market insights and predictions. This cutting-edge technology analyzes patterns across massive datasets to identify potential opportunities and risks. Start with the AI-generated market overview which highlights anomalies and trends that might warrant further investigation. The predictive models section offers probability-based forecasts for various market scenarios. Remember that these AI insights work best as a complement to your own research and judgment.',
  '/terminal': 'You\'re in the Terminal module which provides command-line functionality for advanced users. This powerful interface allows you to quickly execute complex operations without navigating through the graphical interface. Begin by exploring the command reference documentation to learn available commands and parameters. Try starting with basic queries like "show markets" or "list portfolio" before moving to more complex operations. The script editor allows you to create and save sequences of commands for repeated tasks.',
};

const VoiceTrainer: React.FC = () => {
  const location = useLocation();
  const { speak, stopSpeaking, isMuted, toggleMute, isPaused, setPaused } = useVoiceTrainer();
  const { isDarkMode } = useUI();
  const [currentElement, setCurrentElement] = useState<string | null>(null);
  const cursorTimeoutRef = useRef<number | null>(null);
  
  // Handle route changes - speak welcome message
  useEffect(() => {
    const path = location.pathname;
    const welcomeMessage = routeWelcomeMessages[path] || 
      `You\'re in the ${path.substring(1).replace(/-/g, ' ')} section. This area provides specialized tools and information related to ${path.substring(1).replace(/-/g, ' ')}. Move your cursor over different components to learn about their specific functions and how they can help you achieve your financial goals.`;
    
    // Small delay to let the page render
    const timer = setTimeout(() => {
      speak(welcomeMessage);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [location.pathname, speak]);
  
  // Set up cursor tracking with enhanced intelligence
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Check if cursor has moved to a new element
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (!element) return;
      
      // Find the closest matching element with guidance
      const findMatchingElement = (el: Element | null): string | null => {
        if (!el) return null;
        
        // Check element against our selectors
        for (const selector in componentHints) {
          try {
            if (el.matches(selector) || el.closest(selector)) {
              return selector;
            }
          } catch (error) {
            // Skip invalid selectors
          }
        }
        
        // Try with parent element
        return findMatchingElement(el.parentElement);
      };
      
      const matchedSelector = findMatchingElement(element);
      
      // If element changed and we have guidance for it
      if (matchedSelector && matchedSelector !== currentElement) {
        // Clear any pending timeouts
        if (cursorTimeoutRef.current) {
          window.clearTimeout(cursorTimeoutRef.current);
        }
        
        // Set a delay before speaking (to avoid speaking on rapid mouse movement)
        cursorTimeoutRef.current = window.setTimeout(() => {
          stopSpeaking(); // Stop any current speech
          speak(componentHints[matchedSelector]); // Speak new guidance
          setCurrentElement(matchedSelector);
          cursorTimeoutRef.current = null;
        }, 700); // 700ms delay
      }
    };
    
    // Add cursor tracking
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (cursorTimeoutRef.current) {
        window.clearTimeout(cursorTimeoutRef.current);
      }
    };
  }, [speak, stopSpeaking, currentElement]);
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleMute}
        className={`rounded-full p-2 ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-white hover:bg-gray-100'}`}
        title={isMuted ? "Unmute voice assistant" : "Mute voice assistant"}
      >
        {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
      </Button>
    </div>
  );
};

export default VoiceTrainer;
