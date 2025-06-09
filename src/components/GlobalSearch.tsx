
import React, { useState, useMemo } from 'react';
import { Search, X, TrendingUp, Building, Newspaper, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useUI } from '@/contexts/UIContext';
import { useVoiceTrainer } from '@/contexts/VoiceTrainerContext';

interface SearchResult {
  id: string;
  title: string;
  type: 'stock' | 'news' | 'portfolio' | 'alert';
  description: string;
  value?: string;
  change?: number;
  icon: React.ReactNode;
}

interface GlobalSearchProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ darkMode, isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { handleAction } = useUI();
  const { announceAction } = useVoiceTrainer();

  // Mock data for search results
  const mockData: SearchResult[] = [
    {
      id: '1',
      title: 'Apple Inc.',
      type: 'stock',
      description: 'AAPL - Technology Stock',
      value: '$150.25',
      change: 2.5,
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: '2',
      title: 'Microsoft Corporation',
      type: 'stock',
      description: 'MSFT - Technology Stock',
      value: '$285.60',
      change: -1.2,
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: '3',
      title: 'Tech Stocks Rally',
      type: 'news',
      description: 'Market news about technology sector performance',
      icon: <Newspaper className="w-4 h-4" />
    },
    {
      id: '4',
      title: 'Portfolio Performance',
      type: 'portfolio',
      description: 'Your portfolio overview and performance metrics',
      value: '+5.2%',
      icon: <Building className="w-4 h-4" />
    },
    {
      id: '5',
      title: 'Price Alert - TSLA',
      type: 'alert',
      description: 'Tesla price alert triggered at $200',
      icon: <AlertCircle className="w-4 h-4" />
    }
  ];

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerms = query.toLowerCase().split(' ');
    return mockData.filter(item => 
      searchTerms.every(term =>
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      )
    ).slice(0, 8); // Limit to 8 results
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    announceAction(`Opening ${result.title}`, result.type);
    handleAction('view', result.type, result.id);
    
    // Clear search and close
    setQuery('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black bg-opacity-50">
      <Card className={cn(
        "w-full max-w-2xl mx-4",
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardContent className="p-0">
          <div className="flex items-center p-4 border-b border-gray-200 dark:border-zinc-700">
            <Search className={cn("w-5 h-5 mr-3", darkMode ? "text-gray-400" : "text-gray-500")} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search stocks, news, portfolio items..."
              className={cn(
                "flex-1 border-0 bg-transparent focus:ring-0 text-lg",
                darkMode ? "text-white placeholder-gray-400" : "text-black placeholder-gray-500"
              )}
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={cn("ml-2", darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black")}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {query.trim() && (
            <div className="max-h-96 overflow-y-auto">
              {filteredResults.length > 0 ? (
                <div className="py-2">
                  {filteredResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-zinc-700 focus:bg-gray-100 dark:focus:bg-zinc-700 focus:outline-none transition-colors",
                        "flex items-center justify-between"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          result.type === 'stock' && "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
                          result.type === 'news' && "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
                          result.type === 'portfolio' && "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400",
                          result.type === 'alert' && "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400"
                        )}>
                          {result.icon}
                        </div>
                        <div>
                          <div className={cn("font-medium", darkMode ? "text-white" : "text-black")}>
                            {result.title}
                          </div>
                          <div className={cn("text-sm", darkMode ? "text-gray-400" : "text-gray-600")}>
                            {result.description}
                          </div>
                        </div>
                      </div>
                      
                      {result.value && (
                        <div className="text-right">
                          <div className={cn("font-medium", darkMode ? "text-white" : "text-black")}>
                            {result.value}
                          </div>
                          {result.change !== undefined && (
                            <div className={cn(
                              "text-sm",
                              result.change >= 0 ? "text-green-600" : "text-red-600"
                            )}>
                              {result.change >= 0 ? '+' : ''}{result.change}%
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className={cn("text-gray-500 dark:text-gray-400")}>
                    No results found for "{query}"
                  </div>
                  <div className={cn("text-sm text-gray-400 dark:text-gray-500 mt-1")}>
                    Try searching for stocks, news, or portfolio items
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!query.trim() && (
            <div className="py-8 text-center">
              <Search className={cn("w-12 h-12 mx-auto mb-4", darkMode ? "text-gray-600" : "text-gray-400")} />
              <div className={cn("text-gray-500 dark:text-gray-400 mb-2")}>
                Search across all modules
              </div>
              <div className={cn("text-sm text-gray-400 dark:text-gray-500")}>
                Find stocks, news, portfolio items, and alerts
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalSearch;
