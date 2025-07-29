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
  '.sidebar-icon': 'Navigation sidebar for accessing different financial modules. Click any icon to switch between: Market Data for real-time prices and charts, Portfolio for investment tracking, News for market updates, Alerts for price notifications, Research for analysis tools, Trading for order execution, Risk Analytics for portfolio assessment, Fixed Income for bond analysis, Macro Economy for economic indicators, AI Module for machine learning insights, and Terminal for advanced commands.',
  '.sidebar': 'Main navigation panel containing all financial module access points. This is your command center - each icon represents a complete financial workspace.',
  
  // Dashboard specific
  '[data-component="dashboard-summary-panel"]': 'Dashboard overview displaying your complete financial picture. View total portfolio value, daily performance changes, asset allocation breakdown, and market condition summary.',
  '[data-component="dashboard-view"]': 'Main financial command center showing integrated market overview, portfolio performance, latest news, and quick access shortcuts.',
  
  // Market Data
  '[data-component="market-data-panel"]': 'Real-time market data center. To add new instruments: click the Add Item button, enter symbol and details, then save. To search: type in the search box for stocks, ETFs, crypto, or indices.',
  
  // Portfolio
  '[data-component="portfolio-panel"]': 'Investment portfolio management center. View current holdings with real-time values, profit/loss calculations, and asset allocation breakdown.',
  
  // Watchlist
  '[data-component="watchlist-panel"]': 'Personal stock monitoring center. Add symbols you are considering for investment or want to track closely.',
  
  // Enhanced button descriptions
  '.add-button': 'Add new item button - creates new entries in the current module. Click to open entry form, fill required fields, then save.',
  '.filter-button': 'Advanced filtering system. Opens filter panel with multiple criteria options.',
  '.view-button': 'Detailed view access - opens comprehensive analysis window.',
  '.edit-button': 'Modify item properties. Changes save automatically upon confirmation.',
  '.delete-button': 'Permanent removal action. Confirmation dialog prevents accidental deletion.',
  
  // Button text variations
  'button[add]': 'Add new item button - creates new entries in the current module.',
  'button[filter]': 'Advanced filtering system. Opens filter panel with multiple criteria options.',
  'button[edit]': 'Modify item properties. Changes save automatically upon confirmation.',
  'button[delete]': 'Permanent removal action. Confirmation dialog prevents accidental deletion.',
  'button[view]': 'Detailed view access - opens comprehensive analysis window.',
  
  // Input fields
  'input': 'Data entry field. Use tab key to navigate between fields.',
  'textarea': 'Multi-line text input field for detailed information.',
  'select': 'Dropdown selection menu. Click to see available options.',
  
  // Table elements
  'table': 'Interactive data table with sorting and filtering capabilities. Click column headers to sort data.',
  'th': 'Sortable column header. Click to sort table data by this column.',
  
  // Card components
  '.card': 'Information card displaying organized content and data.',
  '.market-data-panel': 'Real-time market data center with search, filter, and tracking capabilities.',
  '.watchlist-panel': 'Personal stock monitoring center for tracking investment opportunities.',
  '.portfolio-panel': 'Investment portfolio management with performance tracking and allocation breakdown.',
};

// Route-specific welcome messages
const routeWelcomeMessages: Record<string, string> = {
  '/': 'Welcome to Market Nexus Terminal - your comprehensive financial command center. This dashboard provides real-time market overview, portfolio performance summary, latest financial news, and quick access to all specialized modules.',
  '/market-data': 'Market Data Center - your real-time financial information hub. Here you can search, filter, and analyze thousands of financial instruments including stocks, ETFs, cryptocurrencies, indices, and commodities.',
  '/portfolio': 'Portfolio Management - track and analyze your investment holdings with comprehensive performance metrics. View your current positions with real-time values, profit/loss calculations, and asset allocation breakdown.',
  '/news': 'Financial News Center - stay informed with curated market news, earnings reports, and economic updates.',
  '/alerts': 'Alert Management System - create and manage price notifications, volume alerts, and news triggers.',
  '/trading': 'Trading Execution Platform - place and manage orders with comprehensive trading tools.',
  '/research': 'Investment Research Platform - access comprehensive analysis tools, analyst reports, and fundamental data.',
  '/risk': 'Portfolio Risk Assessment - analyze portfolio risk with Value at Risk calculations and stress testing.',
  '/fixed-income': 'Fixed Income Analysis - specialized tools for bond analysis, yield calculations, and duration metrics.',
  '/macro': 'Macro Economic Analysis - track economic indicators and their market impact.',
  '/ai': 'AI Module - artificial intelligence market analysis and predictions using machine learning algorithms.',
  '/terminal': 'Advanced Terminal - command-line interface for power users with complex queries and custom reports.',
};

