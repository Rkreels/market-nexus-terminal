
import { FC } from "react";
import { 
  BarChart3, 
  PieChart, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  Globe,
  Building,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  Legend
} from "recharts";

interface RiskAnalyticsPanelProps {
  darkMode: boolean;
}

// Mock risk metrics
const riskMetrics = {
  portfolioVar: 2.35,  // Value at Risk (%)
  sharpeRatio: 1.82,
  sortinoRatio: 2.14,
  beta: 0.92,
  alpha: 1.47,
  volatility: 12.38,
  maxDrawdown: 18.45,
  rSquared: 0.83,
  treynorRatio: 0.14
};

// Mock exposure data
const sectorExposure = [
  { name: "Technology", value: 42, color: "#3b82f6" },
  { name: "Healthcare", value: 18, color: "#22c55e" },
  { name: "Financials", value: 15, color: "#eab308" },
  { name: "Consumer Cyclical", value: 12, color: "#ec4899" },
  { name: "Communication", value: 8, color: "#8b5cf6" },
  { name: "Other", value: 5, color: "#6b7280" }
];

// Mock geographic exposure
const geographicExposure = [
  { name: "United States", value: 65 },
  { name: "Europe", value: 15 },
  { name: "China", value: 10 },
  { name: "Japan", value: 5 },
  { name: "Other", value: 5 }
];

// Mock stress test scenarios
const stressTestScenarios = [
  { name: "Market -10%", impact: -8.7 },
  { name: "Tech Selloff", impact: -12.4 },
  { name: "Rate Hike +1%", impact: -5.2 },
  { name: "Rate Cut -0.5%", impact: 4.8 },
  { name: "Recession", impact: -15.3 },
  { name: "Inflation +2%", impact: -6.9 },
  { name: "Dollar +10%", impact: -3.1 },
  { name: "Tech +20%", impact: 14.2 }
];

