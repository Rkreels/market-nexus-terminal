
import { FC, useState } from "react";
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Bell, 
  Calendar, 
  BarChart3, 
  Briefcase,
  Plus
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isImpactDialogOpen, setIsImpactDialogOpen] = useState(false);
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ time: "", title: "", description: "" });
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

  const handleAddEvent = () => {
    if (newEvent.time && newEvent.title) {
      toast({
        title: "Event Added",
        description: `${newEvent.title} scheduled for ${newEvent.time}`,
        duration: 2000,
      });
      setNewEvent({ time: "", title: "", description: "" });
      setIsAddEventDialogOpen(false);
    } else {
      toast({
        title: "Unable to Add Event",
        description: "Please provide both time and title for the event",
        variant: "destructive",
        duration: 2000,
      });
    }
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
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  <BarChart3 className="h-4 w-4 mr-1" /> Details
                </Button>
              </DialogTrigger>
              <DialogContent className={cn(
                darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
              )}>
                <DialogHeader>
                  <DialogTitle>Market Analytics Details</DialogTitle>
                  <DialogDescription>
                    Comprehensive market data and analysis tools
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className={cn(
                    "p-4 rounded-lg mb-4",
                    darkMode ? "bg-zinc-700" : "bg-gray-100"
                  )}>
                    <h3 className="font-medium mb-2">Market Breadth</h3>
                    <div className="flex justify-between text-sm">
                      <span>Advancing Issues: 2,341</span>
                      <span className="text-green-500">58%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Declining Issues: 1,692</span>
                      <span className="text-red-500">42%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Unchanged: 87</span>
                      <span>2%</span>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "p-4 rounded-lg mb-4",
                    darkMode ? "bg-zinc-700" : "bg-gray-100"
                  )}>
                    <h3 className="font-medium mb-2">Sector Performance</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Technology</span>
                        <span className="text-green-500">+1.8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Healthcare</span>
                        <span className="text-green-500">+0.7%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Financials</span>
                        <span className="text-red-500">-0.3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Energy</span>
                        <span className="text-red-500">-1.2%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "p-4 rounded-lg",
                    darkMode ? "bg-zinc-700" : "bg-gray-100"
                  )}>
                    <h3 className="font-medium mb-2">Technical Indicators</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div>RSI (14):</div>
                        <div className="font-bold">56.78</div>
                      </div>
                      <div>
                        <div>MACD:</div>
                        <div className="font-bold text-green-500">Bullish</div>
                      </div>
                      <div>
                        <div>50-Day MA:</div>
                        <div className="font-bold">5,187.32</div>
                      </div>
                      <div>
                        <div>200-Day MA:</div>
                        <div className="font-bold">4,932.18</div>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsDetailDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isImpactDialogOpen} onOpenChange={setIsImpactDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Briefcase className="h-4 w-4 mr-1" /> Impact
                </Button>
              </DialogTrigger>
              <DialogContent className={cn(
                darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
              )}>
                <DialogHeader>
                  <DialogTitle>Portfolio Impact Analysis</DialogTitle>
                  <DialogDescription>
                    How current market conditions affect your portfolio
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className={cn(
                    "p-4 rounded-lg mb-4",
                    darkMode ? "bg-zinc-700" : "bg-gray-100"
                  )}>
                    <h3 className="font-medium mb-2">Market Correlation</h3>
                    <div className="flex justify-between items-center">
                      <span>Portfolio Beta:</span>
                      <span className="font-bold">1.12</span>
                    </div>
                    <div className="text-xs mt-1 opacity-70">
                      Your portfolio is slightly more volatile than the market
                    </div>
                  </div>
                  
                  <div className={cn(
                    "p-4 rounded-lg mb-4",
                    darkMode ? "bg-zinc-700" : "bg-gray-100"
                  )}>
                    <h3 className="font-medium mb-2">Top Impacted Holdings</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>AAPL</span>
                        <span className="text-green-500">+$3,281.47</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>TSLA</span>
                        <span className="text-red-500">-$1,892.64</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>MSFT</span>
                        <span className="text-green-500">+$2,187.35</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "p-4 rounded-lg",
                    darkMode ? "bg-zinc-700" : "bg-gray-100"
                  )}>
                    <h3 className="font-medium mb-2">Risk Exposure</h3>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span>Tech Sector:</span>
                        <span className="font-bold">42.3%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Interest Rate Sensitive:</span>
                        <span className="font-bold">28.7%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>International Exposure:</span>
                        <span className="font-bold">31.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsImpactDialogOpen(false);
                      toast({
                        title: "Generate Report",
                        description: "Portfolio impact report is being generated",
                        duration: 2000,
                      });
                    }}
                  >
                    Generate Report
                  </Button>
                  <Button onClick={() => setIsImpactDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
            onClick={() => {
              toast({
                title: "Notifications",
                description: "Opening notification center",
                duration: 2000,
              });
            }}>
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
          <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
              >
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className={cn(
              darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white"
            )}>
              <DialogHeader>
                <DialogTitle>Add Calendar Event</DialogTitle>
                <DialogDescription>
                  Add a new event to your schedule
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-time">Time</Label>
                  <Input
                    id="event-time"
                    placeholder="e.g., 3:30 PM"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className={cn(
                      darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-title">Title</Label>
                  <Input
                    id="event-title"
                    placeholder="Event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className={cn(
                      darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-description">Description (Optional)</Label>
                  <Textarea
                    id="event-description"
                    placeholder="Event details"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    className={cn(
                      darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-priority">Priority</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger className={cn(
                      darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                    )}>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleAddEvent}>Add Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
          
          <Dialog open={isCalendarDialogOpen} onOpenChange={setIsCalendarDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="link" 
                className="mt-4 w-full"
              >
                View Full Calendar
              </Button>
            </DialogTrigger>
            <DialogContent className={cn(
              "sm:max-w-[600px]",
              darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white"
            )}>
              <DialogHeader>
                <DialogTitle>Calendar View</DialogTitle>
                <DialogDescription>
                  Your upcoming schedule and events
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="flex justify-between items-center mb-4">
                  <Button variant="outline" size="sm">Previous</Button>
                  <h3 className="font-bold">April 2025</h3>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
                
                <div className={cn(
                  "border rounded-lg overflow-hidden",
                  darkMode ? "border-zinc-700" : "border-gray-200"
                )}>
                  <div className="grid grid-cols-7 text-center py-2 border-b border-gray-200">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                      <div key={day} className="text-xs font-medium">{day}</div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 p-2">
                    {Array.from({ length: 35 }).map((_, i) => {
                      const day = i - 1;
                      const isToday = day === 13;
                      const isCurrentMonth = day >= 0 && day < 30;
                      
                      return (
                        <div 
                          key={i}
                          className={cn(
                            "aspect-square flex flex-col items-center justify-start p-1 rounded-md text-xs",
                            isToday && (darkMode ? "bg-blue-900/40 font-bold" : "bg-blue-100 font-bold"),
                            !isCurrentMonth && "opacity-30"
                          )}
                        >
                          <span>{isCurrentMonth ? day + 1 : day < 0 ? 31 + day : day - 29}</span>
                          {isToday && (
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <h3 className="font-medium text-sm mb-2">Upcoming Events</h3>
                  
                  <div className={cn(
                    "p-2 border rounded-md flex items-center",
                    darkMode ? "border-zinc-700 bg-zinc-700/50" : "border-gray-200 bg-gray-50"
                  )}>
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mr-3">14</div>
                    <div>
                      <div className="font-medium text-sm">Quarterly Earnings Report</div>
                      <div className="text-xs opacity-70">9:00 AM - 11:00 AM</div>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "p-2 border rounded-md flex items-center",
                    darkMode ? "border-zinc-700 bg-zinc-700/50" : "border-gray-200 bg-gray-50"
                  )}>
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mr-3">16</div>
                    <div>
                      <div className="font-medium text-sm">Market Strategy Meeting</div>
                      <div className="text-xs opacity-70">2:30 PM - 4:00 PM</div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCalendarDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummaryPanel;
