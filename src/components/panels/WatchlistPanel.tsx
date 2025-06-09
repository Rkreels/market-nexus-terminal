import { FC, useState } from "react";
import { List, ArrowUpRight, ArrowDownRight, Star, Edit2, Plus, Trash2, Settings, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useVoiceTrainer } from "@/contexts/VoiceTrainerContext";
import { useToast } from "@/hooks/use-toast";

interface WatchlistPanelProps {
  darkMode: boolean;
}

interface WatchlistStock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  direction: "up" | "down";
  addedDate: string;
  notes?: string;
}

const initialWatchlistStocks: WatchlistStock[] = [
  { 
    id: "1",
    symbol: "AAPL", 
    name: "Apple Inc.", 
    price: 189.46, 
    change: +1.23, 
    percentChange: +0.65, 
    direction: "up",
    addedDate: new Date().toISOString()
  },
  { 
    id: "2",
    symbol: "MSFT", 
    name: "Microsoft Corp.", 
    price: 407.54, 
    change: +4.87, 
    percentChange: +1.21, 
    direction: "up",
    addedDate: new Date().toISOString()
  },
  { 
    id: "3",
    symbol: "GOOGL", 
    name: "Alphabet Inc.", 
    price: 142.56, 
    change: -0.78, 
    percentChange: -0.54, 
    direction: "down",
    addedDate: new Date().toISOString()
  },
  { 
    id: "4",
    symbol: "AMZN", 
    name: "Amazon.com Inc.", 
    price: 168.59, 
    change: +0.41, 
    percentChange: +0.24, 
    direction: "up",
    addedDate: new Date().toISOString()
  },
  { 
    id: "5",
    symbol: "TSLA", 
    name: "Tesla Inc.", 
    price: 193.57, 
    change: -2.34, 
    percentChange: -1.19, 
    direction: "down",
    addedDate: new Date().toISOString()
  }
];

