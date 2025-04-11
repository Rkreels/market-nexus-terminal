
import { FC } from "react";
import { 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar, 
  ExternalLink,
  Building2,
  Landmark,
  PiggyBank
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
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

interface MacroEconomyPanelProps {
  darkMode: boolean;
}

// Mock economic indicators
const economicIndicators = [
  {
    country: "United States",
    gdpGrowth: 2.1,
    direction: "up",
    inflation: 3.2,
    unemploymentRate: 3.9,
    interestRate: 5.5,
    consumerSentiment: 78.4,
    retailSales: 0.6
  },
  {
    country: "Euro Area",
    gdpGrowth: 0.8,
    direction: "up",
    inflation: 2.4,
    unemploymentRate: 6.4,
    interestRate: 3.75,
    consumerSentiment: 95.6,
    retailSales: 0.3
  },
  {
    country: "China",
    gdpGrowth: 4.9,
    direction: "down",
    inflation: 0.7,
    unemploymentRate: 5.0,
    interestRate: 3.45,
    consumerSentiment: 105.2,
    retailSales: 2.5
  },
  {
    country: "Japan",
    gdpGrowth: 1.5,
    direction: "up",
    inflation: 2.0,
    unemploymentRate: 2.6,
    interestRate: 0.1,
    consumerSentiment: 36.2,
    retailSales: 0.1
  },
  {
    country: "United Kingdom",
    gdpGrowth: 0.6,
    direction: "down",
    inflation: 3.5,
    unemploymentRate: 4.2,
    interestRate: 5.25,
    consumerSentiment: 82.3,
    retailSales: -0.2
  }
];

// Mock GDP comparison data
const gdpComparisonData = [
  { country: "United States", value: 27.36 },
  { country: "China", value: 17.89 },
  { country: "Japan", value: 4.23 },
  { country: "Germany", value: 4.07 },
  { country: "India", value: 3.73 },
  { country: "United Kingdom", value: 3.07 },
  { country: "France", value: 2.78 },
  { country: "Italy", value: 2.01 }
];

// Mock economic calendar events
const economicEvents = [
  {
    date: "2025-03-18",
    time: "08:30 ET",
    country: "United States",
    event: "Retail Sales MoM",
    importance: "high",
    forecast: "0.4%",
    previous: "0.6%"
  },
  {
    date: "2025-03-19",
    time: "14:00 ET",
    country: "United States",
    event: "FOMC Interest Rate Decision",
    importance: "high",
    forecast: "5.25-5.50%",
    previous: "5.25-5.50%"
  },
  {
    date: "2025-03-20",
    time: "03:15 ET",
    country: "France",
    event: "S&P Global Manufacturing PMI",
    importance: "medium",
    forecast: "47.9",
    previous: "46.5"
  },
  {
    date: "2025-03-20",
    time: "04:30 ET",
    country: "Germany",
    event: "S&P Global Manufacturing PMI",
    importance: "medium",
    forecast: "45.8",
    previous: "44.6"
  },
  {
    date: "2025-03-21",
    time: "08:30 ET",
    country: "United States",
    event: "Initial Jobless Claims",
    importance: "medium",
    forecast: "215K",
    previous: "220K"
  }
];

const MacroEconomyPanel: FC<MacroEconomyPanelProps> = ({ darkMode }) => {
  return (
    <div className="space-y-4">
      {/* Economic Indicators Grid */}
      <Card className={cn(
        "border", 
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center justify-between">
            <div className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Global Economic Indicators
            </div>
            <div className="text-sm">Last Updated: March 15, 2025</div>
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
                  <th className="text-left py-3 px-4">Country</th>
                  <th className="text-center py-3 px-4">GDP Growth</th>
                  <th className="text-center py-3 px-4">Inflation</th>
                  <th className="text-center py-3 px-4">Unemployment</th>
                  <th className="text-center py-3 px-4">Interest Rate</th>
                  <th className="text-center py-3 px-4">Consumer Sentiment</th>
                  <th className="text-center py-3 px-4">Retail Sales MoM</th>
                </tr>
              </thead>
              <tbody>
                {economicIndicators.map((indicator) => (
                  <tr 
                    key={indicator.country}
                    className={cn(
                      "border-b hover:bg-opacity-50",
                      darkMode 
                        ? "border-zinc-700 hover:bg-zinc-700" 
                        : "border-gray-200 hover:bg-gray-100"
                    )}
                  >
                    <td className="py-3 px-4 font-medium">{indicator.country}</td>
                    <td className={cn(
                      "py-3 px-4 text-center flex items-center justify-center",
                      indicator.direction === "up" ? "text-green-500" : "text-red-500"
                    )}>
                      {indicator.direction === "up" ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {indicator.gdpGrowth}%
                    </td>
                    <td className={cn(
                      "py-3 px-4 text-center",
                      indicator.inflation > 3 ? "text-amber-500" : 
                      indicator.inflation < 1 ? "text-blue-500" : ""
                    )}>
                      {indicator.inflation}%
                    </td>
                    <td className="py-3 px-4 text-center">{indicator.unemploymentRate}%</td>
                    <td className="py-3 px-4 text-center">{indicator.interestRate}%</td>
                    <td className="py-3 px-4 text-center">{indicator.consumerSentiment}</td>
                    <td className={cn(
                      "py-3 px-4 text-center",
                      indicator.retailSales > 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {indicator.retailSales > 0 ? "+" : ""}{indicator.retailSales}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* GDP Chart and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* GDP Comparison Chart */}
        <Card className={cn(
          "border lg:col-span-2", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              GDP by Country (Trillion USD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={gdpComparisonData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ccc"} />
                  <XAxis 
                    type="number" 
                    tick={{ fill: darkMode ? "#ccc" : "#333" }}
                    tickFormatter={(value) => `$${value}T`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="country" 
                    tick={{ fill: darkMode ? "#ccc" : "#333" }}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => [`$${value.toFixed(2)} Trillion`, 'GDP']}
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#333' : '#fff',
                      borderColor: darkMode ? '#555' : '#ccc',
                      color: darkMode ? '#fff' : '#333' 
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {gdpComparisonData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index % 2 === 0 ? "#3b82f6" : "#60a5fa"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Economic Calendar */}
        <Card className={cn(
          "border", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Economic Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 h-80 overflow-y-auto pr-2">
              {economicEvents.map((event, index) => (
                <div 
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border",
                    darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium">{event.event}</div>
                    <Badge 
                      className={cn(
                        event.importance === "high" ? "bg-red-500" :
                        event.importance === "medium" ? "bg-amber-500" :
                        "bg-blue-500"
                      )}
                    >
                      {event.importance}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm mt-1">
                    <div className="font-medium">{event.country}</div>
                    <span className="mx-2">•</span>
                    <div>{event.date}</div>
                    <span className="mx-2">•</span>
                    <div>{event.time}</div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <div>
                      <span className="opacity-70">Forecast:</span> {event.forecast}
                    </div>
                    <div>
                      <span className="opacity-70">Previous:</span> {event.previous}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-3" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" /> Full Calendar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Policy & Fiscal Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Central Banks */}
        <Card className={cn(
          "border", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Landmark className="w-5 h-5 mr-2" />
              Central Bank Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className={cn(
                "p-3 rounded-lg border",
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
              )}>
                <div className="font-medium">Federal Reserve</div>
                <div className="text-sm mt-1">Current Rate: 5.25-5.50%</div>
                <div className="text-sm mt-1">
                  The Fed is expected to maintain current rates at the March meeting, 
                  but signaling potential cuts later in the year as inflation continues to moderate.
                </div>
                <div className="text-sm mt-1 opacity-70">Next Meeting: March 19-20, 2025</div>
              </div>
              
              <div className={cn(
                "p-3 rounded-lg border",
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
              )}>
                <div className="font-medium">European Central Bank</div>
                <div className="text-sm mt-1">Current Rate: 3.75%</div>
                <div className="text-sm mt-1">
                  The ECB recently cut rates by 25 basis points in response to easing inflation 
                  pressures and weak growth in the Eurozone.
                </div>
                <div className="text-sm mt-1 opacity-70">Next Meeting: April 11, 2025</div>
              </div>
              
              <div className={cn(
                "p-3 rounded-lg border",
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
              )}>
                <div className="font-medium">Bank of Japan</div>
                <div className="text-sm mt-1">Current Rate: 0.10%</div>
                <div className="text-sm mt-1">
                  The BOJ is gradually shifting away from ultra-loose monetary policy, 
                  with another small rate hike anticipated in Q2 2025.
                </div>
                <div className="text-sm mt-1 opacity-70">Next Meeting: April 25-26, 2025</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fiscal Policy */}
        <Card className={cn(
          "border", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Fiscal Policy Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className={cn(
                "p-3 rounded-lg border",
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
              )}>
                <div className="font-medium">United States</div>
                <div className="text-sm mt-1">
                  <span className="opacity-70">Debt/GDP:</span> 123.4%
                </div>
                <div className="text-sm mt-1">
                  <span className="opacity-70">Budget Deficit:</span> -5.8% of GDP
                </div>
                <div className="text-sm mt-1">
                  Congress is debating infrastructure spending package amid concerns about long-term debt sustainability.
                </div>
              </div>
              
              <div className={cn(
                "p-3 rounded-lg border",
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
              )}>
                <div className="font-medium">European Union</div>
                <div className="text-sm mt-1">
                  <span className="opacity-70">Debt/GDP:</span> 88.6% (avg)
                </div>
                <div className="text-sm mt-1">
                  <span className="opacity-70">Budget Deficit:</span> -3.2% of GDP (avg)
                </div>
                <div className="text-sm mt-1">
                  EU fiscal rules reform under implementation, allowing more flexibility for investment in green and digital transitions.
                </div>
              </div>
              
              <div className={cn(
                "p-3 rounded-lg border",
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
              )}>
                <div className="font-medium">China</div>
                <div className="text-sm mt-1">
                  <span className="opacity-70">Debt/GDP:</span> 289.5% (total)
                </div>
                <div className="text-sm mt-1">
                  <span className="opacity-70">Budget Deficit:</span> -3.8% of GDP
                </div>
                <div className="text-sm mt-1">
                  Increased stimulus measures focused on consumption and strategic industries, with emphasis on property sector stability.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consumer & Housing */}
        <Card className={cn(
          "border", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <PiggyBank className="w-5 h-5 mr-2" />
              Consumer & Housing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "p-3 rounded-lg border mb-3",
              darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
            )}>
              <div className="font-medium">US Consumer Health</div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <div className="text-xs opacity-70">Consumer Confidence</div>
                  <div className="flex items-center">
                    <div className="text-lg font-semibold mr-1">78.4</div>
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-70">Personal Savings Rate</div>
                  <div className="flex items-center">
                    <div className="text-lg font-semibold mr-1">3.8%</div>
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-70">Wage Growth YoY</div>
                  <div className="flex items-center">
                    <div className="text-lg font-semibold mr-1">4.2%</div>
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-70">Consumer Credit Growth</div>
                  <div className="flex items-center">
                    <div className="text-lg font-semibold mr-1">3.5%</div>
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className={cn(
              "p-3 rounded-lg border",
              darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
            )}>
              <div className="font-medium">US Housing Market</div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <div className="text-xs opacity-70">30Y Fixed Mortgage</div>
                  <div className="flex items-center">
                    <div className="text-lg font-semibold mr-1">6.34%</div>
                    <TrendingDown className="w-3 h-3 text-green-500" />
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-70">Home Price Index YoY</div>
                  <div className="flex items-center">
                    <div className="text-lg font-semibold mr-1">3.8%</div>
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-70">Housing Starts MoM</div>
                  <div className="flex items-center">
                    <div className="text-lg font-semibold mr-1">-2.3%</div>
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-70">Existing Home Sales</div>
                  <div className="flex items-center">
                    <div className="text-lg font-semibold mr-1">4.38M</div>
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
            
            <Button className="w-full mt-3" size="sm">
              Full Consumer Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MacroEconomyPanel;
