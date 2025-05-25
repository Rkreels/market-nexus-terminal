
import { FC, useState } from "react";
import { List, ArrowUpRight, ArrowDownRight, Star, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface WatchlistPanelProps {
  darkMode: boolean;
}

interface WatchlistStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  direction: "up" | "down";
}

const initialWatchlistStocks: WatchlistStock[] = [
  { 
    symbol: "AAPL", 
    name: "Apple Inc.", 
    price: 189.46, 
    change: +1.23, 
    percentChange: +0.65, 
    direction: "up" 
  },
  { 
    symbol: "MSFT", 
    name: "Microsoft Corp.", 
    price: 407.54, 
    change: +4.87, 
    percentChange: +1.21, 
    direction: "up" 
  },
  { 
    symbol: "GOOGL", 
    name: "Alphabet Inc.", 
    price: 142.56, 
    change: -0.78, 
    percentChange: -0.54, 
    direction: "down" 
  },
  { 
    symbol: "AMZN", 
    name: "Amazon.com Inc.", 
    price: 168.59, 
    change: +0.41, 
    percentChange: +0.24, 
    direction: "up" 
  },
  { 
    symbol: "TSLA", 
    name: "Tesla Inc.", 
    price: 193.57, 
    change: -2.34, 
    percentChange: -1.19, 
    direction: "down" 
  }
];

const WatchlistPanel: FC<WatchlistPanelProps> = ({ darkMode }) => {
  const [watchlistStocks, setWatchlistStocks] = useState<WatchlistStock[]>(initialWatchlistStocks);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");

  const handleAddSymbol = () => {
    if (newSymbol.trim() && !watchlistStocks.find(stock => stock.symbol === newSymbol.toUpperCase())) {
      const newStock: WatchlistStock = {
        symbol: newSymbol.toUpperCase(),
        name: `${newSymbol.toUpperCase()} Company`,
        price: Math.round((Math.random() * 500 + 50) * 100) / 100,
        change: Math.round((Math.random() - 0.5) * 10 * 100) / 100,
        percentChange: Math.round((Math.random() - 0.5) * 5 * 100) / 100,
        direction: Math.random() > 0.5 ? "up" : "down"
      };
      
      setWatchlistStocks(prev => [...prev, newStock]);
      setNewSymbol("");
      console.log(`Added new stock: ${newStock.symbol}`);
    }
  };

  const handleRemoveStock = (symbol: string) => {
    setWatchlistStocks(prev => prev.filter(stock => stock.symbol !== symbol));
    console.log(`Removed stock: ${symbol}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSymbol();
    }
  };

  return (
    <div className={cn("rounded-lg overflow-hidden shadow-md", 
      darkMode ? "bg-zinc-800 border border-zinc-700" : "bg-white border border-gray-200"
    )} data-component="watchlist-panel">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <List className={cn("w-5 h-5 mr-2", darkMode ? "text-yellow-400" : "text-yellow-600")} />
          <h3 className="font-medium">Watchlist</h3>
        </div>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              variant="outline"
              className={cn("edit-button text-xs px-2 py-1 rounded hover:bg-opacity-80 cursor-pointer", 
                darkMode ? "bg-zinc-700 text-zinc-300 hover:bg-zinc-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <Edit2 className="w-3 h-3 mr-1" />
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className={cn(
            "max-w-md",
            darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white"
          )}>
            <DialogHeader>
              <DialogTitle>Edit Watchlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Add Symbol</label>
                <div className="flex gap-2">
                  <Input
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter symbol (e.g., NVDA)"
                    className={cn(
                      "flex-1",
                      darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                    )}
                  />
                  <Button 
                    onClick={handleAddSymbol}
                    disabled={!newSymbol.trim()}
                    className="add-button"
                  >
                    Add
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Current Symbols ({watchlistStocks.length})</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {watchlistStocks.map((stock) => (
                    <div key={stock.symbol} className={cn(
                      "flex justify-between items-center p-2 border rounded",
                      darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-300 bg-gray-50"
                    )}>
                      <span className="text-sm">{stock.symbol} - {stock.name}</span>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleRemoveStock(stock.symbol)}
                        className="delete-button text-xs px-2 py-1"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className={cn(
            darkMode ? "bg-zinc-700" : "bg-gray-50"
          )}>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Symbol</th>
              <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">Price</th>
              <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">Change</th>
            </tr>
          </thead>
          <tbody className={cn("divide-y", 
            darkMode ? "divide-zinc-700" : "divide-gray-200"
          )}>
            {watchlistStocks.map((stock) => (
              <tr key={stock.symbol} className="hover:bg-opacity-80 cursor-pointer transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 mr-2 text-yellow-500 fill-yellow-500" />
                    <div>
                      <div className="font-medium">{stock.symbol}</div>
                      <div className={cn("text-xs", 
                        darkMode ? "text-gray-400" : "text-gray-500"
                      )}>
                        {stock.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className="font-medium">${stock.price.toFixed(2)}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className={cn("flex items-center justify-end", 
                    stock.direction === "up" ? "text-green-500" : "text-red-500"
                  )}>
                    {stock.direction === "up" ? (
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                    )}
                    {stock.direction === "up" ? "+" : ""}{stock.change.toFixed(2)} ({stock.percentChange.toFixed(2)}%)
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WatchlistPanel;
