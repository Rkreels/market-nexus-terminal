
import { FC, useState } from "react";
import { LineChart as LineChartIcon, ArrowUpRight, ArrowDownRight, Plus, Edit, Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Timeframe, timeframeOptions, generateTimeframeData } from "@/utils/timeframeUtils";
import { useToast } from "@/hooks/use-toast";

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

const MarketDataPanel: FC<MarketDataPanelProps> = ({ darkMode }) => {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1M');
  const [chartData, setChartData] = useState(() => generateTimeframeData(activeTimeframe));
  const { toast } = useToast();

  const handleTimeframeChange = (timeframe: Timeframe) => {
    setActiveTimeframe(timeframe);
    setChartData(generateTimeframeData(timeframe));
    toast({
      title: "Timeframe Changed",
      description: `Showing data for ${timeframe}`,
      duration: 2000,
    });
  };

  const handleAddWatchlist = () => {
    toast({
      title: "Add to Watchlist",
      description: "Item added to your watchlist",
      duration: 2000,
    });
  };

  const handleEditData = () => {
    toast({
      title: "Edit Data",
      description: "Data editing functionality coming soon",
      duration: 2000,
    });
  };

  const handleDeleteData = () => {
    toast({
      title: "Delete Data",
      description: "Data removed from view",
      duration: 2000,
    });
  };

  return (
    <div className={cn("rounded-lg overflow-hidden shadow-md", 
      darkMode ? "bg-zinc-800 border border-zinc-700" : "bg-white border border-gray-200"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <LineChartIcon className={cn("w-5 h-5 mr-2", darkMode ? "text-blue-400" : "text-blue-600")} />
          <h3 className="font-medium">Market Overview</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("text-xs px-2 py-1 rounded", 
            darkMode ? "bg-zinc-700 text-zinc-300" : "bg-gray-100 text-gray-700"
          )}>
            Live
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleAddWatchlist}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleEditData}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleDeleteData}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {marketIndexes.map((index) => (
          <div key={index.name} className={cn("p-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-colors", 
            darkMode ? "bg-zinc-700 hover:bg-zinc-600" : "bg-gray-50 hover:bg-gray-100"
          )}
          onClick={() => toast({
            title: `${index.name} Selected`,
            description: "View detailed information for this index",
            duration: 2000,
          })}>
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

      <div className="flex border-t border-b px-4 py-2 overflow-x-auto gap-2 whitespace-nowrap scrollbar-none">
        {timeframeOptions.map(timeframe => (
          <Button 
            key={timeframe}
            variant={activeTimeframe === timeframe ? "default" : "outline"}
            size="sm"
            onClick={() => handleTimeframeChange(timeframe)}
            className="min-w-16"
          >
            {timeframe}
          </Button>
        ))}
      </div>
      
      <div className="p-4 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
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
