
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Plus, X, Eye } from 'lucide-react';
import { Alert, WatchlistItem } from '@/types/marketData';

interface AlertsPanelProps {
  darkMode: boolean;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ darkMode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, type: 'price', symbol: 'AAPL', name: 'Apple Inc.', condition: 'above', value: 180, currentValue: 178.45, status: 'pending', created: '2024-01-15' },
    { id: 2, type: 'price', symbol: 'TSLA', name: 'Tesla Inc.', condition: 'below', value: 200, currentValue: 245.50, status: 'pending', created: '2024-01-14' },
  ]);

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.45, change: 2.34, direction: 'up' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.20, change: -3.45, direction: 'down' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 140.25, change: 1.23, direction: 'up' },
  ]);

  const [newAlert, setNewAlert] = useState({
    symbol: '',
    condition: 'above',
    value: ''
  });

  const [newWatchlistItem, setNewWatchlistItem] = useState('');

  const handleAddAlert = () => {
    if (!newAlert.symbol || !newAlert.value) return;
    
    const alert: Alert = {
      id: Date.now(),
      type: 'price',
      symbol: newAlert.symbol.toUpperCase(),
      name: `${newAlert.symbol.toUpperCase()} Inc.`,
      condition: newAlert.condition,
      value: parseFloat(newAlert.value),
      currentValue: Math.random() * 500 + 50,
      status: 'pending',
      created: new Date().toISOString().split('T')[0]
    };
    
    setAlerts(prev => [...prev, alert]);
    setNewAlert({ symbol: '', condition: 'above', value: '' });
  };

  const handleAddToWatchlist = () => {
    if (!newWatchlistItem.trim()) return;
    
    const item: WatchlistItem = {
      symbol: newWatchlistItem.toUpperCase(),
      name: `${newWatchlistItem.toUpperCase()} Inc.`,
      price: Math.random() * 500 + 50,
      change: (Math.random() - 0.5) * 10,
      direction: Math.random() > 0.5 ? 'up' : 'down'
    };
    
    setWatchlist(prev => [...prev, item]);
    setNewWatchlistItem('');
  };

  const handleRemoveAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleRemoveFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
  };

  return (
    <Card className={cn("border", darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200")}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="w-4 h-4 mr-2" />
          Alerts & Watchlists
        </CardTitle>
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
              {alerts.map((alert) => (
                <div key={alert.id} className={cn(
                  "p-3 rounded border flex justify-between items-center",
                  darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-200 bg-gray-50"
                )}>
                  <div>
                    <div className="font-medium">
                      {alert.symbol} {alert.condition} ${alert.value}
                    </div>
                    <div className="text-sm text-gray-600">
                      Current: ${alert.currentValue?.toFixed(2)} | Created: {alert.created}
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
              {watchlist.map((item) => (
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
