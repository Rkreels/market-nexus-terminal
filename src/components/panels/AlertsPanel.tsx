
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Plus, X, Eye, Download } from 'lucide-react';
import { Alert, WatchlistItem } from '@/types/marketData';
import { useUI } from '@/contexts/UIContext';
import { useToast } from '@/hooks/use-toast';

interface AlertsPanelProps {
  darkMode: boolean;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ darkMode }) => {
  const { alerts: contextAlerts, addAlert, deleteAlert, watchlists, marketData } = useUI();
  const { toast } = useToast();

  const [newAlert, setNewAlert] = useState({
    symbol: '',
    condition: 'above',
    value: ''
  });

  const [newWatchlistItem, setNewWatchlistItem] = useState('');

  const handleAddAlert = () => {
    if (!newAlert.symbol || !newAlert.value) return;
    
    const marketItem = marketData.find(item => item.symbol.toUpperCase() === newAlert.symbol.toUpperCase());
    if (!marketItem) {
      toast({
        title: "Symbol Not Found",
        description: "Please add this symbol to market data first.",
        variant: "destructive"
      });
      return;
    }
    
    const alert: Omit<Alert, 'id'> = {
      type: 'price',
      symbol: newAlert.symbol.toUpperCase(),
      name: marketItem.name,
      condition: newAlert.condition,
      value: parseFloat(newAlert.value),
      currentValue: marketItem.value,
      status: 'pending',
      created: new Date().toISOString()
    };
    
    addAlert(alert);
    setNewAlert({ symbol: '', condition: 'above', value: '' });
    toast({
      title: "Alert Created",
      description: `Alert set for ${alert.symbol} ${alert.condition} $${alert.value}`,
    });
  };

  const handleAddToWatchlist = () => {
    if (!newWatchlistItem.trim()) return;
    
    if (watchlists.length === 0) {
      toast({
        title: "No Watchlist",
        description: "Please create a watchlist first.",
        variant: "destructive"
      });
      return;
    }
    
    const marketItem = marketData.find(item => item.symbol.toUpperCase() === newWatchlistItem.toUpperCase());
    if (!marketItem) {
      toast({
        title: "Symbol Not Found",
        description: "Please add this symbol to market data first.",
        variant: "destructive"
      });
      return;
    }
    
    const item: WatchlistItem = {
      symbol: marketItem.symbol,
      name: marketItem.name,
      price: marketItem.value,
      change: marketItem.change,
      direction: marketItem.direction
    };
    
    // Add to first watchlist (or create logic to select which watchlist)
    // For simplicity, we'll show a message to use the dedicated watchlist page
    toast({
      title: "Use Watchlist Page",
      description: "Please use the dedicated Watchlist page to manage watchlists.",
    });
    setNewWatchlistItem('');
  };

  const handleRemoveAlert = (id: number) => {
    deleteAlert(id);
    toast({
      title: "Alert Removed",
      description: "The alert has been removed successfully.",
    });
  };

  const handleExportAlerts = () => {
    const csvContent = [
      ['Symbol', 'Type', 'Condition', 'Value', 'Status', 'Created'],
      ...contextAlerts.map(alert => [
        alert.symbol,
        alert.type,
        alert.condition,
        alert.value.toString(),
        alert.status,
        alert.created
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alerts.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Alerts exported to CSV successfully.",
    });
  };

  const handleRemoveFromWatchlist = (symbol: string) => {
    toast({
      title: "Use Watchlist Page", 
      description: "Please use the dedicated Watchlist page to manage watchlists.",
    });
  };

  return (
    <Card className={cn("border", darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center">
          <Bell className="w-4 h-4 mr-2" />
          Alerts & Watchlists
        </CardTitle>
        <Button size="sm" variant="outline" onClick={handleExportAlerts}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          </TabsList>
          
          <TabsContent value="alerts" className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Input
                value={newAlert.symbol}
                onChange={(e) => setNewAlert(prev => ({ ...prev, symbol: e.target.value }))}
                placeholder="Symbol"
              />
              <Select value={newAlert.condition} onValueChange={(value) => setNewAlert(prev => ({ ...prev, condition: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Above</SelectItem>
                  <SelectItem value="below">Below</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex space-x-1">
                <Input
                  type="number"
                  value={newAlert.value}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Price"
                />
                <Button size="sm" onClick={handleAddAlert}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              {contextAlerts.map((alert) => (
                <div key={alert.id} className={cn(
                  "p-3 rounded border flex justify-between items-center",
                  darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-200 bg-gray-50"
                )}>
                  <div>
                    <div className="font-medium">
                      {alert.symbol} {alert.condition} ${alert.value}
                    </div>
                    <div className="text-sm text-gray-600">
                      Current: ${alert.currentValue?.toFixed(2)} | Created: {new Date(alert.created).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "px-2 py-1 rounded text-xs",
                      alert.status === 'pending' ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                    )}>
                      {alert.status}
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleRemoveAlert(alert.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="watchlist" className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newWatchlistItem}
                onChange={(e) => setNewWatchlistItem(e.target.value)}
                placeholder="Add symbol to watchlist"
                onKeyDown={(e) => e.key === 'Enter' && handleAddToWatchlist()}
              />
              <Button onClick={handleAddToWatchlist}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="space-y-2">
              {watchlists.length > 0 && watchlists[0]?.symbols?.map((item) => (
                <div key={item.symbol} className={cn(
                  "p-3 rounded border flex justify-between items-center",
                  darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-200 bg-gray-50"
                )}>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium">{item.symbol}</div>
                      <div className="text-sm text-gray-600">{item.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="font-medium">${item.price.toFixed(2)}</div>
                      <div className={cn(
                        "text-sm",
                        item.direction === 'up' ? "text-green-600" : "text-red-600"
                      )}>
                        {item.direction === 'up' ? '+' : ''}{item.change.toFixed(2)}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleRemoveFromWatchlist(item.symbol)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
