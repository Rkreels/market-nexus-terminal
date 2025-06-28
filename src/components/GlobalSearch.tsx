
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GlobalSearchProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  darkMode,
  isOpen,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = [
    { type: 'Stock', name: 'Apple Inc.', symbol: 'AAPL', price: '$150.25' },
    { type: 'Stock', name: 'Microsoft Corp.', symbol: 'MSFT', price: '$285.60' },
  ];

  const filteredResults = searchResults.filter(result =>
    result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            {filteredResults.map((result, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700",
                  darkMode ? "bg-zinc-900" : "bg-gray-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-gray-600">{result.symbol} • {result.type}</div>
                  </div>
                  <div className="font-medium">{result.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;