const RiskAnalyticsPanel: FC<RiskAnalyticsPanelProps> = ({ darkMode }) => {
  return (
    <div className="space-y-4">
      {/* Risk Dashboard Header */}
      <Card className={cn(
        "border", 
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Portfolio Risk Assessment
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">Run Scenario</Button>
            <Button size="sm">Export Analysis</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <div className={cn(
              "p-3 rounded-lg",
              darkMode ? "bg-zinc-700" : "bg-gray-50"
            )}>
              <div className="text-xs opacity-70 mb-1">Value at Risk (95%)</div>
              <div className="text-xl font-semibold">{riskMetrics.portfolioVar}%</div>
              <div className="text-xs mt-1">Daily</div>
            </div>
            <div className={cn(
              "p-3 rounded-lg",
              darkMode ? "bg-zinc-700" : "bg-gray-50"
            )}>
              <div className="text-xs opacity-70 mb-1">Sharpe Ratio</div>
              <div className="text-xl font-semibold">{riskMetrics.sharpeRatio}</div>
              <div className="text-xs mt-1 text-green-500">Above Average</div>
            </div>
            <div className={cn(
              "p-3 rounded-lg",
              darkMode ? "bg-zinc-700" : "bg-gray-50"
            )}>
              <div className="text-xs opacity-70 mb-1">Beta</div>
              <div className="text-xl font-semibold">{riskMetrics.beta}</div>
              <div className="text-xs mt-1">vs S&P 500</div>
            </div>
            <div className={cn(
              "p-3 rounded-lg",
              darkMode ? "bg-zinc-700" : "bg-gray-50"
            )}>
              <div className="text-xs opacity-70 mb-1">Volatility</div>
              <div className="text-xl font-semibold">{riskMetrics.volatility}%</div>
              <div className="text-xs mt-1">Annualized</div>
            </div>
            <div className={cn(
              "p-3 rounded-lg",
              darkMode ? "bg-zinc-700" : "bg-gray-50"
            )}>
              <div className="text-xs opacity-70 mb-1">Max Drawdown</div>
              <div className="text-xl font-semibold">{riskMetrics.maxDrawdown}%</div>
              <div className="text-xs mt-1">Historical</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Section - Exposures */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Sector Exposure */}
        <Card className={cn(
          "border h-[360px]", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <div className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Sector Exposure
              </div>
              <Button size="sm" variant="outline" className="h-8">Details</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={sectorExposure}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sectorExposure.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ fontSize: '12px', color: darkMode ? '#fff' : '#000' }}
                />
                <RechartsTooltip
                  formatter={(value: number) => [`${value}%`, 'Exposure']}
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

        {/* Geographic Exposure */}
        <Card className={cn(
          "border h-[360px]", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Geographic Exposure
              </div>
              <Button size="sm" variant="outline" className="h-8">Details</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={geographicExposure}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 100]} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fill: darkMode ? '#ccc' : '#666' }}
                />
                <RechartsTooltip
                  formatter={(value: number) => [`${value}%`, 'Exposure']}
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#333' : '#fff',
                    borderColor: darkMode ? '#555' : '#ccc',
                    color: darkMode ? '#fff' : '#333' 
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6" 
                  radius={[0, 4, 4, 0]}
                  label={{ 
                    position: 'right',
                    fill: darkMode ? '#fff' : '#000',
                    formatter: (value: number) => `${value}%`
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Concentration Risk */}
        <Card className={cn(
          "border h-[360px]", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Concentration Risk
              </div>
              <Badge 
                variant={riskMetrics.sharpeRatio > 1.5 ? "default" : "destructive"}
                className={cn(
                  riskMetrics.sharpeRatio > 1.5 ? "bg-yellow-600" : ""
                )}
              >
                Medium
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className={cn(
                "p-3 rounded-lg border",
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
              )}>
                <div className="flex justify-between">
                  <div className="font-medium">Top 5 Holdings</div>
                  <div className="text-amber-500">42.3% of Portfolio</div>
                </div>
                <div className="text-sm mt-1">
                  High concentration in major tech stocks may increase volatility during sector rotations.
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  View Holdings <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
              
              <div className={cn(
                "p-3 rounded-lg border",
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
              )}>
                <div className="flex justify-between">
                  <div className="font-medium">Technology Sector</div>
                  <div className="text-amber-500">42.0% of Portfolio</div>
                </div>
                <div className="text-sm mt-1">
                  Technology exposure exceeds benchmark by 18.5%. Consider diversification.
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  Optimize <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
              
              <div className={cn(
                "p-3 rounded-lg border",
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
              )}>
                <div className="flex justify-between">
                  <div className="font-medium">US Market</div>
                  <div className="text-amber-500">65.0% of Portfolio</div>
                </div>
                <div className="text-sm mt-1">
                  US market exposure within acceptable range for a global portfolio.
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  View Allocation <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stress Testing */}
      <Card className={cn(
        "border", 
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Layers className="w-5 h-5 mr-2" />
            Stress Testing Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stressTestScenarios}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis 
                  dataKey="name"
                  tick={{ fill: darkMode ? '#ccc' : '#666' }}
                />
                <YAxis
                  label={{ 
                    value: 'Portfolio Impact (%)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: darkMode ? '#ccc' : '#666' }
                  }}
                  tick={{ fill: darkMode ? '#ccc' : '#666' }}
                />
                <RechartsTooltip
                  formatter={(value: number) => [`${value}%`, 'Impact']}
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#333' : '#fff',
                    borderColor: darkMode ? '#555' : '#ccc',
                    color: darkMode ? '#fff' : '#333' 
                  }}
                />
                <Bar dataKey="impact">
                  {stressTestScenarios.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.impact > 0 ? '#22c55e' : '#ef4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className={cn(
              "p-3 rounded-lg border",
              darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
            )}>
              <div className="font-medium mb-1">Worst Case Impact</div>
              <div className="flex items-center">
                <TrendingDown className="text-red-500 w-5 h-5 mr-2" />
                <div className="text-xl font-semibold text-red-500">-15.3%</div>
                <div className="text-sm ml-2">from "Recession" scenario</div>
              </div>
            </div>
            <div className={cn(
              "p-3 rounded-lg border",
              darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
            )}>
              <div className="font-medium mb-1">Best Case Impact</div>
              <div className="flex items-center">
                <TrendingUp className="text-green-500 w-5 h-5 mr-2" />
                <div className="text-xl font-semibold text-green-500">+14.2%</div>
                <div className="text-sm ml-2">from "Tech +20%" scenario</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAnalyticsPanel;
