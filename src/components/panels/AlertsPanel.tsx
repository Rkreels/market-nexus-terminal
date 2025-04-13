
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
  Settings,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NewAlertForm from "@/components/alerts/NewAlertForm";
import AddSymbolForm from "@/components/alerts/AddSymbolForm";
import { useAlertsData } from "@/hooks/useAlertsData";
import { useTimeframeSelection } from "@/hooks/useTimeframeSelection";
import TimeframeSelector from "@/components/TimeframeSelector";

interface AlertsPanelProps {
  darkMode: boolean;
}

const AlertsPanel: FC<AlertsPanelProps> = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState("alerts");
  const [showNewAlertForm, setShowNewAlertForm] = useState(false);
  const [showAddSymbolForm, setShowAddSymbolForm] = useState(false);
  const [activeWatchlistId, setActiveWatchlistId] = useState<number | null>(null);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [showNewWatchlistInput, setShowNewWatchlistInput] = useState(false);
  const { timeframe, handleTimeframeChange } = useTimeframeSelection('1W');
  
  const {
    alerts,
    watchlists,
    addAlert,
    deleteAlert,
    toggleAlertStatus,
    addWatchlist,
    addSymbolToWatchlist,
    removeSymbolFromWatchlist,
    activeFilters,
    toggleFilter,
    searchQuery,
    setSearchQuery
  } = useAlertsData();

  const handleCreateAlert = (alertData: any) => {
    addAlert(alertData);
    setShowNewAlertForm(false);
  };

  const handleAddSymbol = (symbolData: any) => {
    if (activeWatchlistId !== null) {
      addSymbolToWatchlist(activeWatchlistId, symbolData);
      setShowAddSymbolForm(false);
      setActiveWatchlistId(null);
    }
  };

  const handleCreateWatchlist = () => {
    if (newWatchlistName.trim()) {
      addWatchlist(newWatchlistName.trim());
      setNewWatchlistName("");
      setShowNewWatchlistInput(false);
    }
  };

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
          <Button size="sm" variant="outline" onClick={() => toggleFilter("All")}>
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          {activeTab === "alerts" ? (
            <Button size="sm" onClick={() => setShowNewAlertForm(true)}>
              <PlusCircle className="w-4 h-4 mr-2" /> New Alert
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <PlusCircle className="w-4 h-4 mr-2" /> New Watchlist
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="p-2">
                  {showNewWatchlistInput ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={newWatchlistName}
                        onChange={(e) => setNewWatchlistName(e.target.value)}
                        placeholder="Watchlist name"
                        className="w-40"
                      />
                      <Button size="sm" onClick={handleCreateWatchlist}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <DropdownMenuItem onSelect={() => setShowNewWatchlistInput(true)}>
                      Create New Watchlist
                    </DropdownMenuItem>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {showNewAlertForm && (
        <NewAlertForm 
          onAddAlert={handleCreateAlert} 
          onCancel={() => setShowNewAlertForm(false)}
          darkMode={darkMode}
        />
      )}

      {showAddSymbolForm && activeWatchlistId !== null && (
        <AddSymbolForm 
          onAddSymbol={handleAddSymbol} 
          onCancel={() => {
            setShowAddSymbolForm(false);
            setActiveWatchlistId(null);
          }}
          darkMode={darkMode}
        />
      )}

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
              placeholder="Search alerts by symbol or name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex gap-2 mt-3 flex-wrap">
              <Badge 
                variant={activeFilters.includes("All") ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => toggleFilter("All")}
              >
                All
              </Badge>
              <Badge 
                variant={activeFilters.includes("price") ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => toggleFilter("price")}
              >
                Price
              </Badge>
              <Badge 
                variant={activeFilters.includes("volume") ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => toggleFilter("volume")}
              >
                Volume
              </Badge>
              <Badge 
                variant={activeFilters.includes("earnings") ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => toggleFilter("earnings")}
              >
                Earnings
              </Badge>
              <Badge 
                variant={activeFilters.includes("news") ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => toggleFilter("news")}
              >
                News
              </Badge>
              <Badge 
                variant={activeFilters.includes("Pending") ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => toggleFilter("Pending")}
              >
                Pending
              </Badge>
              <Badge 
                variant={activeFilters.includes("Triggered") ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => toggleFilter("Triggered")}
              >
                Triggered
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Time Period Selector */}
        <TimeframeSelector
          darkMode={darkMode}
          activeTimeframe={timeframe}
          onTimeframeChange={handleTimeframeChange}
          className="mb-4"
        />

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
              {alerts.length === 0 ? (
                <div className={cn(
                  "p-8 text-center",
                  darkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>No alerts found matching your criteria.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setShowNewAlertForm(true)}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" /> Create New Alert
                  </Button>
                </div>
              ) : (
                alerts.map((alert) => (
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className={cn(
                            darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white"
                          )}>
                            <DialogHeader>
                              <DialogTitle>Alert Settings</DialogTitle>
                              <DialogDescription>
                                Configure notification settings for this alert.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Email Notifications</Label>
                                <div className="flex items-center">
                                  <input type="checkbox" className="mr-2" defaultChecked />
                                  <span>Enabled</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 items-center gap-4">
                                <Label>SMS Notifications</Label>
                                <div className="flex items-center">
                                  <input type="checkbox" className="mr-2" />
                                  <span>Disabled</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 items-center gap-4">
                                <Label>Push Notifications</Label>
                                <div className="flex items-center">
                                  <input type="checkbox" className="mr-2" defaultChecked />
                                  <span>Enabled</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button>Save Settings</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8"
                          onClick={() => toggleAlertStatus(alert.id)}
                        >
                          {alert.status === "pending" ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8"
                          onClick={() => deleteAlert(alert.id)}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm">
                      {alert.type === "price" && (
                        <div className="flex items-center">
                          <div className="mr-2">Price {alert.condition}</div>
                          <div className="font-medium">${alert.value?.toLocaleString()}</div>
                          <div className="mx-2">Current: ${alert.currentValue?.toLocaleString()}</div>
                        </div>
                      )}
                      {alert.type === "volume" && (
                        <div className="flex items-center">
                          <div className="mr-2">Volume {alert.condition}</div>
                          <div className="font-medium">{alert.value?.toLocaleString()}</div>
                          <div className="mx-2">Current: {alert.currentValue?.toLocaleString()}</div>
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
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="watchlists" className="space-y-4">
        {/* Watchlists */}
        {watchlists.length === 0 ? (
          <Card className={cn(
            "border", 
            darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
          )}>
            <CardContent className="p-8 text-center">
              <PlusCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className={cn(
                darkMode ? "text-gray-400" : "text-gray-500"
              )}>
                No watchlists created yet.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setShowNewWatchlistInput(true)}
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Create Watchlist
              </Button>
            </CardContent>
          </Card>
        ) : (
          watchlists.map((watchlist) => (
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
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setActiveWatchlistId(watchlist.id);
                        setShowAddSymbolForm(true);
                      }}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" /> Add Symbol
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => deleteWatchlist(watchlist.id)}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className={cn(
                      darkMode ? "border-zinc-700" : "border-gray-200"
                    )}>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Daily Change</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {watchlist.symbols.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            <p className={cn(
                              "text-sm",
                              darkMode ? "text-gray-400" : "text-gray-500"
                            )}>
                              No symbols added to this watchlist yet.
                            </p>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="mt-2"
                              onClick={() => {
                                setActiveWatchlistId(watchlist.id);
                                setShowAddSymbolForm(true);
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Symbol
                            </Button>
                          </TableCell>
                        </TableRow>
                      ) : (
                        watchlist.symbols.map((symbol) => (
                          <TableRow 
                            key={symbol.symbol} 
                            className={cn(
                              "border-b",
                              darkMode 
                                ? "border-zinc-700 hover:bg-zinc-700" 
                                : "border-gray-200 hover:bg-gray-100"
                            )}
                          >
                            <TableCell className="font-medium">{symbol.symbol}</TableCell>
                            <TableCell>{symbol.name}</TableCell>
                            <TableCell className="text-right">${symbol.price.toFixed(2)}</TableCell>
                            <TableCell className={cn(
                              "text-right flex items-center justify-end",
                              symbol.direction === "up" ? "text-green-500" : "text-red-500"
                            )}>
                              {symbol.direction === "up" ? (
                                <ArrowUpRight className="w-3 h-3 mr-1" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3 mr-1" />
                              )}
                              {Math.abs(symbol.change).toFixed(2)}%
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  // Create a new price alert for this symbol
                                  addAlert({
                                    type: "price",
                                    symbol: symbol.symbol,
                                    name: symbol.name,
                                    condition: "above",
                                    value: Math.round(symbol.price * 1.05 * 100) / 100, // 5% above current price
                                    currentValue: symbol.price
                                  });
                                  
                                  // Switch to alerts tab
                                  setActiveTab("alerts");
                                }}
                              >
                                <AlertTriangle className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => removeSymbolFromWatchlist(watchlist.id, symbol.symbol)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>
    </Tabs>
  );
};

export default AlertsPanel;
