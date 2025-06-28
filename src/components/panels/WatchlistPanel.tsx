
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface WatchlistPanelProps {
  darkMode: boolean;
}

const WatchlistPanel: React.FC<WatchlistPanelProps> = ({ darkMode }) => {
  const watchlistItems = [
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '$245.50', change: '+2.1%', isPositive: true },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$140.25', change: '-0.8%', isPositive: false },
  ];

  return (
    <Card className={cn(
      "border",
      darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="w-4 h-4 mr-2" />
          Watchlist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {watchlistItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{item.symbol}</div>
                <div className="text-sm text-gray-600">{item.name}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{item.price}</div>
                <div className={cn(
                  "text-sm",
                  item.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {item.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WatchlistPanel;
