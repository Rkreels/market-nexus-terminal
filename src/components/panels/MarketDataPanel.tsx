
import { FC } from "react";
import { LineChart as LineChartIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface MarketDataPanelProps {
  darkMode: boolean;
}

// Mock stock market data
const marketIndexes = [
  { 
    name: "S&P 500", 
    value: 4892.17, 
    change: 15.28, 
    percentChange: 0.31, 
    direction: "up" 
  },
  { 
    name: "Dow Jones", 
    value: 38671.69, 
    change: 134.22, 
    percentChange: 0.35, 
    direction: "up" 
  },
  { 
    name: "NASDAQ", 
    value: 15461.84, 
    change: -3.25, 
    percentChange: -0.02, 
    direction: "down" 
  },
  { 
    name: "Russell 2000", 
    value: 1998.32, 
    change: 12.07, 
    percentChange: 0.61, 
    direction: "up" 
  }
];

// Mock chart data
const chartData = [
  { time: "9:30", value: 4850 },
  { time: "10:00", value: 4855 },
  { time: "10:30", value: 4848 },
  { time: "11:00", value: 4860 },
  { time: "11:30", value: 4865 },
  { time: "12:00", value: 4870 },
  { time: "12:30", value: 4868 },
  { time: "13:00", value: 4875 },
  { time: "13:30", value: 4880 },
  { time: "14:00", value: 4876 },
  { time: "14:30", value: 4882 },
  { time: "15:00", value: 4885 },
  { time: "15:30", value: 4890 },
  { time: "16:00", value: 4892 }
];

const MarketDataPanel: FC<MarketDataPanelProps> = ({ darkMode }) => {
  return (
    <div className={cn("rounded-lg overflow-hidden shadow-md", 
      darkMode ? "bg-zinc-800 border border-zinc-700" : "bg-white border border-gray-200"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <LineChartIcon className={cn("w-5 h-5 mr-2", darkMode ? "text-blue-400" : "text-blue-600")} />
          <h3 className="font-medium">Market Overview</h3>
        </div>
        <div className={cn("text-xs px-2 py-1 rounded", 
          darkMode ? "bg-zinc-700 text-zinc-300" : "bg-gray-100 text-gray-700"
        )}>
          Live
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {marketIndexes.map((index) => (
          <div key={index.name} className={cn("p-3 rounded-lg", 
            darkMode ? "bg-zinc-700" : "bg-gray-50"
          )}>
            <div className="text-sm font-medium mb-1">{index.name}</div>
            <div className="flex items-end justify-between">
              <div className="text-lg font-semibold">{index.value.toLocaleString()}</div>
              <div className={cn("flex items-center text-sm", 
                index.direction === "up" ? "text-green-500" : "text-red-500"
              )}>
                {index.direction === "up" ? (
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-1" />
                )}
                {index.percentChange.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ccc"} />
            <XAxis 
              dataKey="time" 
              stroke={darkMode ? "#ccc" : "#666"} 
            />
            <YAxis 
              stroke={darkMode ? "#ccc" : "#666"} 
              domain={['dataMin - 10', 'dataMax + 10']} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: darkMode ? '#333' : '#fff',
                borderColor: darkMode ? '#555' : '#ccc',
                color: darkMode ? '#fff' : '#333' 
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketDataPanel;
