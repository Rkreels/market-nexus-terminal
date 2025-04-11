
import { FC } from "react";
import { LineChart, ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface StockDetailPanelProps {
  darkMode: boolean;
}

// Mock stock price data
const stockPriceData = [
  { date: "Apr 5", price: 182.5, volume: 15.2 },
  { date: "Apr 6", price: 184.3, volume: 17.8 },
  { date: "Apr 7", price: 185.7, volume: 12.1 },
  { date: "Apr 8", price: 184.9, volume: 13.5 },
  { date: "Apr 9", price: 186.2, volume: 16.3 },
  { date: "Apr 10", price: 187.8, volume: 18.2 },
  { date: "Apr 11", price: 188.5, volume: 19.5 },
  { date: "Apr 12", price: 187.9, volume: 14.7 },
  { date: "Apr 13", price: 189.3, volume: 16.9 },
  { date: "Apr 14", price: 188.7, volume: 15.4 },
  { date: "Apr 15", price: 190.1, volume: 17.3 },
  { date: "Apr 16", price: 189.4, volume: 14.8 },
  { date: "Apr 17", price: 188.2, volume: 13.2 },
  { date: "Apr 18", price: 189.5, volume: 16.7 },
];

// Mock key statistics
const keyStats = [
  { label: "Open", value: "188.54" },
  { label: "High", value: "190.23" },
  { label: "Low", value: "188.19" },
  { label: "52W High", value: "199.62" },
  { label: "52W Low", value: "143.90" },
  { label: "Volume", value: "32.5M" },
  { label: "Avg Vol", value: "45.7M" },
  { label: "Mkt Cap", value: "2.95T" },
  { label: "P/E", value: "29.14" },
  { label: "Div Yield", value: "0.51%" },
  { label: "EPS", value: "6.14" },
  { label: "Beta", value: "1.32" },
];

const StockDetailPanel: FC<StockDetailPanelProps> = ({ darkMode }) => {
  return (
    <div className={cn("rounded-lg overflow-hidden shadow-md", 
      darkMode ? "bg-zinc-800 border border-zinc-700" : "bg-white border border-gray-200"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <LineChart className={cn("w-5 h-5 mr-2", darkMode ? "text-green-400" : "text-green-600")} />
          <h3 className="font-medium">Stock Details</h3>
          <div className="ml-2 flex items-center space-x-1">
            <span className="font-semibold text-sm">AAPL</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={cn("text-xs px-2 py-1 rounded", 
            darkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800"
          )}>
            Apple Inc.
          </div>
          <div className={cn("text-xs px-2 py-1 rounded", 
            darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-800"
          )}>
            NASDAQ
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
        <div className="lg:col-span-3">
          <div className="mb-4">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline">
                <h2 className="text-2xl font-bold">$189.46</h2>
                <span className="ml-2 text-green-500">+1.23 (+0.65%)</span>
              </div>
              <div className={cn("text-sm", darkMode ? "text-gray-400" : "text-gray-500")}>
                As of {new Date().toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stockPriceData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ccc"} />
                <XAxis dataKey="date" stroke={darkMode ? "#ccc" : "#666"} />
                <YAxis 
                  domain={['dataMin - 2', 'dataMax + 2']} 
                  stroke={darkMode ? "#ccc" : "#666"} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#333' : '#fff',
                    borderColor: darkMode ? '#555' : '#ccc',
                    color: darkMode ? '#fff' : '#333' 
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#16a34a" 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex mt-2 justify-end">
            <div className="flex space-x-2">
              {["1D", "1W", "1M", "3M", "6M", "1Y", "5Y"].map((period) => (
                <button 
                  key={period}
                  className={cn("px-3 py-1 rounded text-sm", 
                    period === "1M" 
                      ? (darkMode ? "bg-green-800 text-green-200" : "bg-green-100 text-green-800") 
                      : (darkMode ? "bg-zinc-700 text-zinc-300" : "bg-gray-100 text-gray-700")
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className={cn("rounded-lg p-4", 
            darkMode ? "bg-zinc-700" : "bg-gray-50"
          )}>
            <div className="flex items-center mb-3">
              <Info className="w-4 h-4 mr-1" />
              <h3 className="font-medium">Key Statistics</h3>
            </div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {keyStats.map((stat, index) => (
                <div key={index} className="flex justify-between">
                  <span className={cn("text-sm", 
                    darkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    {stat.label}:
                  </span>
                  <span className="text-sm font-medium">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetailPanel;
