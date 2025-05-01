
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useVoiceTrainer } from '@/contexts/VoiceTrainerContext';
import { MicOff, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUI } from '@/contexts/UIContext';

// Map of component hints by their selectors
const componentHints: Record<string, string> = {
  // Navigation
  '.sidebar-icon': 'This is the navigation sidebar. Click on any icon to navigate to different modules of the application.',
  
  // Dashboard components
  '[data-component="market-data-panel"]': 'This is the market data panel. Here you can view and manage market data, including stocks, cryptocurrencies, and indices.',
  '[data-component="watchlist-panel"]': 'This is your watchlist panel. You can add symbols to track and monitor them in real-time.',
  '[data-component="news-panel"]': 'This panel shows the latest financial news and market updates.',
  '[data-component="portfolio-panel"]': 'Here you can view your portfolio performance, holdings, and allocations.',
  
  // Action buttons
  '.add-button': 'Click this button to add a new item to this section.',
  '.filter-button': 'This button allows you to filter the data based on your preferences.',
  '.view-button': 'Click to view more details about this item.',
  '.edit-button': 'This button lets you edit the selected item.',
  '.delete-button': 'Click this button to remove the selected item.',
  
  // Charts and visualizations
  '.chart-container': 'This chart visualizes data to help you understand market trends and patterns.',
  
  // Forms and inputs
  'input[type="text"]': 'Type here to enter text information.',
  'input[type="search"]': 'Use this search field to find specific items quickly.',
  'select': 'Click to open a dropdown menu of options.',
  
  // Tables
  'table': 'This table displays organized data that you can sort and filter.',
  
  // Module-specific guidance based on routes
  '/market-data': 'Welcome to the Market Data module. Here you can analyze market trends and track specific assets.',
  '/portfolio': 'Welcome to the Portfolio Management module. Here you can track your investments and analyze performance.',
  '/news': 'Welcome to the News & Sentiment module. Stay updated with the latest financial news and market sentiment.',
  '/alerts': 'Welcome to the Alerts & Watchlists module. Set up notifications for important market movements.',
  '/research': 'Welcome to the Research module. Access detailed research reports and analysis.',
  '/trading': 'Welcome to the Trading module. Execute trades and manage your orders.',
  '/risk': 'Welcome to the Risk Analytics module. Assess and manage investment risks.',
  '/fixed-income': 'Welcome to the Fixed Income module. Analyze bonds and other fixed income securities.',
  '/macro': 'Welcome to the Macro Economy module. Track economic indicators and global market trends.',
  '/ai': 'Welcome to the AI Module. Access AI-powered insights and predictions.',
  '/terminal': 'Welcome to the Terminal module. Use advanced commands and tools for market analysis.',
  
  // Dark mode toggle
  '.dark-mode-toggle': 'Click this button to switch between dark and light mode.',
};

// Route-specific welcome messages
const routeWelcomeMessages: Record<string, string> = {
  '/': 'Welcome to Market Nexus Terminal. This dashboard provides an overview of your financial data and market insights. Move your cursor over different components to learn more about each feature.',
  '/market-data': 'Welcome to the Market Data module. Here you can view real-time market data, track assets, and analyze market trends.',
  '/portfolio': 'Welcome to the Portfolio Management module. Monitor your investment portfolio performance and allocations.',
  '/research': 'Welcome to the Research & Intelligence module. Access comprehensive research reports and analysis tools.',
  '/news': 'Welcome to the News & Sentiment module. Stay updated with the latest financial news and market sentiment analysis.',
  '/alerts': 'Welcome to the Alerts & Watchlists module. Set up custom alerts for price movements and manage your watchlists.',
  '/trading': 'Welcome to the Trading module. Execute trades and manage your orders efficiently.',
  '/risk': 'Welcome to the Risk Analytics module. Analyze and manage investment risks in your portfolio.',
  '/fixed-income': 'Welcome to the Fixed Income module. Track bond markets, yield curves, and fixed income securities.',
  '/macro': 'Welcome to the Macro Economy module. Monitor economic indicators and global market trends.',
  '/ai': 'Welcome to the AI Module. Access AI-driven insights and predictions about the market.',
  '/terminal': 'Welcome to the Terminal module. Use advanced commands and tools for sophisticated market analysis.',
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
      `Welcome to the ${path.substring(1).replace(/-/g, ' ')} page. Move your cursor over different components to learn more.`;
    
    // Small delay to let the page render
    const timer = setTimeout(() => {
      speak(welcomeMessage);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [location.pathname, speak]);
  
  // Set up cursor tracking
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
