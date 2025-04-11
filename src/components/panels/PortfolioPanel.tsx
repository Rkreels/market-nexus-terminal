import React, { FC } from "react";
import { 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  RefreshCw, 
  Download, 
  Upload
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

interface PortfolioPanelProps {
  darkMode: boolean;
}

// Mock portfolio data
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
            <Button variant="outline" size="sm" className="h-8">
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
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
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-1" /> Import
                </Button>
                <Button size="sm" variant="outline">
                  <PieChart className="h-4 w-4 mr-1" /> Rebalance
                </Button>
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
