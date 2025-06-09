
import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Clock, TrendingUp, FileText, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useVoiceTrainer } from '@/contexts/VoiceTrainerContext';
import { useUI } from '@/contexts/UIContext';

interface SearchResult {
  id: string;
  type: 'market-data' | 'portfolio' | 'alert' | 'news' | 'action';
  title: string;
  subtitle?: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
  keywords: string[];
}

interface GlobalSearchProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ darkMode, isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { announceAction, announceSuccess } = useVoiceTrainer();
  const { marketData, handleAction } = useUI();

  // Generate comprehensive search results
  const allResults: SearchResult[] = useMemo(() => {
    const results: SearchResult[] = [];

    // Market Data Results
    marketData.forEach(item => {
      results.push({
        id: `market-${item.id}`,
        type: 'market-data',
        title: `${item.symbol} - ${item.name}`,
        subtitle: `$${item.value.toFixed(2)} ${item.direction === 'up' ? '↗' : '↘'} ${item.change.toFixed(2)}`,
        description: `${item.type} in ${item.sector || 'Unknown'} sector`,
        icon: <TrendingUp className="w-4 h-4" />,
        action: () => handleAction('view', 'marketData', item.id),
        category: 'Market Data',
        keywords: [item.symbol, item.name, item.type, item.sector || '']
      });
    });

    // Action Results
    const actions = [
      {
        id: 'add-market-data',
        title: 'Add Market Data',
        description: 'Add a new stock, crypto, or other financial instrument',
        action: () => handleAction('add', 'marketData'),
        keywords: ['add', 'create', 'new', 'market', 'data', 'stock', 'crypto']
      },
      {
        id: 'add-portfolio',
        title: 'Add Portfolio Item',
        description: 'Add a new position to your portfolio',
        action: () => handleAction('add', 'portfolio'),
        keywords: ['add', 'create', 'new', 'portfolio', 'position', 'holding']
      },
      {
        id: 'create-alert',
        title: 'Create Alert',
        description: 'Set up a price or condition alert',
        action: () => handleAction('add', 'alert'),
        keywords: ['create', 'add', 'new', 'alert', 'notification', 'price', 'condition']
      },
      {
        id: 'export-data',
        title: 'Export Data',
        description: 'Export your data to CSV or other formats',
        action: () => announceAction('Export functionality'),
        keywords: ['export', 'download', 'csv', 'data', 'backup']
      },
      {
        id: 'refresh-data',
        title: 'Refresh All Data',
        description: 'Update all market data and prices',
        action: () => announceAction('Refreshing all data'),
        keywords: ['refresh', 'update', 'reload', 'sync', 'data']
      }
    ];

    actions.forEach(action => {
      results.push({
        id: action.id,
        type: 'action',
        title: action.title,
        description: action.description,
        icon: <Search className="w-4 h-4" />,
        action: action.action,
        category: 'Actions',
        keywords: action.keywords
      });
    });

    // Navigation Results
    const navigation = [
      { id: 'nav-dashboard', title: 'Dashboard', path: '/', keywords: ['dashboard', 'home', 'overview', 'main'] },
      { id: 'nav-market-data', title: 'Market Data', path: '/market-data', keywords: ['market', 'data', 'stocks', 'prices'] },
      { id: 'nav-portfolio', title: 'Portfolio', path: '/portfolio', keywords: ['portfolio', 'holdings', 'positions'] },
      { id: 'nav-trading', title: 'Trading', path: '/trading', keywords: ['trading', 'orders', 'buy', 'sell'] },
      { id: 'nav-alerts', title: 'Alerts', path: '/alerts', keywords: ['alerts', 'notifications', 'warnings'] },
      { id: 'nav-research', title: 'Research', path: '/research', keywords: ['research', 'analysis', 'reports'] },
      { id: 'nav-news', title: 'News', path: '/news', keywords: ['news', 'articles', 'updates'] }
    ];

    navigation.forEach(nav => {
      results.push({
        id: nav.id,
        type: 'action',
        title: `Go to ${nav.title}`,
        description: `Navigate to the ${nav.title.toLowerCase()} section`,
        icon: <FileText className="w-4 h-4" />,
        action: () => window.location.href = nav.path,
        category: 'Navigation',
        keywords: nav.keywords
      });
    });

    return results;
  }, [marketData, handleAction, announceAction]);

  // Filter results based on query
  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return allResults.filter(result => {
      const searchableText = [
        result.title,
        result.subtitle || '',
        result.description || '',
        result.category,
        ...result.keywords
      ].join(' ').toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    }).slice(0, 20); // Limit to top 20 results
  }, [query, allResults]);

  // Group results by category
  const groupedResults = useMemo(() => {
    const groups: { [key: string]: SearchResult[] } = {};
    filteredResults.forEach(result => {
      if (!groups[result.category]) {
        groups[result.category] = [];
      }
      groups[result.category].push(result);
    });
    return groups;
  }, [filteredResults]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setSelectedIndex(0);
    
    if (searchQuery.trim()) {
      announceAction(`Searching for ${searchQuery}, found ${filteredResults.length} results`);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    // Add to recent searches
    setRecentSearches(prev => {
      const updated = [query, ...prev.filter(s => s !== query)].slice(0, 5);
      return updated;
    });

    announceSuccess(`Selected ${result.title}`);
    result.action();
    onClose();
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          handleSelectResult(filteredResults[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    announceAction('Cleared recent searches');
  };

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-3xl max-h-[80vh] p-0",
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Global Search
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search market data, actions, navigation..."
              className={cn(
                "pl-10 pr-10",
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-300"
              )}
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => setQuery('')}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-96">
          {query.trim() === '' && recentSearches.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Recent Searches</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="text-xs"
                >
                  Clear
                </Button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-auto p-2"
                    onClick={() => handleSearch(search)}
                  >
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {query.trim() !== '' && Object.keys(groupedResults).length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-2">Try searching for market data, actions, or navigation items</p>
            </div>
          )}

          {Object.entries(groupedResults).map(([category, results], categoryIndex) => (
            <div key={category} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{category}</h3>
              <div className="space-y-1">
                {results.map((result, resultIndex) => {
                  const globalIndex = Object.values(groupedResults)
                    .slice(0, categoryIndex)
                    .reduce((acc, cat) => acc + cat.length, 0) + resultIndex;
                  
                  return (
                    <Button
                      key={result.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-auto p-3 text-left",
                        globalIndex === selectedIndex && "bg-blue-100 dark:bg-blue-900"
                      )}
                      onClick={() => handleSelectResult(result)}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="mt-0.5">{result.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{result.title}</div>
                          {result.subtitle && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {result.subtitle}
                            </div>
                          )}
                          {result.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-500">
                              {result.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredResults.length > 0 && (
          <div className="p-3 border-t bg-gray-50 dark:bg-zinc-900 text-xs text-gray-500 dark:text-gray-400">
            Use ↑↓ to navigate, Enter to select, Esc to close
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;