const VoiceTrainer: React.FC = () => {
  const location = useLocation();
  const { speak, stopSpeaking, isMuted, toggleMute, isPaused, setPaused, speakingText, setCurrentContext, clearSpokenContexts } = useVoiceTrainer();
  const { isDarkMode } = useUI();
  const [currentElement, setCurrentElement] = useState<string | null>(null);
  const lastElementRef = useRef<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const routeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRouteRef = useRef<string>('');
  
  // Handle route changes
  useEffect(() => {
    const path = location.pathname;
    
    if (path === lastRouteRef.current) {
      return;
    }
    
    lastRouteRef.current = path;
    setCurrentContext(path);
    clearSpokenContexts();
    
    // Clear any existing timeouts
    if (routeTimeoutRef.current) {
      clearTimeout(routeTimeoutRef.current);
    }
    
    // Announce route change with delay to ensure voices are loaded
    routeTimeoutRef.current = setTimeout(() => {
      if (!isMuted && !isPaused && routeWelcomeMessages[path]) {
        console.log(`Voice Trainer: Announcing route: ${path}`);
        speak(routeWelcomeMessages[path], 'high');
      }
    }, 1500);
    
    return () => {
      if (routeTimeoutRef.current) {
        clearTimeout(routeTimeoutRef.current);
      }
    };
  }, [location.pathname, speak, setCurrentContext, clearSpokenContexts, isMuted, isPaused]);

  // Enhanced mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isMuted || isPaused) return;
      
      // Clear existing hover timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      
      // Set new hover timeout
      hoverTimeoutRef.current = setTimeout(() => {
        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (!element) return;
        
        // Build selector list for matching
        const selectors: string[] = [];
        
        // Add class-based selectors
        element.classList.forEach(className => {
          selectors.push(`.${className}`);
        });
        
        // Add data attribute selectors
        const dataComponent = element.getAttribute('data-component');
        if (dataComponent) {
          selectors.push(`[data-component="${dataComponent}"]`);
        }
        
        // Add tag-based selectors
        const tagName = element.tagName.toLowerCase();
        selectors.push(tagName);
        
        // Special handling for buttons
        if (tagName === 'button') {
          const text = element.textContent?.toLowerCase().trim() || '';
          const ariaLabel = element.getAttribute('aria-label')?.toLowerCase() || '';
          const title = element.getAttribute('title')?.toLowerCase() || '';
          const className = element.className.toLowerCase();
          
          if (text.includes('add') || ariaLabel.includes('add') || title.includes('add') || className.includes('add')) {
            selectors.push('.add-button', 'button[add]');
          }
          if (text.includes('edit') || ariaLabel.includes('edit') || title.includes('edit') || className.includes('edit')) {
            selectors.push('.edit-button', 'button[edit]');
          }
          if (text.includes('delete') || ariaLabel.includes('delete') || title.includes('delete') || className.includes('delete') || className.includes('trash')) {
            selectors.push('.delete-button', 'button[delete]');
          }
          if (text.includes('filter') || ariaLabel.includes('filter') || title.includes('filter') || className.includes('filter')) {
            selectors.push('.filter-button', 'button[filter]');
          }
          if (text.includes('view') || ariaLabel.includes('view') || title.includes('view') || className.includes('view')) {
            selectors.push('.view-button', 'button[view]');
          }
        }
        
        // Find matching hint
        let matchedHint = '';
        let matchedSelector = '';
        
        for (const selector of selectors) {
          if (componentHints[selector]) {
            matchedHint = componentHints[selector];
            matchedSelector = selector;
            break;
          }
        }
        
        // Try partial matches for complex selectors
        if (!matchedHint) {
          for (const [hintSelector, hint] of Object.entries(componentHints)) {
            for (const selector of selectors) {
              if (hintSelector.includes(selector) || selector.includes(hintSelector.replace(/[[\].:]/g, ''))) {
                matchedHint = hint;
                matchedSelector = hintSelector;
                break;
              }
            }
            if (matchedHint) break;
          }
        }
        
        if (matchedHint && matchedSelector !== lastElementRef.current) {
          lastElementRef.current = matchedSelector;
          setCurrentElement(matchedSelector);
          console.log(`Voice Trainer: Hovering over ${matchedSelector}`);
          speak(matchedHint, 'low');
        }
      }, 800);
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [speak, isMuted, isPaused]);

  const handlePauseToggle = () => {
    setPaused(!isPaused);
    if (isPaused) {
      console.log('Voice Trainer: Resumed - detailed guidance active');
      speak('Voice guidance resumed. Hover over interface elements for detailed instructions.', 'medium');
    } else {
      console.log('Voice Trainer: Paused - guidance temporarily disabled');
      stopSpeaking();
    }
  };

  return (
    <div className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 ${
      isDarkMode ? 'text-white' : 'text-gray-800'
    }`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePauseToggle}
        className={`rounded-full p-2 ${
          isDarkMode 
            ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-600' 
            : 'bg-white hover:bg-gray-100 border-gray-300'
        } ${isPaused ? 'border-yellow-500' : ''}`}
        title={isPaused ? "Resume voice guidance" : "Pause voice guidance"}
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