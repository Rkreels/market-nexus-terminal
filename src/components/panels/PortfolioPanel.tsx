
import React, { FC, useState } from "react";
import { 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  RefreshCw, 
  Download, 
  Upload,
  FileDown,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface PortfolioPanelProps {
  darkMode: boolean;
}

// Mock portfolio summary data
const portfolioSummary = {
  totalValue: 847392.58,
  dailyChange: 12481.32,
  dailyPercentChange: 1.47,
  direction: "up",
  ytdReturn: 15.32
};

// Mock asset allocation data
const assetAllocation = [
  { name: "Stocks", value: 65, color: "#3b82f6" },
  { name: "Bonds", value: 15, color: "#22c55e" },
  { name: "Cash", value: 10, color: "#eab308" },
  { name: "Alternatives", value: 10, color: "#ec4899" }
];

// Mock holdings data
const topHoldings = [
  { symbol: "AAPL", name: "Apple Inc.", value: 158392.47, weight: 18.69, change: 2.31, direction: "up" },
  { symbol: "MSFT", name: "Microsoft Corp.", value: 142581.23, weight: 16.82, change: 1.87, direction: "up" },
  { symbol: "GOOGL", name: "Alphabet Inc.", value: 98342.87, weight: 11.61, change: -0.54, direction: "down" },
  { symbol: "AMZN", name: "Amazon.com Inc.", value: 86753.45, weight: 10.24, change: 1.12, direction: "up" },
  { symbol: "TSLA", name: "Tesla Inc.", value: 67892.35, weight: 8.01, change: -1.98, direction: "down" },
  { symbol: "NVDA", name: "NVIDIA Corp.", value: 59283.74, weight: 7.00, change: 3.45, direction: "up" }
];

const PortfolioPanel: FC<PortfolioPanelProps> = ({ darkMode }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isRebalanceDialogOpen, setIsRebalanceDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Portfolio Refreshed",
        description: "All portfolio data has been updated",
        duration: 2000,
      });
    }, 1000);
  };

  const handleExport = (format: string) => {
    toast({
      title: "Portfolio Exported",
      description: `Portfolio data exported as ${format}`,
      duration: 2000,
    });
    setIsExportDialogOpen(false);
  };

  const handleImport = () => {
    toast({
      title: "Portfolio Imported",
      description: "External portfolio data has been imported successfully",
      duration: 2000,
    });
    setIsImportDialogOpen(false);
  };

  const handleRebalance = () => {
    toast({
      title: "Portfolio Rebalanced",
      description: "Portfolio has been rebalanced to target allocations",
      duration: 2000,
    });
    setIsRebalanceDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Portfolio Summary Card */}
      <Card className={cn(
        "border", 
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Portfolio Summary
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              disabled={isRefreshing}
              onClick={handleRefresh}
            >
              <RefreshCw className={cn("h-4 w-4 mr-1", isRefreshing && "animate-spin")} /> 
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
            
            <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Download className="h-4 w-4 mr-1" /> Export
                </Button>
              </DialogTrigger>
              <DialogContent className={cn(
                darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white"
              )}>
                <DialogHeader>
                  <DialogTitle>Export Portfolio</DialogTitle>
                  <DialogDescription>
                    Select the format and content to export
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="mb-4">
                    <Label className="mb-2 block">Export Format</Label>
                    <RadioGroup defaultValue="csv" className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="csv" id="csv" />
                        <Label htmlFor="csv">CSV</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pdf" id="pdf" />
                        <Label htmlFor="pdf">PDF</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excel" id="excel" />
                        <Label htmlFor="excel">Excel</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="mb-4">
                    <Label className="mb-2 block">Content to Include</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="holdings" defaultChecked />
                        <label htmlFor="holdings" className="text-sm">Holdings & Positions</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="performance" defaultChecked />
                        <label htmlFor="performance" className="text-sm">Performance History</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="transactions" defaultChecked />
                        <label htmlFor="transactions" className="text-sm">Recent Transactions</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="analytics" />
                        <label htmlFor="analytics" className="text-sm">Analytics & Metrics</label>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <div className="flex gap-2">
                    <Button onClick={() => handleExport("PDF")}>
                      <FileDown className="w-4 h-4 mr-2" /> Export
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Share Link Generated",
                          description: "Portfolio share link has been copied to clipboard",
                          duration: 2000,
                        });
                        setIsExportDialogOpen(false);
                      }}
                    >
                      <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={cn("p-4 rounded-lg", darkMode ? "bg-zinc-700" : "bg-gray-50")}>
              <div className="text-sm opacity-70 mb-1">Total Value</div>
              <div className="text-2xl font-bold">${portfolioSummary.totalValue.toLocaleString()}</div>
            </div>
            <div className={cn("p-4 rounded-lg", darkMode ? "bg-zinc-700" : "bg-gray-50")}>
              <div className="text-sm opacity-70 mb-1">Daily Change</div>
              <div className="flex items-center">
                <div className="text-2xl font-bold mr-2">
                  {portfolioSummary.direction === "up" ? "+" : "-"}
                  ${Math.abs(portfolioSummary.dailyChange).toLocaleString()}
                </div>
                <div className={cn("flex items-center text-sm", 
                  portfolioSummary.direction === "up" ? "text-green-500" : "text-red-500"
                )}>
                  {portfolioSummary.direction === "up" ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {portfolioSummary.dailyPercentChange.toFixed(2)}%
                </div>
              </div>
            </div>
            <div className={cn("p-4 rounded-lg", darkMode ? "bg-zinc-700" : "bg-gray-50")}>
              <div className="text-sm opacity-70 mb-1">YTD Return</div>
              <div className="flex items-center">
                <div className="text-2xl font-bold mr-2">
                  {portfolioSummary.ytdReturn > 0 ? "+" : ""}
                  {portfolioSummary.ytdReturn.toFixed(2)}%
                </div>
              </div>
            </div>
            <div className={cn("p-4 rounded-lg", darkMode ? "bg-zinc-700" : "bg-gray-50")}>
              <div className="text-sm opacity-70 mb-1">Actions</div>
              <div className="flex gap-2">
                <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Upload className="h-4 w-4 mr-1" /> Import
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={cn(
                    darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white"
                  )}>
                    <DialogHeader>
                      <DialogTitle>Import Portfolio Data</DialogTitle>
                      <DialogDescription>
                        Import external portfolio data or transactions
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="mb-4">
                        <Label className="mb-2 block">Import Type</Label>
                        <RadioGroup defaultValue="holdings" className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="holdings" id="import-holdings" />
                            <Label htmlFor="import-holdings">Holdings & Positions</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="transactions" id="import-transactions" />
                            <Label htmlFor="import-transactions">Transaction History</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="watchlist" id="import-watchlist" />
                            <Label htmlFor="import-watchlist">Watchlist</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="mb-4">
                        <Label className="mb-2 block">File Format</Label>
                        <RadioGroup defaultValue="csv" className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="csv" id="import-csv" />
                            <Label htmlFor="import-csv">CSV</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="excel" id="import-excel" />
                            <Label htmlFor="import-excel">Excel</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="api" id="import-api" />
                            <Label htmlFor="import-api">External API</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className={cn(
                        "p-8 border-2 border-dashed rounded-lg text-center cursor-pointer",
                        darkMode ? "border-zinc-600 hover:border-zinc-500" : "border-gray-300 hover:border-gray-400"
                      )}>
                        <Upload className="w-8 h-8 mx-auto mb-2 opacity-60" />
                        <p className="text-sm mb-1">Drag & drop file here or click to browse</p>
                        <p className="text-xs opacity-60">Supports CSV, XLS, XLSX files up to 10MB</p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleImport}>
                        Import Data
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={isRebalanceDialogOpen} onOpenChange={setIsRebalanceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <PieChart className="h-4 w-4 mr-1" /> Rebalance
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={cn(
                    darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white"
                  )}>
                    <DialogHeader>
                      <DialogTitle>Rebalance Portfolio</DialogTitle>
                      <DialogDescription>
                        Adjust your portfolio to match target allocations
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="mb-4">
                        <h3 className="font-medium mb-2">Current vs Target Allocation</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Stocks</span>
                              <span className="text-sm">65% → 60%</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 w-[65%] relative">
                                <div className="absolute top-0 bottom-0 right-0 border-r-2 border-dashed border-black h-full" style={{ right: '5%' }}></div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Bonds</span>
                              <span className="text-sm">15% → 20%</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 w-[15%] relative">
                                <div className="absolute top-0 bottom-0 right-0 border-r-2 border-dashed border-black h-full" style={{ right: '-5%' }}></div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Cash</span>
                              <span className="text-sm">10% → 10%</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded-full">
                              <div className="h-full bg-yellow-500 w-[10%]"></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Alternatives</span>
                              <span className="text-sm">10% → 10%</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded-full">
                              <div className="h-full bg-pink-500 w-[10%]"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="font-medium mb-2">Rebalance Method</h3>
                        <RadioGroup defaultValue="auto" className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="auto" id="auto" />
                            <Label htmlFor="auto">Automatic (System Recommended)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="manual" id="manual" />
                            <Label htmlFor="manual">Manual Adjustment</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="tax" id="tax" />
                            <Label htmlFor="tax">Tax-Optimized</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className={cn(
                        "p-3 rounded-lg border",
                        darkMode ? "border-amber-800 bg-amber-950/20" : "border-amber-200 bg-amber-50"
                      )}>
                        <p className="text-sm text-amber-600 dark:text-amber-400">
                          Rebalancing may trigger tax events. Consider consulting with your financial advisor.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsRebalanceDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleRebalance}>
                        Rebalance Portfolio
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Allocation and Holdings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Asset Allocation */}
        <Card className={cn(
          "border h-[400px]", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[330px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center" 
                  wrapperStyle={{ 
                    paddingTop: '20px',
                    color: darkMode ? '#fff' : '#000'
                  }}
                />
                <RechartsTooltip
                  formatter={(value: number) => [`${value}%`, 'Allocation']}
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#333' : '#fff',
                    borderColor: darkMode ? '#555' : '#ccc',
                    color: darkMode ? '#fff' : '#333' 
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Holdings */}
        <Card className={cn(
          "border lg:col-span-2 h-[400px] overflow-auto", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Top Holdings
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
                    <th className="text-right py-3 px-4">Value</th>
                    <th className="text-right py-3 px-4">Weight</th>
                    <th className="text-right py-3 px-4">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {topHoldings.map((holding) => (
                    <tr 
                      key={holding.symbol} 
                      className={cn(
                        "border-b hover:bg-opacity-50",
                        darkMode 
                          ? "border-zinc-700 hover:bg-zinc-700" 
                          : "border-gray-200 hover:bg-gray-100"
                      )}
                    >
                      <td className="py-3 px-4 font-medium">{holding.symbol}</td>
                      <td className="py-3 px-4">{holding.name}</td>
                      <td className="py-3 px-4 text-right">${holding.value.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{holding.weight.toFixed(2)}%</td>
                      <td className={cn(
                        "py-3 px-4 text-right flex items-center justify-end",
                        holding.direction === "up" ? "text-green-500" : "text-red-500"
                      )}>
                        {holding.direction === "up" ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {holding.change.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioPanel;
