import { FC, useState, useEffect } from "react";
import { 
  TrendingUp, 
  LineChart, 
  DollarSign, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search,
  Filter,
  Clock,
  CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import TimeframeSelector from "@/components/TimeframeSelector";
import { useTimeframeSelection } from "@/hooks/useTimeframeSelection";
import { Timeframe } from "@/utils/timeframeUtils";
import FilterPanel from "@/components/FilterPanel";
import { useUI } from "@/contexts/UIContext";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

interface FixedIncomePanelProps {
  darkMode: boolean;
}

// Mock yield curve data
const yieldCurveData = [
  { term: "1M", current: 5.53, previous: 5.48 },
  { term: "3M", current: 5.51, previous: 5.46 },
  { term: "6M", current: 5.40, previous: 5.37 },
  { term: "1Y", current: 5.06, previous: 5.12 },
  { term: "2Y", current: 4.68, previous: 4.75 },
  { term: "3Y", current: 4.41, previous: 4.50 },
  { term: "5Y", current: 4.32, previous: 4.40 },
  { term: "7Y", current: 4.34, previous: 4.43 },
  { term: "10Y", current: 4.35, previous: 4.45 },
  { term: "20Y", current: 4.68, previous: 4.75 },
  { term: "30Y", current: 4.48, previous: 4.58 }
];

// Mock bond listings
const bondListings = [
  {
    issuer: "US Treasury",
    description: "U.S. Treasury Note",
    coupon: 4.25,
    maturity: "2027-03-15",
    price: 99.75,
    yield: 4.31,
    rating: "AAA",
    change: 0.12,
    direction: "up"
  },
  {
    issuer: "US Treasury",
    description: "U.S. Treasury Bond",
    coupon: 4.50,
    maturity: "2034-02-15",
    price: 102.38,
    yield: 4.24,
    rating: "AAA",
    change: 0.18,
    direction: "up"
  },
  {
    issuer: "Apple Inc.",
    description: "Corporate Bond",
    coupon: 4.65,
    maturity: "2030-05-11",
    price: 101.25,
    yield: 4.48,
    rating: "AA+",
    change: -0.07,
    direction: "down"
  },
  {
    issuer: "Microsoft Corp.",
    description: "Corporate Bond",
    coupon: 4.75,
    maturity: "2032-09-08",
    price: 102.15,
    yield: 4.52,
    rating: "AAA",
    change: 0.05,
    direction: "up"
  },
  {
    issuer: "JP Morgan Chase",
    description: "Corporate Bond",
    coupon: 5.25,
    maturity: "2029-07-22",
    price: 104.38,
    yield: 4.65,
    rating: "A+",
    change: -0.14,
    direction: "down"
  },
  {
    issuer: "California State",
    description: "Municipal Bond",
    coupon: 4.00,
    maturity: "2033-11-01",
    price: 97.25,
    yield: 4.34,
    rating: "AA-",
    change: 0.09,
    direction: "up"
  }
];

// Mock key rates
const keyRates = [
  { name: "Fed Funds Rate", value: "5.25-5.50%", change: 0, lastChange: "2024-07-31" },
  { name: "3-Month LIBOR", value: "5.53%", change: 0.02, lastChange: "2025-03-14" },
  { name: "SOFR", value: "5.31%", change: 0.01, lastChange: "2025-03-14" },
  { name: "Prime Rate", value: "8.50%", change: 0, lastChange: "2024-07-31" }
];

const fedProjections = {
  title: "Federal Reserve Projections (March 2025)",
  summary: "The Federal Reserve's latest Summary of Economic Projections shows a median expectation of three 25 basis point rate cuts in 2025, with the first expected in June.",
  dotPlot: [
    { year: "2025", median: 4.6, range: [4.1, 5.1] },
    { year: "2026", median: 3.9, range: [3.4, 4.4] },
    { year: "2027", median: 3.6, range: [3.1, 4.1] },
    { year: "LongRun", median: 2.5, range: [2.3, 2.8] }
  ],
  economicProjections: {
    gdp: { current: 2.1, previous: 1.8 },
    unemployment: { current: 4.0, previous: 4.1 },
    inflation: { current: 2.4, previous: 2.6 }
  },
  lastUpdated: "2025-03-20"
};

const FixedIncomePanel: FC<FixedIncomePanelProps> = ({ darkMode }) => {
  const { timeframe, handleTimeframeChange } = useTimeframeSelection("1M");
  const [filteredBonds, setFilteredBonds] = useState(bondListings);
  const [bondSearch, setBondSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentYieldView, setCurrentYieldView] = useState<"all" | "3M" | "6M" | "1Y" | "5Y" | "Max">("all");
  const [showFedDialog, setShowFedDialog] = useState(false);
  const { toast } = useToast();
  const { handleAction } = useUI();

  const getFilteredYieldData = () => {
    if (currentYieldView === "all" || currentYieldView === "Max") {
      return yieldCurveData;
    }
    
    const termMap = {
      "3M": ["1M", "3M", "6M"],
      "6M": ["1M", "3M", "6M", "1Y"],
      "1Y": ["1M", "3M", "6M", "1Y", "2Y"],
      "5Y": ["1M", "3M", "6M", "1Y", "2Y", "3Y", "5Y"]
    };
    
    return yieldCurveData.filter(data => termMap[currentYieldView as keyof typeof termMap].includes(data.term));
  };

  useEffect(() => {
    if (bondSearch.trim() === "") {
      setFilteredBonds(bondListings);
    } else {
      const searchLower = bondSearch.toLowerCase();
      const filtered = bondListings.filter(bond => 
        bond.issuer.toLowerCase().includes(searchLower) || 
        bond.description.toLowerCase().includes(searchLower) ||
        bond.rating.toLowerCase().includes(searchLower)
      );
      setFilteredBonds(filtered);
    }
  }, [bondSearch]);

  const handleApplyFilters = (filters: any) => {
    toast({
      title: "Filters Applied",
      description: `Applied filters to bond listings`,
      duration: 3000
    });
    
    let filtered = bondListings;
    
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(bond => bond.issuer.includes(filters.category));
    }
    
    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter(bond => bond.description.includes(filters.type));
    }
    
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(bond => bond.price >= min && bond.price <= max);
    }
    
    setFilteredBonds(filtered);
  };

  const handleShowFedProjections = () => {
    setShowFedDialog(true);
    handleAction("view", "Fed Projections", "March 2025 FOMC Meeting");
  };

  const displayFilteredData = getFilteredYieldData();

  return (
    <div className="space-y-4">
      {/* Key Rates */}
      <Card className={cn(
        "border", 
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Key Interest Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {keyRates.map((rate) => (
              <div 
                key={rate.name}
                className={cn(
                  "p-3 rounded-lg",
                  darkMode ? "bg-zinc-700" : "bg-gray-50"
                )}
              >
                <div className="text-sm opacity-70 mb-1">{rate.name}</div>
                <div className="text-xl font-semibold">{rate.value}</div>
                <div className="flex items-center text-sm mt-1">
                  {rate.change === 0 ? (
                    <span className="text-blue-400">Unchanged</span>
                  ) : rate.change > 0 ? (
                    <div className="flex items-center text-green-500">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      +{rate.change.toFixed(2)}
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                      {rate.change.toFixed(2)}
                    </div>
                  )}
                  <Clock className="w-3 h-3 mx-1 opacity-70" />
                  <span className="opacity-70">{rate.lastChange}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Yield Curve */}
      <Card className={cn(
        "border", 
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center justify-between">
            <div className="flex items-center">
              <LineChart className="w-5 h-5 mr-2" />
              US Treasury Yield Curve
            </div>
            <div className="flex items-center text-sm">
              <CalendarDays className="w-4 h-4 mr-1" />
              <span>Last Updated: March 15, 2025</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={displayFilteredData}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ccc"} />
                <XAxis 
                  dataKey="term" 
                  tick={{ fill: darkMode ? "#ccc" : "#333" }}
                />
                <YAxis 
                  domain={[4, 6]}
                  tick={{ fill: darkMode ? "#ccc" : "#333" }}
                  tickFormatter={(value) => `${value}%`}
                />
                <RechartsTooltip 
                  formatter={(value: number) => [`${value}%`, '']}
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#333' : '#fff',
                    borderColor: darkMode ? '#555' : '#ccc',
                    color: darkMode ? '#fff' : '#333' 
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  name="Current" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="previous" 
                  name="Previous Week" 
                  stroke="#9ca3af" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 4 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm">
              <Badge className="mr-2">Current</Badge> 
              <Badge variant="outline">Previous Week</Badge>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={currentYieldView === "3M" ? "default" : "outline"}
                onClick={() => setCurrentYieldView("3M")}
              >
                3M
              </Button>
              <Button 
                size="sm" 
                variant={currentYieldView === "6M" ? "default" : "outline"}
                onClick={() => setCurrentYieldView("6M")}
              >
                6M
              </Button>
              <Button 
                size="sm" 
                variant={currentYieldView === "1Y" ? "default" : "outline"}
                onClick={() => setCurrentYieldView("1Y")}
              >
                1Y
              </Button>
              <Button 
                size="sm" 
                variant={currentYieldView === "5Y" ? "default" : "outline"}
                onClick={() => setCurrentYieldView("5Y")}
              >
                5Y
              </Button>
              <Button 
                size="sm" 
                variant={currentYieldView === "Max" ? "default" : "outline"}
                onClick={() => setCurrentYieldView("Max")}
              >
                Max
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bond Finder */}
      <Card className={cn(
        "border", 
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Bond Screener
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 mb-4 relative">
            <Input 
              placeholder="Search by issuer, CUSIP, or description" 
              className={cn(
                "flex-grow",
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
              )}
              value={bondSearch}
              onChange={(e) => setBondSearch(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={() => {
                toast({
                  title: "Search Executed",
                  description: `Searching for: ${bondSearch || 'all bonds'}`,
                  duration: 2000
                });
              }}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {isFilterOpen && (
              <FilterPanel
                darkMode={darkMode}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={handleApplyFilters}
                filterOptions={{
                  search: true,
                  categories: ["US Treasury", "Corporate Bond", "Municipal Bond"],
                  types: ["Treasury Note", "Treasury Bond", "Corporate Bond", "Municipal Bond"],
                  dates: true,
                  price: true
                }}
              />
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn(
                  "border-b",
                  darkMode ? "border-zinc-700" : "border-gray-200"
                )}>
                  <th className="text-left py-3 px-4">Issuer/Description</th>
                  <th className="text-center py-3 px-4">Coupon</th>
                  <th className="text-center py-3 px-4">Maturity</th>
                  <th className="text-center py-3 px-4">Price</th>
                  <th className="text-center py-3 px-4">Yield</th>
                  <th className="text-center py-3 px-4">Rating</th>
                  <th className="text-right py-3 px-4">Chg</th>
                </tr>
              </thead>
              <tbody>
                {filteredBonds.map((bond, index) => (
                  <tr 
                    key={index}
                    className={cn(
                      "border-b hover:bg-opacity-50 cursor-pointer",
                      darkMode 
                        ? "border-zinc-700 hover:bg-zinc-700" 
                        : "border-gray-200 hover:bg-gray-100"
                    )}
                    onClick={() => {
                      handleAction('view', 'Bond Details', `${bond.issuer} ${bond.coupon}% ${bond.maturity}`);
                    }}
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium">{bond.issuer}</div>
                      <div className="text-sm opacity-70">{bond.description}</div>
                    </td>
                    <td className="py-3 px-4 text-center">{bond.coupon}%</td>
                    <td className="py-3 px-4 text-center">{bond.maturity}</td>
                    <td className="py-3 px-4 text-center">{bond.price}</td>
                    <td className="py-3 px-4 text-center font-medium">{bond.yield}%</td>
                    <td className="py-3 px-4 text-center">
                      <Badge 
                        variant="outline"
                        className={cn(
                          bond.rating.startsWith('A') ? "border-green-500 text-green-500" :
                          bond.rating.startsWith('B') ? "border-yellow-500 text-yellow-500" :
                          "border-red-500 text-red-500"
                        )}
                      >
                        {bond.rating}
                      </Badge>
                    </td>
                    <td className={cn(
                      "py-3 px-4 text-right flex items-center justify-end",
                      bond.direction === "up" ? "text-green-500" : "text-red-500"
                    )}>
                      {bond.direction === "up" ? (
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(bond.change).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Fixed Income Analysis */}
      <Card className={cn(
        "border", 
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Fixed Income Market Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={cn(
              "p-4 rounded-lg border",
              darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
            )}>
              <h3 className="font-medium text-lg mb-2">Yield Curve Analysis</h3>
              <p className="text-sm mb-2">
                The yield curve remains inverted at the short end, with 1-month yields higher than 1-year. 
                The curve is steepening at the long end, suggesting markets are pricing in future rate cuts.
              </p>
              <div className={cn(
                "p-3 rounded border mt-3",
                darkMode ? "border-zinc-600 bg-zinc-800" : "border-gray-200 bg-white"
              )}>
                <div className="text-sm font-medium mb-1">Key Observations</div>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>2/10 Spread: -31 bps (widened 2 bps)</li>
                  <li>3m/10y Spread: -119 bps (tightened 4 bps)</li>
                  <li>All yields declined week-over-week</li>
                </ul>
              </div>
            </div>
            
            <div className={cn(
              "p-4 rounded-lg border",
              darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
            )}>
              <h3 className="font-medium text-lg mb-2">Credit Spread Analysis</h3>
              <p className="text-sm mb-2">
                Corporate bond spreads have tightened slightly, indicating improved risk sentiment. 
                High-yield bonds outperformed investment-grade this week as investors seek yield.
              </p>
              <div className={cn(
                "p-3 rounded border mt-3",
                darkMode ? "border-zinc-600 bg-zinc-800" : "border-gray-200 bg-white"
              )}>
                <div className="text-sm font-medium mb-1">Spread Changes</div>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>IG Spreads: 89 bps (-4 bps WoW)</li>
                  <li>HY Spreads: 310 bps (-12 bps WoW)</li>
                  <li>AAA-BBB Spread: 55 bps (unchanged)</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 rounded-lg border bg-amber-500/10 border-amber-600/30">
            <div className="flex justify-between">
              <h3 className="font-medium text-lg">Fed Watch</h3>
              <Badge variant="outline" className="border-amber-500 text-amber-500">Important</Badge>
            </div>
            <p className="text-sm mt-2">
              The Federal Reserve is expected to hold rates steady at the upcoming March meeting. 
              Futures markets are pricing in 75 bps of cuts in 2025, with the first cut anticipated in June.
              Watch for updated dot plot projections at the next FOMC meeting on March 20, 2025.
            </p>
            <Button className="mt-3" size="sm" onClick={handleShowFedProjections}>
              <TrendingUp className="w-4 h-4 mr-2" /> View Fed Projections
            </Button>

            {showFedDialog && (
              <div className={cn(
                "fixed inset-0 z-50 flex items-center justify-center bg-black/50",
                "p-4"
              )}>
                <div className={cn(
                  "relative w-full max-w-2xl p-6 rounded-lg shadow-lg",
                  darkMode ? "bg-zinc-800 text-white" : "bg-white text-black"
                )}>
                  <Button 
                    className="absolute right-3 top-3" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowFedDialog(false)}
                  >
                    ×
                  </Button>
                  <h2 className="text-xl font-semibold mb-4">{fedProjections.title}</h2>
                  <p className="mb-4">{fedProjections.summary}</p>
                  
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Dot Plot Summary</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className={cn(
                              "text-left p-2 border-b",
                              darkMode ? "border-zinc-600" : "border-gray-300"
                            )}>
                              Year
                            </th>
                            <th className={cn(
                              "text-center p-2 border-b",
                              darkMode ? "border-zinc-600" : "border-gray-300"
                            )}>
                              Median Rate (%)
                            </th>
                            <th className={cn(
                              "text-right p-2 border-b",
                              darkMode ? "border-zinc-600" : "border-gray-300"
                            )}>
                              Range (%)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {fedProjections.dotPlot.map((item) => (
                            <tr key={item.year}>
                              <td className={cn(
                                "p-2 border-b",
                                darkMode ? "border-zinc-600" : "border-gray-300"
                              )}>
                                {item.year === "LongRun" ? "Longer Run" : item.year}
                              </td>
                              <td className={cn(
                                "text-center p-2 border-b font-medium",
                                darkMode ? "border-zinc-600" : "border-gray-300"
                              )}>
                                {item.median.toFixed(1)}
                              </td>
                              <td className={cn(
                                "text-right p-2 border-b",
                                darkMode ? "border-zinc-600" : "border-gray-300"
                              )}>
                                {item.range[0].toFixed(1)} - {item.range[1].toFixed(1)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Economic Projections</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className={cn(
                        "p-3 rounded border",
                        darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-300 bg-gray-50"
                      )}>
                        <div className="text-sm opacity-70">GDP Growth</div>
                        <div className="text-xl font-medium">{fedProjections.economicProjections.gdp.current}%</div>
                        <div className={cn(
                          "text-sm mt-1",
                          fedProjections.economicProjections.gdp.current > fedProjections.economicProjections.gdp.previous 
                            ? "text-green-500" 
                            : "text-red-500"
                        )}>
                          {fedProjections.economicProjections.gdp.current > fedProjections.economicProjections.gdp.previous 
                            ? "↑" 
                            : "↓"} 
                          from {fedProjections.economicProjections.gdp.previous}%
                        </div>
                      </div>
                      
                      <div className={cn(
                        "p-3 rounded border",
                        darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-300 bg-gray-50"
                      )}>
                        <div className="text-sm opacity-70">Unemployment</div>
                        <div className="text-xl font-medium">{fedProjections.economicProjections.unemployment.current}%</div>
                        <div className={cn(
                          "text-sm mt-1",
                          fedProjections.economicProjections.unemployment.current < fedProjections.economicProjections.unemployment.previous 
                            ? "text-green-500" 
                            : "text-red-500"
                        )}>
                          {fedProjections.economicProjections.unemployment.current < fedProjections.economicProjections.unemployment.previous 
                            ? "↓" 
                            : "↑"} 
                          from {fedProjections.economicProjections.unemployment.previous}%
                        </div>
                      </div>
                      
                      <div className={cn(
                        "p-3 rounded border",
                        darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-300 bg-gray-50"
                      )}>
                        <div className="text-sm opacity-70">PCE Inflation</div>
                        <div className="text-xl font-medium">{fedProjections.economicProjections.inflation.current}%</div>
                        <div className={cn(
                          "text-sm mt-1",
                          fedProjections.economicProjections.inflation.current < fedProjections.economicProjections.inflation.previous 
                            ? "text-green-500" 
                            : "text-red-500"
                        )}>
                          {fedProjections.economicProjections.inflation.current < fedProjections.economicProjections.inflation.previous 
                            ? "↓" 
                            : "↑"} 
                          from {fedProjections.economicProjections.inflation.previous}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm opacity-70 mt-4">
                    Last Updated: {fedProjections.lastUpdated}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FixedIncomePanel;
