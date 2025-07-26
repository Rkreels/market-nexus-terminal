
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, X, TrendingUp, TrendingDown, Eye, Briefcase, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUI } from '@/contexts/UIContext';

interface GlobalSearchProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  type: 'Market Data' | 'Portfolio' | 'Watchlist' | 'Alert';
  name: string;
  symbol?: string;
  price?: number;
  change?: number;
  direction?: 'up' | 'down';
  id: string | number;
  additional?: string;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  darkMode,
  isOpen,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { marketData, portfolioHoldings, watchlists, alerts } = useUI();

  // Clear search when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const getAllSearchResults = (): SearchResult[] => {
    const results: SearchResult[] = [];

    // Market Data results
    marketData.forEach(item => {
      results.push({
        type: 'Market Data',
        name: item.name,
        symbol: item.symbol,
        price: item.value,
        change: item.change,
        direction: item.direction,
        id: item.id,
        additional: item.sector
      });
    });

    // Portfolio results
    portfolioHoldings.forEach(holding => {
      const marketItem = marketData.find(item => item.symbol === holding.symbol);
      results.push({
        type: 'Portfolio',
        name: holding.name || holding.symbol,
        symbol: holding.symbol,
        price: marketItem?.value,
        change: marketItem?.change,
        direction: marketItem?.direction,
        id: holding.id,
        additional: `${holding.shares} shares`
      });
    });

    // Watchlist results
    watchlists.forEach(watchlist => {
      results.push({
        type: 'Watchlist',
        name: watchlist.name,
        id: watchlist.id,
        additional: `${watchlist.symbols.length} symbols`
      });
      
      // Add symbols in watchlists
      watchlist.symbols.forEach(symbol => {
        results.push({
          type: 'Watchlist',
          name: symbol.name,
          symbol: symbol.symbol,
          price: symbol.price,
          change: symbol.change,
          direction: symbol.direction,
          id: `${watchlist.id}-${symbol.symbol}`,
          additional: `In "${watchlist.name}"`
        });
      });
    });

    // Alert results
    alerts.forEach(alert => {
      results.push({
        type: 'Alert',
        name: alert.name,
        symbol: alert.symbol,
        id: alert.id,
        additional: `${alert.type} ${alert.condition} $${alert.value}`
      });
    });

    return results;
  };

  const filteredResults = getAllSearchResults().filter(result => {
    if (!searchQuery.trim()) return false;
    
    const query = searchQuery.toLowerCase();
    return (
      result.name.toLowerCase().includes(query) ||
      result.symbol?.toLowerCase().includes(query) ||
      result.type.toLowerCase().includes(query) ||
      result.additional?.toLowerCase().includes(query)
    );
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-2xl",
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Global Search
            </span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search stocks, crypto, news, portfolio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {searchQuery.trim() === '' ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Start typing to search across all modules</p>
                <p className="text-sm">Search for stocks, portfolios, watchlists, and alerts</p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No results found for "{searchQuery}"</p>
                <p className="text-sm">Try different keywords or check spelling</p>
              </div>
            ) : (
              filteredResults.map((result, index) => {
                const getIcon = () => {
                  switch (result.type) {
                    case 'Market Data': return <TrendingUp className="w-4 h-4" />;
                    case 'Portfolio': return <Briefcase className="w-4 h-4" />;
                    case 'Watchlist': return <Eye className="w-4 h-4" />;
                    case 'Alert': return <Bell className="w-4 h-4" />;
                    default: return <Search className="w-4 h-4" />;
                  }
                };

                const getTypeColor = () => {
                  switch (result.type) {
                    case 'Market Data': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
                    case 'Portfolio': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
                    case 'Watchlist': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
                    case 'Alert': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
                    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
                  }
                };

                return (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors",
                      "hover:bg-gray-100 dark:hover:bg-zinc-700",
                      darkMode ? "bg-zinc-900 border border-zinc-700" : "bg-gray-50 border border-gray-200"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className={cn("p-2 rounded-full", getTypeColor())}>
                          {getIcon()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="font-medium">{result.name}</div>
                            <Badge variant="secondary" className={cn("text-xs", getTypeColor())}>
                              {result.type}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {result.symbol && <span className="font-mono">{result.symbol}</span>}
                            {result.symbol && result.additional && <span> • </span>}
                            {result.additional && <span>{result.additional}</span>}
                          </div>
                        </div>
                      </div>
                      {result.price && (
                        <div className="text-right">
                          <div className="font-medium">${result.price.toFixed(2)}</div>
                          {result.change !== undefined && result.direction && (
                            <div className={cn(
                              "text-sm flex items-center justify-end",
                              result.direction === 'up' ? "text-green-600" : "text-red-600"
                            )}>
                              {result.direction === 'up' ? 
                                <TrendingUp className="w-3 h-3 mr-1" /> : 
                                <TrendingDown className="w-3 h-3 mr-1" />
                              }
                              {result.change > 0 ? '+' : ''}{result.change.toFixed(2)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;
