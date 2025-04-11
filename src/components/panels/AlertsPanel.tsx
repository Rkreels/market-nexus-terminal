
import { FC, useState } from "react";
import { 
  Bell, 
  PlusCircle, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Filter, 
  ArrowUpRight,
  ArrowDownRight,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AlertsPanelProps {
  darkMode: boolean;
}

// Mock alerts
const alerts = [
  {
    id: 1,
    type: "price",
    symbol: "AAPL",
    name: "Apple Inc.",
    condition: "above",
    value: 220,
    currentValue: 215.45,
    status: "pending",
    created: "2025-03-15"
  },
  {
    id: 2,
    type: "price",
    symbol: "MSFT",
    name: "Microsoft Corp.",
    condition: "below",
    value: 400,
    currentValue: 429.90,
    status: "triggered",
    triggered: "2025-03-14"
  },
  {
    id: 3,
    type: "volume",
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    condition: "above",
    value: 50000000,
    currentValue: 32541892,
    status: "pending",
    created: "2025-03-14"
  },
  {
    id: 4,
    type: "earnings",
    symbol: "TSLA",
    name: "Tesla Inc.",
    details: "Earnings announcement on 2025-04-22",
    status: "pending",
    created: "2025-03-12"
  },
  {
    id: 5,
    type: "news",
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    keyword: "acquisition",
    status: "triggered",
    triggered: "2025-03-10",
    details: "News about potential acquisition detected"
  }
];

// Mock watchlists
const watchlists = [
  {
    id: 1,
    name: "Tech Giants",
    symbols: [
      { symbol: "AAPL", name: "Apple Inc.", price: 215.45, change: 1.28, direction: "up" },
      { symbol: "MSFT", name: "Microsoft Corp.", price: 429.90, change: -0.75, direction: "down" },
      { symbol: "GOOGL", name: "Alphabet Inc.", price: 192.86, change: 0.54, direction: "up" },
      { symbol: "AMZN", name: "Amazon.com Inc.", price: 196.75, change: 2.12, direction: "up" },
      { symbol: "META", name: "Meta Platforms Inc.", price: 485.72, change: -1.32, direction: "down" }
    ]
  },
  {
    id: 2,
    name: "Semiconductors",
    symbols: [
      { symbol: "NVDA", name: "NVIDIA Corp.", price: 875.22, change: 3.89, direction: "up" },
      { symbol: "AMD", name: "Advanced Micro Devices", price: 178.57, change: 2.34, direction: "up" },
      { symbol: "INTC", name: "Intel Corp.", price: 45.32, change: -1.24, direction: "down" },
      { symbol: "TSM", name: "Taiwan Semiconductor", price: 142.18, change: 1.52, direction: "up" },
      { symbol: "MU", name: "Micron Technology", price: 98.43, change: 0.87, direction: "up" }
    ]
  }
];

const AlertsPanel: FC<AlertsPanelProps> = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState("alerts");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <div className="flex justify-between items-center">
        <TabsList className={cn(
          darkMode ? "bg-zinc-700" : "bg-gray-100"
        )}>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="watchlists">Watchlists</TabsTrigger>
        </TabsList>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button size="sm">
            <PlusCircle className="w-4 h-4 mr-2" /> 
            {activeTab === "alerts" ? "New Alert" : "New Watchlist"}
          </Button>
        </div>
      </div>

      <TabsContent value="alerts" className="space-y-4">
        {/* Search and Filter */}
        <Card className={cn(
          "border", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardContent className="pt-4">
            <Input 
              className={cn(
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
              )}
              placeholder="Search alerts..." 
            />
            <div className="flex gap-2 mt-3 flex-wrap">
              <Badge variant="outline" className="cursor-pointer">All</Badge>
              <Badge variant="outline" className="cursor-pointer">Price</Badge>
              <Badge variant="outline" className="cursor-pointer">Volume</Badge>
              <Badge variant="outline" className="cursor-pointer">Earnings</Badge>
              <Badge variant="outline" className="cursor-pointer">News</Badge>
              <Badge variant="outline" className="cursor-pointer">Technical</Badge>
              <Badge variant="outline" className="cursor-pointer">Pending</Badge>
              <Badge variant="outline" className="cursor-pointer">Triggered</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <Card className={cn(
          "border", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              My Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={cn(
                    "p-3 rounded-lg border",
                    darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
                  )}
                >
                  <div className="flex justify-between">
                    <div className="font-medium flex items-center">
                      {alert.symbol} - {alert.name}
                      <Badge 
                        className="ml-2" 
                        variant={alert.status === "triggered" ? "destructive" : "default"}
                      >
                        {alert.status === "triggered" ? "Triggered" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        {alert.status === "pending" ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm">
                    {alert.type === "price" && (
                      <div className="flex items-center">
                        <div className="mr-2">Price {alert.condition}</div>
                        <div className="font-medium">${alert.value.toLocaleString()}</div>
                        <div className="mx-2">Current: ${alert.currentValue.toLocaleString()}</div>
                      </div>
                    )}
                    {alert.type === "volume" && (
                      <div className="flex items-center">
                        <div className="mr-2">Volume {alert.condition}</div>
                        <div className="font-medium">{alert.value.toLocaleString()}</div>
                        <div className="mx-2">Current: {alert.currentValue.toLocaleString()}</div>
                      </div>
                    )}
                    {alert.type === "earnings" && (
                      <div>{alert.details}</div>
                    )}
                    {alert.type === "news" && (
                      <div>News alert for keyword "{alert.keyword}" {alert.status === "triggered" && `- ${alert.details}`}</div>
                    )}
                  </div>
                  
                  <div className="mt-1 text-xs opacity-70">
                    {alert.status === "pending" 
                      ? `Created: ${alert.created}` 
                      : `Triggered: ${alert.triggered}`}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="watchlists" className="space-y-4">
        {/* Watchlists */}
        {watchlists.map((watchlist) => (
          <Card 
            key={watchlist.id}
            className={cn(
              "border", 
              darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
            )}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  {watchlist.name}
                </div>
                <Button size="sm" variant="outline">
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Symbol
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={cn(
                      "border-b",
                      darkMode ? "border-zinc-700" : "border-gray-200"
                    )}>
                      <th className="text-left py-3 px-4">Symbol</th>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-right py-3 px-4">Price</th>
                      <th className="text-right py-3 px-4">Daily Change</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {watchlist.symbols.map((symbol) => (
                      <tr 
                        key={symbol.symbol} 
                        className={cn(
                          "border-b hover:bg-opacity-50",
                          darkMode 
                            ? "border-zinc-700 hover:bg-zinc-700" 
                            : "border-gray-200 hover:bg-gray-100"
                        )}
                      >
                        <td className="py-3 px-4 font-medium">{symbol.symbol}</td>
                        <td className="py-3 px-4">{symbol.name}</td>
                        <td className="py-3 px-4 text-right">${symbol.price.toFixed(2)}</td>
                        <td className={cn(
                          "py-3 px-4 text-right flex items-center justify-end",
                          symbol.direction === "up" ? "text-green-500" : "text-red-500"
                        )}>
                          {symbol.direction === "up" ? (
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 mr-1" />
                          )}
                          {symbol.change.toFixed(2)}%
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default AlertsPanel;
