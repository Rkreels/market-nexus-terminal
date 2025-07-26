
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Briefcase, Plus, Edit, Trash2, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { useUI } from '@/contexts/UIContext';
import { useToast } from '@/hooks/use-toast';
import AddItemForm from '@/components/AddItemForm';

interface PortfolioPanelProps {
  darkMode: boolean;
}

const PortfolioPanel: React.FC<PortfolioPanelProps> = ({ darkMode }) => {
  const { portfolioHoldings, addHolding, editHolding, deleteHolding, marketData } = useUI();
  const { toast } = useToast();
  const [isAddHoldingOpen, setIsAddHoldingOpen] = useState(false);
  const [isEditHoldingOpen, setIsEditHoldingOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState<any>(null);

  const holdingFields = [
    {
      name: 'symbol',
      label: 'Symbol',
      type: 'text' as const,
      placeholder: 'e.g., AAPL',
      required: true
    },
    {
      name: 'shares',
      label: 'Shares',
      type: 'number' as const,
      placeholder: '100',
      required: true
    },
    {
      name: 'avgPrice',
      label: 'Average Price',
      type: 'number' as const,
      placeholder: '150.00',
      required: true
    }
  ];

  const calculateHoldingValue = (holding: any) => {
    const marketItem = marketData.find(item => item.symbol === holding.symbol);
    const currentPrice = marketItem ? marketItem.value : holding.avgPrice;
    const value = holding.shares * currentPrice;
    const change = holding.shares * (currentPrice - holding.avgPrice);
    return { value, change, currentPrice };
  };

  const totalPortfolioValue = portfolioHoldings.reduce((total, holding) => {
    const { value } = calculateHoldingValue(holding);
    return total + value;
  }, 0);

  const totalPortfolioChange = portfolioHoldings.reduce((total, holding) => {
    const { change } = calculateHoldingValue(holding);
    return total + change;
  }, 0);

  const handleAddHolding = (data: any) => {
    const marketItem = marketData.find(item => item.symbol.toUpperCase() === data.symbol.toUpperCase());
    if (marketItem) {
      const newHolding = {
        symbol: data.symbol.toUpperCase(),
        name: marketItem.name,
        shares: parseInt(data.shares),
        avgPrice: parseFloat(data.avgPrice),
      };
      addHolding(newHolding);
      setIsAddHoldingOpen(false);
      toast({
        title: "Holding Added",
        description: `${data.shares} shares of ${data.symbol} added to portfolio.`,
      });
    } else {
      toast({
        title: "Symbol Not Found",
        description: "Please add this symbol to market data first.",
        variant: "destructive"
      });
    }
  };

  const handleEditHolding = (data: any) => {
    if (!selectedHolding) return;
    const updatedHolding = {
      ...selectedHolding,
      shares: parseInt(data.shares),
      avgPrice: parseFloat(data.avgPrice),
    };
    editHolding(selectedHolding.id, updatedHolding);
    setIsEditHoldingOpen(false);
    setSelectedHolding(null);
    toast({
      title: "Holding Updated",
      description: "Portfolio holding has been updated successfully.",
    });
  };

  const handleDeleteHolding = () => {
    if (selectedHolding) {
      deleteHolding(selectedHolding.id);
      setIsDeleteDialogOpen(false);
      setSelectedHolding(null);
      toast({
        title: "Holding Removed",
        description: "The holding has been removed from your portfolio.",
      });
    }
  };

  return (
    <Card className={cn(
      "border",
      darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center">
          <Briefcase className="w-4 h-4 mr-2" />
          Portfolio ({portfolioHoldings.length} holdings)
        </CardTitle>
        <Dialog open={isAddHoldingOpen} onOpenChange={setIsAddHoldingOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Holding
            </Button>
          </DialogTrigger>
          <DialogContent className={darkMode ? "bg-zinc-800 border-zinc-700" : ""}>
            <DialogHeader>
              <DialogTitle>Add New Holding</DialogTitle>
            </DialogHeader>
            <AddItemForm
              itemType="Holding"
              fields={holdingFields}
              onSubmit={handleAddHolding}
              onCancel={() => setIsAddHoldingOpen(false)}
              darkMode={darkMode}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {/* Portfolio Summary */}
        <div className={cn(
          "p-4 rounded-lg mb-4",
          darkMode ? "bg-zinc-900" : "bg-gray-50"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold">${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total P&L</p>
              <p className={cn(
                "text-xl font-bold",
                totalPortfolioChange >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {totalPortfolioChange >= 0 ? '+' : ''}${totalPortfolioChange.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {portfolioHoldings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <PieChart className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No holdings in portfolio</p>
            <p className="text-sm">Add your first holding to track performance</p>
          </div>
        ) : (
          <div className="space-y-3">
            {portfolioHoldings.map((holding) => {
              const { value, change, currentPrice } = calculateHoldingValue(holding);
              const changePercent = ((currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
              
              return (
                <div key={holding.id} className={cn(
                  "p-3 rounded-lg border",
                  darkMode ? "border-zinc-600 bg-zinc-900" : "border-gray-200 bg-gray-50"
                )}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{holding.symbol}</div>
                          <div className="text-sm text-gray-600">{holding.name}</div>
                          <div className="text-xs text-gray-500">{holding.shares} shares @ ${holding.avgPrice.toFixed(2)}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                          <div className="text-sm text-gray-600">${currentPrice.toFixed(2)}</div>
                          <div className={cn(
                            "text-sm flex items-center justify-end",
                            change >= 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {change >= 0 ? '+' : ''}${change.toFixed(2)} ({changePercent.toFixed(1)}%)
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-1 mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedHolding(holding);
                            setIsEditHoldingOpen(true);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedHolding(holding);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Edit Holding Dialog */}
      <Dialog open={isEditHoldingOpen} onOpenChange={setIsEditHoldingOpen}>
        <DialogContent className={darkMode ? "bg-zinc-800 border-zinc-700" : ""}>
          <DialogHeader>
            <DialogTitle>Edit Holding</DialogTitle>
          </DialogHeader>
          {selectedHolding && (
            <AddItemForm
              itemType="Holding"
              fields={holdingFields.map(field => ({
                ...field,
                defaultValue: field.name === 'shares' ? selectedHolding.shares.toString() : 
                             field.name === 'avgPrice' ? selectedHolding.avgPrice.toString() :
                             field.name === 'symbol' ? selectedHolding.symbol : undefined
              }))}
              onSubmit={handleEditHolding}
              onCancel={() => setIsEditHoldingOpen(false)}
              darkMode={darkMode}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className={darkMode ? "bg-zinc-800 border-zinc-700" : ""}>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Holding</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedHolding?.symbol} from your portfolio? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteHolding} className="bg-red-600 hover:bg-red-700">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default PortfolioPanel;
