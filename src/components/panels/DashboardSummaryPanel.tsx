
import { FC, useState } from "react";
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Bell, 
  Calendar, 
  BarChart3, 
  Briefcase 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Timeframe, timeframeOptions, generateTimeframeData } from "@/utils/timeframeUtils";

interface DashboardSummaryPanelProps {
  darkMode: boolean;
}

// Mock portfolio summary data
const portfolioSummary = {
  totalValue: 847392.58,
  dailyChange: 12481.32,
  dailyPercentChange: 1.47,
  direction: "up"
};

// Mock notifications
const notificationCount = 5;

// Mock agenda items
const agendaItems = [
  { time: "10:00 AM", title: "Market Open Review", status: "completed" },
  { time: "11:30 AM", title: "Portfolio Risk Assessment", status: "active" },
  { time: "02:00 PM", title: "Earnings Call: AAPL", status: "upcoming" },
  { time: "03:30 PM", title: "Economic Data Release", status: "upcoming" }
];

const DashboardSummaryPanel: FC<DashboardSummaryPanelProps> = ({ darkMode }) => {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1W');
  const [chartData, setChartData] = useState(() => generateTimeframeData(activeTimeframe, 5200, 0.01));
  const { toast } = useToast();

  const handleTimeframeChange = (timeframe: Timeframe) => {
    setActiveTimeframe(timeframe);
    setChartData(generateTimeframeData(timeframe, 5200, 0.01));
    toast({
      title: "Timeframe Changed",
      description: `Dashboard overview updated to ${timeframe} view`,
      duration: 2000,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className={cn(
        "border md:col-span-2", 
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <LayoutDashboard className="w-5 h-5 mr-2" />
            Market Performance Overview
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => toast({
                title: "View Detailed Reports",
                description: "Opening detailed market analytics",
                duration: 2000,
              })}
            >
              <BarChart3 className="h-4 w-4 mr-1" /> Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast({
                title: "Portfolio Impact",
                description: "Analyzing market impact on your portfolio",
                duration: 2000,
              })}
            >
              <Briefcase className="h-4 w-4 mr-1" /> Impact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {timeframeOptions.map(timeframe => (
              <Button 
                key={timeframe}
                variant={activeTimeframe === timeframe ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeframeChange(timeframe)}
              >
                {timeframe}
              </Button>
            ))}
          </div>
          
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#eee"} />
                <XAxis dataKey="time" stroke={darkMode ? "#ccc" : "#666"} />
                <YAxis stroke={darkMode ? "#ccc" : "#666"} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#333' : '#fff',
                    borderColor: darkMode ? '#555' : '#ccc',
                    color: darkMode ? '#fff' : '#333' 
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  fill={darkMode ? "rgba(136, 132, 216, 0.3)" : "rgba(136, 132, 216, 0.2)"} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className={cn(
              "p-4 rounded-lg border flex items-center justify-between",
              darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
            )}>
              <div>
                <div className="text-sm opacity-70">Portfolio Value</div>
                <div className="text-2xl font-bold">${portfolioSummary.totalValue.toLocaleString()}</div>
              </div>
              <div className={cn(
                "flex items-center text-sm",
                portfolioSummary.direction === "up" ? "text-green-500" : "text-red-500"
              )}>
                {portfolioSummary.direction === "up" ? (
                  <ArrowUpRight className="w-5 h-5 mr-1" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 mr-1" />
                )}
                {portfolioSummary.dailyPercentChange.toFixed(2)}%
              </div>
            </div>
            <div className={cn(
              "p-4 rounded-lg border flex items-center justify-between cursor-pointer",
              darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
            )}
            onClick={() => toast({
              title: "Notifications",
              description: "Opening notification center",
              duration: 2000,
            })}>
              <div>
                <div className="text-sm opacity-70">Alerts & Notifications</div>
                <div className="text-2xl font-bold flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  {notificationCount} New
                </div>
              </div>
              <Button 
                variant="default" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toast({
                    title: "View All Notifications",
                    description: "Opening notifications page",
                    duration: 2000,
                  });
                }}
              >
                View All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className={cn(
        "border", 
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Today's Agenda
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast({
              title: "Add Event",
              description: "Opening calendar event creation",
              duration: 2000,
            })}
          >
            Add Event
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agendaItems.map((item, index) => (
              <div 
                key={index}
                className={cn(
                  "p-3 rounded-lg border flex items-start cursor-pointer transition-colors",
                  darkMode ? "border-zinc-700 hover:bg-zinc-700" : "border-gray-200 hover:bg-gray-50",
                  item.status === "completed" && "opacity-60"
                )}
                onClick={() => toast({
                  title: item.title,
                  description: `Scheduled for ${item.time}`,
                  duration: 2000,
                })}
              >
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1.5 mr-3",
                  item.status === "active" ? "bg-green-500" :
                  item.status === "upcoming" ? "bg-blue-500" : "bg-gray-500"
                )} />
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm opacity-70">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            variant="link" 
            className="mt-4 w-full"
            onClick={() => toast({
              title: "Calendar View",
              description: "Opening full calendar view",
              duration: 2000,
            })}
          >
            View Full Calendar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummaryPanel;
