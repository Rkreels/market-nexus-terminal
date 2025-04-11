
import { FC } from "react";
import { List, ArrowUpRight, ArrowDownRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface WatchlistPanelProps {
  darkMode: boolean;
}

// Mock watchlist data
const watchlistStocks = [
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
  return (
    <div className={cn("rounded-lg overflow-hidden shadow-md", 
      darkMode ? "bg-zinc-800 border border-zinc-700" : "bg-white border border-gray-200"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <List className={cn("w-5 h-5 mr-2", darkMode ? "text-yellow-400" : "text-yellow-600")} />
          <h3 className="font-medium">Watchlist</h3>
        </div>
        <div className={cn("text-xs px-2 py-1 rounded hover:bg-opacity-80 cursor-pointer", 
          darkMode ? "bg-zinc-700 text-zinc-300" : "bg-gray-100 text-gray-700"
        )}>
          Edit
        </div>
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
                    {stock.percentChange.toFixed(2)}%
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
