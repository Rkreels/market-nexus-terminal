
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircleDollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface TradingPanelProps {
  darkMode: boolean;
}

interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  type: 'market' | 'limit';
  status: 'pending' | 'filled' | 'cancelled';
  timestamp: Date;
}

const TradingPanel: React.FC<TradingPanelProps> = ({ darkMode }) => {
  const [orders, setOrders] = useState<Order[]>([
    { id: '1', symbol: 'AAPL', side: 'buy', quantity: 100, price: 178.45, type: 'limit', status: 'pending', timestamp: new Date() },
    { id: '2', symbol: 'MSFT', side: 'sell', quantity: 50, price: 415.20, type: 'market', status: 'filled', timestamp: new Date() },
  ]);
  
  const [orderForm, setOrderForm] = useState({
    symbol: '',
    side: 'buy' as 'buy' | 'sell',
    quantity: '',
    price: '',
    type: 'market' as 'market' | 'limit'
  });

  const handleSubmitOrder = () => {
    if (!orderForm.symbol || !orderForm.quantity) return;
    
    const newOrder: Order = {
      id: Date.now().toString(),
      symbol: orderForm.symbol.toUpperCase(),
      side: orderForm.side,
      quantity: parseInt(orderForm.quantity),
      price: orderForm.type === 'limit' ? parseFloat(orderForm.price) : 0,
      type: orderForm.type,
      status: 'pending',
      timestamp: new Date()
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setOrderForm({ symbol: '', side: 'buy', quantity: '', price: '', type: 'market' });
  };

  return (
    <Card className={cn("border", darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200")}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CircleDollarSign className="w-4 h-4 mr-2" />
          Trading
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="new-order" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new-order">New Order</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new-order" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Symbol</label>
                <Input
                  value={orderForm.symbol}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, symbol: e.target.value }))}
                  placeholder="AAPL"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Side</label>
                <Select value={orderForm.side} onValueChange={(value: 'buy' | 'sell') => setOrderForm(prev => ({ ...prev, side: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  value={orderForm.quantity}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="100"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Order Type</label>
                <Select value={orderForm.type} onValueChange={(value: 'market' | 'limit') => setOrderForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="limit">Limit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {orderForm.type === 'limit' && (
              <div>
                <label className="text-sm font-medium">Limit Price</label>
                <Input
                  type="number"
                  step="0.01"
                  value={orderForm.price}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>
            )}
            
            <Button 
              onClick={handleSubmitOrder}
              className={cn(
                "w-full",
                orderForm.side === 'buy' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              )}
            >
              {orderForm.side === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
            </Button>
          </TabsContent>
          
          <TabsContent value="orders">
            <div className="space-y-2">
              {orders.map((order) => (
                <div key={order.id} className={cn(
                  "p-3 rounded border",
                  darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-200 bg-gray-50"
                )}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {order.side === 'buy' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className="font-medium">{order.symbol}</span>
                      <span className={cn(
                        "px-2 py-1 rounded text-xs",
                        order.side === 'buy' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      )}>
                        {order.side.toUpperCase()}
                      </span>
                    </div>
                    <div className={cn(
                      "px-2 py-1 rounded text-xs",
                      order.status === 'filled' ? "bg-green-100 text-green-800" :
                      order.status === 'pending' ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    )}>
                      {order.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Qty: {order.quantity} | Type: {order.type} 
                    {order.type === 'limit' && ` | Price: $${order.price.toFixed(2)}`}
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

export default TradingPanel;