const WatchlistPanel: FC<WatchlistPanelProps> = ({ darkMode }) => {
  const [watchlistStocks, setWatchlistStocks] = useState<WatchlistStock[]>(initialWatchlistStocks);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [newName, setNewName] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [selectedStock, setSelectedStock] = useState<WatchlistStock | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'symbol' | 'name' | 'price' | 'change'>('symbol');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { announceAction, announceSuccess, announceError } = useVoiceTrainer();
  const { toast } = useToast();

  const sortedStocks = [...watchlistStocks].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * multiplier;
    }
    return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * multiplier;
  });

  const validateSymbol = (symbol: string): boolean => {
    return /^[A-Z]{1,10}$/.test(symbol.toUpperCase());
  };

  const generateMockPrice = () => {
    return Math.round((Math.random() * 500 + 50) * 100) / 100;
  };

  const generateMockChange = () => {
    const change = Math.round((Math.random() - 0.5) * 10 * 100) / 100;
    const percentChange = Math.round((Math.random() - 0.5) * 5 * 100) / 100;
    return { change, percentChange, direction: change >= 0 ? "up" : "down" as "up" | "down" };
  };

  const handleAddSymbol = () => {
    if (!newSymbol.trim()) {
      announceError("Symbol is required");
      return;
    }

    if (!validateSymbol(newSymbol)) {
      announceError("Invalid symbol format");
      toast({
        title: "Invalid Symbol",
        description: "Symbol must be 1-10 uppercase letters",
        variant: "destructive",
      });
      return;
    }

    if (watchlistStocks.find(stock => stock.symbol === newSymbol.toUpperCase())) {
      announceError("Symbol already exists in watchlist");
      toast({
        title: "Duplicate Symbol",
        description: "This symbol is already in your watchlist",
        variant: "destructive",
      });
      return;
    }

    const { change, percentChange, direction } = generateMockChange();
    const newStock: WatchlistStock = {
      id: Date.now().toString(),
      symbol: newSymbol.toUpperCase(),
      name: newName.trim() || `${newSymbol.toUpperCase()} Company`,
      price: generateMockPrice(),
      change,
      percentChange,
      direction,
      addedDate: new Date().toISOString(),
      notes: newNotes.trim()
    };
    
    setWatchlistStocks(prev => [...prev, newStock]);
    setNewSymbol("");
    setNewName("");
    setNewNotes("");
    setIsAddDialogOpen(false);
    
    announceSuccess(`Added ${newStock.symbol} to watchlist`);
    toast({
      title: "Symbol Added",
      description: `${newStock.symbol} has been added to your watchlist`,
    });
    console.log(`Added new stock: ${newStock.symbol}`);
  };

  const handleEditStock = (stock: WatchlistStock) => {
    setSelectedStock(stock);
    setNewSymbol(stock.symbol);
    setNewName(stock.name);
    setNewNotes(stock.notes || "");
    setIsEditDialogOpen(true);
    announceAction('Opening edit form', stock.symbol);
  };

  const handleUpdateStock = () => {
    if (!selectedStock) return;

    const updatedStock = {
      ...selectedStock,
      name: newName.trim() || selectedStock.name,
      notes: newNotes.trim()
    };

    setWatchlistStocks(prev => 
      prev.map(stock => stock.id === selectedStock.id ? updatedStock : stock)
    );
    
    setIsEditDialogOpen(false);
    setSelectedStock(null);
    setNewSymbol("");
    setNewName("");
    setNewNotes("");
    
    announceSuccess(`Updated ${updatedStock.symbol}`);
    toast({
      title: "Stock Updated",
      description: `${updatedStock.symbol} has been updated`,
    });
  };

  const handleDeleteStock = (stock: WatchlistStock) => {
    setSelectedStock(stock);
    setIsDeleteDialogOpen(true);
    announceAction('Confirming delete', stock.symbol);
  };

  const confirmDelete = () => {
    if (!selectedStock) return;
    
    setWatchlistStocks(prev => prev.filter(stock => stock.id !== selectedStock.id));
    setIsDeleteDialogOpen(false);
    const stockName = selectedStock.symbol;
    setSelectedStock(null);
    
    announceSuccess(`Removed ${stockName} from watchlist`);
    toast({
      title: "Stock Removed",
      description: `${stockName} has been removed from your watchlist`,
    });
    console.log(`Removed stock: ${stockName}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    announceAction('Refreshing watchlist prices');
    
    // Simulate price updates
    setTimeout(() => {
      setWatchlistStocks(prev => prev.map(stock => {
        const { change, percentChange, direction } = generateMockChange();
        return {
          ...stock,
          price: generateMockPrice(),
          change,
          percentChange,
          direction
        };
      }));
      
      setIsRefreshing(false);
      announceSuccess('Watchlist refreshed');
      toast({
        title: "Prices Updated",
        description: "All watchlist prices have been refreshed",
      });
    }, 2000);
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    announceAction(`Sorted by ${column} ${sortOrder === 'asc' ? 'descending' : 'ascending'}`);
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
          <h3 className="font-medium">Watchlist ({watchlistStocks.length})</h3>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh prices"
          >
            <RefreshCw className={cn("w-3 h-3 mr-1", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="add-button"
                title="Add new symbol"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className={cn(
              "max-w-md",
              darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white"
            )}>
              <DialogHeader>
                <DialogTitle>Add to Watchlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Symbol *</label>
                  <Input
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter symbol (e.g., NVDA)"
                    className={cn(
                      darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                    )}
                    maxLength={10}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Optional company name"
                    className={cn(
                      darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <Input
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Optional notes"
                    className={cn(
                      darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                    )}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddSymbol}
                    disabled={!newSymbol.trim()}
                  >
                    Add Symbol
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                title="Settings"
              >
                <Settings className="w-3 h-3 mr-1" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className={cn(
              "max-w-md",
              darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white"
            )}>
              <DialogHeader>
                <DialogTitle>Watchlist Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Default Sort</label>
                  <select 
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [col, order] = e.target.value.split('-');
                      setSortBy(col as typeof sortBy);
                      setSortOrder(order as 'asc' | 'desc');
                    }}
                    className={cn(
                      "w-full p-2 border rounded",
                      darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                    )}
                  >
                    <option value="symbol-asc">Symbol A-Z</option>
                    <option value="symbol-desc">Symbol Z-A</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="price-asc">Price Low-High</option>
                    <option value="price-desc">Price High-Low</option>
                    <option value="change-asc">Change Low-High</option>
                    <option value="change-desc">Change High-Low</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setIsSettingsOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className={cn(
            darkMode ? "bg-zinc-700" : "bg-gray-50"
          )}>
            <tr>
              <th 
                className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                onClick={() => handleSort('symbol')}
              >
                Symbol {sortBy === 'symbol' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                onClick={() => handleSort('price')}
              >
                Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                onClick={() => handleSort('change')}
              >
                Change {sortBy === 'change' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={cn("divide-y", 
            darkMode ? "divide-zinc-700" : "divide-gray-200"
          )}>
            {sortedStocks.map((stock) => (
              <tr key={stock.id} className="hover:bg-opacity-80 transition-colors">
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
                      {stock.notes && (
                        <div className={cn("text-xs italic", 
                          darkMode ? "text-gray-500" : "text-gray-400"
                        )}>
                          {stock.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
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
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleEditStock(stock)}
                      title="Edit stock"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleDeleteStock(stock)}
                      title="Remove from watchlist"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedStocks.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No stocks in your watchlist. Add some symbols to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className={cn(
          "max-w-md",
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white"
        )}>
          <DialogHeader>
            <DialogTitle>Edit Stock</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Symbol</label>
              <Input
                value={newSymbol}
                disabled
                className={cn(
                  "bg-gray-100 dark:bg-gray-700",
                  darkMode ? "border-zinc-600" : "border-gray-300"
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Company name"
                className={cn(
                  darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <Input
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Optional notes"
                className={cn(
                  darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                )}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStock}>
                Update Stock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className={darkMode ? "bg-zinc-800 border-zinc-700" : ""}>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Watchlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{selectedStock?.symbol}" from your watchlist?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WatchlistPanel;
