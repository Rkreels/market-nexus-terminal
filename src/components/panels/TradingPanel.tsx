
import { FC, useState } from "react";
import { 
  CircleDollarSign, 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  BookOpen, 
  Clock, 
  DollarSign,
  BarChart4,
  CheckCircle,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface TradingPanelProps {
  darkMode: boolean;
}

// Mock stock data
const stockData = {
  symbol: "AAPL",
  name: "Apple Inc.",
  price: 215.45,
  change: 1.28,
  changePercent: 0.6,
  direction: "up",
  open: 213.76,
  high: 216.20,
  low: 213.25,
  volume: 41582367,
  peRatio: 33.76,
  marketCap: "3.38T",
  bid: 215.43,
  ask: 215.46,
  bidSize: 800,
  askSize: 1200
};

// Mock order history
const orderHistory = [
  {
    id: "ORD-95173",
    symbol: "AAPL",
    type: "buy",
    orderType: "market",
    quantity: 15,
    price: 215.45,
    status: "completed",
    time: "2025-03-15 10:32:15"
  },
  {
    id: "ORD-95172",
    symbol: "MSFT",
    type: "sell",
    orderType: "limit",
    quantity: 8,
    price: 432.50,
    status: "completed",
    time: "2025-03-15 09:47:32"
  },
  {
    id: "ORD-95168",
    symbol: "TSLA",
    type: "buy",
    orderType: "limit",
    quantity: 10,
    price: 275.00,
    status: "pending",
    time: "2025-03-14 15:23:05"
  },
  {
    id: "ORD-95165",
    symbol: "NVDA",
    type: "sell",
    orderType: "stop",
    quantity: 5,
    price: 850.00,
    status: "cancelled",
    time: "2025-03-14 11:15:42"
  }
];

const TradingPanel: FC<TradingPanelProps> = ({ darkMode }) => {
  const [orderTab, setOrderTab] = useState("market");
  const [tradeTab, setTradeTab] = useState("stocks");
  const [buyOrSell, setBuyOrSell] = useState("buy");
  
  // Static valid options - ensuring no empty strings
  const orderTypeOptions = [
    { value: "market", label: "Market" },
    { value: "limit", label: "Limit" },
    { value: "stop", label: "Stop" },
    { value: "stopLimit", label: "Stop Limit" }
  ].filter(option => option.value && option.value.trim() !== "");

  const timeInForceOptions = [
    { value: "day", label: "Day" },
    { value: "gtc", label: "Good Till Canceled" },
    { value: "ext", label: "Extended Hours" }
  ].filter(option => option.value && option.value.trim() !== "");
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left Column - Ticker and Order Entry */}
      <div className="lg:col-span-2 space-y-4">
        {/* Ticker Info */}
        <Card className={cn(
          "border", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <div className="flex items-center">
                <CircleDollarSign className="w-5 h-5 mr-2" />
                {stockData.symbol} - {stockData.name}
              </div>
              <Badge 
                className={cn(
                  stockData.direction === "up" ? "bg-green-600" : "bg-red-600"
                )}
              >
                {stockData.direction === "up" ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {stockData.direction === "up" ? "+" : ""}{stockData.change} ({stockData.changePercent}%)
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className={cn(
                "p-3 rounded-lg",
                darkMode ? "bg-zinc-700" : "bg-gray-50"
              )}>
                <div className="text-xs opacity-70">Last Price</div>
                <div className="text-lg font-semibold">${stockData.price}</div>
              </div>
              <div className={cn(
                "p-3 rounded-lg",
                darkMode ? "bg-zinc-700" : "bg-gray-50"
              )}>
                <div className="text-xs opacity-70">Bid x Ask</div>
                <div className="text-lg font-semibold">${stockData.bid} x ${stockData.ask}</div>
                <div className="text-xs opacity-70">{stockData.bidSize} x {stockData.askSize}</div>
              </div>
              <div className={cn(
                "p-3 rounded-lg",
                darkMode ? "bg-zinc-700" : "bg-gray-50"
              )}>
                <div className="text-xs opacity-70">Volume</div>
                <div className="text-lg font-semibold">{(stockData.volume / 1000000).toFixed(1)}M</div>
              </div>
              <div className={cn(
                "p-3 rounded-lg",
                darkMode ? "bg-zinc-700" : "bg-gray-50"
              )}>
                <div className="text-xs opacity-70">Range</div>
                <div className="text-lg font-semibold">${stockData.low} - ${stockData.high}</div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2">
                <Button size="sm">
                  <BarChart4 className="w-4 h-4 mr-2" /> Chart
                </Button>
                <Button size="sm" variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" /> Details
                </Button>
              </div>
              <div className="text-xs flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Market Open • Last Updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Entry */}
        <Card className={cn(
          "border", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <ArrowUpDown className="w-5 h-5 mr-2" />
              Place Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={tradeTab} onValueChange={setTradeTab} className="mb-4">
              <TabsList className={cn(
                darkMode ? "bg-zinc-700" : "bg-gray-100"
              )}>
                <TabsTrigger value="stocks">Stocks</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
                <TabsTrigger value="futures">Futures</TabsTrigger>
                <TabsTrigger value="crypto">Crypto</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Buy/Sell Selector */}
              <div className="w-full md:w-32">
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={buyOrSell === "buy" ? "default" : "outline"}
                    onClick={() => setBuyOrSell("buy")}
                    className={cn(
                      buyOrSell === "buy" && "bg-green-600 hover:bg-green-700"
                    )}
                  >
                    Buy
                  </Button>
                  <Button 
                    variant={buyOrSell === "sell" ? "default" : "outline"}
                    onClick={() => setBuyOrSell("sell")}
                    className={cn(
                      buyOrSell === "sell" && "bg-red-600 hover:bg-red-700"
                    )}
                  >
                    Sell
                  </Button>
                </div>
              </div>

              {/* Order Form */}
              <div className="flex-grow space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Symbol */}
                  <div>
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input 
                      id="symbol" 
                      value={stockData.symbol}
                      className={cn(
                        darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                      )}
                    />
                  </div>
                  
                  {/* Quantity */}
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      defaultValue="10"
                      className={cn(
                        darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                      )}
                    />
                  </div>
                  
                  {/* Order Type */}
                  <div>
                    <Label htmlFor="orderType">Order Type</Label>
                    <Select value={orderTab} onValueChange={setOrderTab}>
                      <SelectTrigger
                        className={cn(
                          darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                        )}
                      >
                        <SelectValue placeholder="Order Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {orderTypeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Order Type Specific Fields */}
                {orderTab === "market" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="marketPrice">Estimated Price</Label>
                      <Input 
                        id="marketPrice" 
                        value={`$${stockData.price}`}
                        disabled
                        className={cn(
                          "opacity-70",
                          darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-100 border-gray-300"
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimatedTotal">Estimated Total</Label>
                      <Input 
                        id="estimatedTotal" 
                        value={`$${(stockData.price * 10).toFixed(2)}`}
                        disabled
                        className={cn(
                          "opacity-70",
                          darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-100 border-gray-300"
                        )}
                      />
                    </div>
                  </div>
                )}

                {orderTab === "limit" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="limitPrice">Limit Price</Label>
                      <Input 
                        id="limitPrice" 
                        defaultValue={stockData.price}
                        className={cn(
                          darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="timeInForce">Time in Force</Label>
                      <Select defaultValue="day">
                        <SelectTrigger
                          className={cn(
                            darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                          )}
                        >
                          <SelectValue placeholder="Time in Force" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeInForceOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="estimatedTotal">Estimated Total</Label>
                      <Input 
                        id="estimatedTotal" 
                        value={`$${(stockData.price * 10).toFixed(2)}`}
                        disabled
                        className={cn(
                          "opacity-70",
                          darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-100 border-gray-300"
                        )}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <Button 
                    className={cn(
                      "w-full",
                      buyOrSell === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                    )}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    {buyOrSell === "buy" ? "Buy" : "Sell"} {stockData.symbol}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Account Summary and Order History */}
      <div className="space-y-4">
        {/* Account Summary */}
        <Card className={cn(
          "border", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <div className="flex items-center">
                <CircleDollarSign className="w-5 h-5 mr-2" />
                Account Summary
              </div>
              <Badge>Paper Trading</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className={cn(
                "p-3 rounded-lg",
                darkMode ? "bg-zinc-700" : "bg-gray-50"
              )}>
                <div className="text-xs opacity-70">Available Cash</div>
                <div className="text-lg font-semibold">$125,432.67</div>
              </div>
              <div className={cn(
                "p-3 rounded-lg",
                darkMode ? "bg-zinc-700" : "bg-gray-50"
              )}>
                <div className="text-xs opacity-70">Account Value</div>
                <div className="flex items-center">
                  <div className="text-lg font-semibold mr-2">$847,392.58</div>
                  <div className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">
                    +1.47% today
                  </div>
                </div>
              </div>
              <div className={cn(
                "p-3 rounded-lg",
                darkMode ? "bg-zinc-700" : "bg-gray-50"
              )}>
                <div className="text-xs opacity-70">Buying Power</div>
                <div className="text-lg font-semibold">$250,865.34</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card className={cn(
          "border", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orderHistory.map((order) => (
                <div 
                  key={order.id}
                  className={cn(
                    "p-3 rounded-lg border",
                    darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium flex items-center">
                        {order.symbol}
                        <Badge 
                          className={cn(
                            "ml-2",
                            order.type === "buy" ? "bg-green-600" : "bg-red-600"
                          )}
                        >
                          {order.type.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm mt-1">
                        {order.quantity} shares @ ${order.price}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge 
                        variant="outline"
                        className={cn(
                          order.status === "completed" ? "border-green-500 text-green-500" : 
                          order.status === "pending" ? "border-yellow-500 text-yellow-500" :
                          "border-red-500 text-red-500"
                        )}
                      >
                        {order.status === "completed" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : order.status === "pending" ? (
                          <Clock className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <div className="text-xs mt-1 opacity-70">
                        {order.id}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="text-xs opacity-70">
                      {order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)} order
                    </div>
                    <div className="text-xs opacity-70">
                      {order.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-3" size="sm">
              View All Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradingPanel;
