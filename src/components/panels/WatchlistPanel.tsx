
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Eye, Plus, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useUI } from '@/contexts/UIContext';
import { useToast } from '@/hooks/use-toast';
import AddItemForm from '@/components/AddItemForm';

interface WatchlistPanelProps {
  darkMode: boolean;
}

const WatchlistPanel: React.FC<WatchlistPanelProps> = ({ darkMode }) => {
  const { watchlists, addWatchlist, deleteWatchlist, addToWatchlist, removeFromWatchlist, marketData } = useUI();
  const { toast } = useToast();
  const [isAddWatchlistOpen, setIsAddWatchlistOpen] = useState(false);
  const [isAddSymbolOpen, setIsAddSymbolOpen] = useState(false);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [watchlistToDelete, setWatchlistToDelete] = useState<number | null>(null);

  const watchlistFields = [
    {
      name: 'name',
      label: 'Watchlist Name',
      type: 'text' as const,
      placeholder: 'e.g., Tech Stocks',
      required: true
    }
  ];

  const symbolFields = [
    {
      name: 'symbol',
      label: 'Symbol',
      type: 'text' as const,
      placeholder: 'e.g., AAPL',
      required: true
    }
  ];

  const handleCreateWatchlist = (data: any) => {
    addWatchlist({ name: data.name, symbols: [] });
    setIsAddWatchlistOpen(false);
    toast({
      title: "Watchlist Created",
      description: `"${data.name}" watchlist has been created successfully.`,
    });
  };

  const handleAddSymbol = (data: any) => {
    if (!selectedWatchlistId) return;
    
    const marketItem = marketData.find(item => item.symbol.toUpperCase() === data.symbol.toUpperCase());
    if (marketItem) {
      const watchlistItem = {
        symbol: marketItem.symbol,
        name: marketItem.name,
        price: marketItem.value,
        change: marketItem.change,
        direction: marketItem.direction
      };
      addToWatchlist(selectedWatchlistId, watchlistItem);
      setIsAddSymbolOpen(false);
      toast({
        title: "Symbol Added",
        description: `${marketItem.symbol} has been added to the watchlist.`,
      });
    } else {
      toast({
        title: "Symbol Not Found",
        description: "The symbol was not found in market data. Please add it to market data first.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteWatchlist = () => {
    if (watchlistToDelete) {
      deleteWatchlist(watchlistToDelete);
      setIsDeleteDialogOpen(false);
      setWatchlistToDelete(null);
      toast({
        title: "Watchlist Deleted",
        description: "The watchlist has been deleted successfully.",
      });
    }
  };

  const handleRemoveSymbol = (watchlistId: number, symbol: string) => {
    removeFromWatchlist(watchlistId, symbol);
    toast({
      title: "Symbol Removed",
      description: `${symbol} has been removed from the watchlist.`,
    });
  };

  return (
    <div className="space-y-4">
      <Card className={cn(
        "border",
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            Watchlists ({watchlists.length})
          </CardTitle>
          <Dialog open={isAddWatchlistOpen} onOpenChange={setIsAddWatchlistOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                New List
              </Button>
            </DialogTrigger>
            <DialogContent className={darkMode ? "bg-zinc-800 border-zinc-700" : ""}>
              <DialogHeader>
                <DialogTitle>Create New Watchlist</DialogTitle>
              </DialogHeader>
              <AddItemForm
                itemType="Watchlist"
                fields={watchlistFields}
                onSubmit={handleCreateWatchlist}
                onCancel={() => setIsAddWatchlistOpen(false)}
                darkMode={darkMode}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {watchlists.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No watchlists created yet</p>
              <p className="text-sm">Create your first watchlist to track symbols</p>
            </div>
          ) : (
            <div className="space-y-4">
              {watchlists.map((watchlist) => (
                <Card key={watchlist.id} className={cn(
                  "border",
                  darkMode ? "bg-zinc-900 border-zinc-600" : "bg-gray-50 border-gray-300"
                )}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center">
                      <h4 className="font-medium">{watchlist.name}</h4>
                      <span className="ml-2 text-sm text-gray-500">({watchlist.symbols.length})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedWatchlistId(watchlist.id);
                          setIsAddSymbolOpen(true);
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setWatchlistToDelete(watchlist.id);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {watchlist.symbols.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-2">No symbols added yet</p>
                    ) : (
                      <div className="space-y-2">
                        {watchlist.symbols.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-1">
                            <div className="flex items-center space-x-2">
                              <div>
                                <div className="font-medium text-sm">{item.symbol}</div>
                                <div className="text-xs text-gray-600">{item.name}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-right">
                                <div className="font-medium text-sm">${item.price.toFixed(2)}</div>
                                <div className={cn(
                                  "text-xs flex items-center",
                                  item.direction === 'up' ? "text-green-600" : "text-red-600"
                                )}>
                                  {item.direction === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                  {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveSymbol(watchlist.id, item.symbol)}
                                className="p-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Symbol Dialog */}
      <Dialog open={isAddSymbolOpen} onOpenChange={setIsAddSymbolOpen}>
        <DialogContent className={darkMode ? "bg-zinc-800 border-zinc-700" : ""}>
          <DialogHeader>
            <DialogTitle>Add Symbol to Watchlist</DialogTitle>
          </DialogHeader>
          <AddItemForm
            itemType="Symbol"
            fields={symbolFields}
            onSubmit={handleAddSymbol}
            onCancel={() => setIsAddSymbolOpen(false)}
            darkMode={darkMode}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className={darkMode ? "bg-zinc-800 border-zinc-700" : ""}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Watchlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this watchlist? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWatchlist} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WatchlistPanel;
