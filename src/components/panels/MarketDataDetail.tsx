import React, { useState, useEffect } from "react";
import { useUI } from "@/contexts/UIContext";
import DetailView from "@/components/DetailView";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  getMarketDataById, 
  getChartDataForSymbol, 
  updateMarketDataItem 
} from "@/services/marketDataService";
import { MarketDataItem, TimeframeData } from "@/types/marketData";
import { useTimeframeSelection } from "@/hooks/useTimeframeSelection";
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface MarketDataDetailProps {
  darkMode: boolean;
  selectedItemId: string | null;
  isOpen: boolean;
  isEditMode: boolean;
  onClose: () => void;
  onUpdate?: (item: MarketDataItem) => void;
}

const MarketDataDetail: React.FC<MarketDataDetailProps> = ({
  darkMode,
  selectedItemId,
  isOpen,
  isEditMode,
  onClose,
  onUpdate
}) => {
  const { toast } = useToast();
  const { timeframe } = useTimeframeSelection();
  const [data, setData] = useState<MarketDataItem | null>(null);
  const [chartData, setChartData] = useState<TimeframeData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedItemId && isOpen) {
      const selectedData = getMarketDataById(selectedItemId);
      if (selectedData) {
        setData(selectedData);
        
        // Load chart data for the selected item
        const chartData = getChartDataForSymbol(selectedData.symbol, timeframe);
        setChartData(chartData);
      }
    }
  }, [selectedItemId, isOpen, timeframe]);

  const handleSave = () => {
    if (!data) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedItem = updateMarketDataItem(data.id, data);
      
      if (updatedItem) {
        toast({
          title: "Market Data Updated",
          description: `${data.name} has been updated successfully`,
          duration: 3000,
        });
        
        if (onUpdate) {
          onUpdate(updatedItem);
        }
      } else {
        throw new Error("Failed to update item");
      }
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update market data",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!data) return null;

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Prepare data for the mini pie chart (sector comparison)
  const pieData = [
    { name: 'Value', value: data.value },
    { name: 'Change', value: Math.abs(data.change) },
    { name: 'Volume', value: data.volume ? data.volume / 1000000 : 0 }
  ];

  return (
    <DetailView
      title={isEditMode ? `Edit ${data.name}` : `View ${data.name}`}
      isOpen={isOpen}
      onClose={onClose}
      darkMode={darkMode}
      footerContent={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {isEditMode && (
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              readOnly={!isEditMode}
              className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
            />
          </div>
          <div>
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              value={data.symbol}
              onChange={(e) => setData({ ...data, symbol: e.target.value })}
              readOnly={!isEditMode}
              className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Type</Label>
            {isEditMode ? (
              <Select
                value={data.type}
                onValueChange={(value: 'stock' | 'crypto' | 'etf' | 'index' | 'commodity') => setData({ ...data, type: value })}
              >
                <SelectTrigger id="type" className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                  <SelectItem value="index">Index</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="etf">ETF</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="commodity">Commodity</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="type"
                value={data.type}
                readOnly
                className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
              />
            )}
          </div>
          <div>
            <Label htmlFor="value">Current Value</Label>
            <Input
              id="value"
              type="number"
              value={data.value}
              onChange={(e) => setData({ ...data, value: parseFloat(e.target.value) || 0 })}
              readOnly={!isEditMode}
              className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="change">Change</Label>
            <Input
              id="change"
              type="number"
              value={data.change}
              onChange={(e) => {
                const newChange = parseFloat(e.target.value) || 0;
                const direction = newChange >= 0 ? "up" : "down";
                setData({ 
                  ...data, 
                  change: newChange,
                  direction
                });
              }}
              readOnly={!isEditMode}
              className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
            />
          </div>
          <div>
            <Label htmlFor="percentChange">Percent Change</Label>
            <Input
              id="percentChange"
              type="number"
              value={data.percentChange}
              onChange={(e) => setData({ ...data, percentChange: parseFloat(e.target.value) || 0 })}
              readOnly={!isEditMode}
              className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
            />
          </div>
          <div>
            <Label htmlFor="direction">Direction</Label>
            {isEditMode ? (
              <Select
                value={data.direction}
                onValueChange={(value: "up" | "down") => setData({ ...data, direction: value })}
              >
                <SelectTrigger id="direction" className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                  <SelectItem value="up">Up</SelectItem>
                  <SelectItem value="down">Down</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="direction"
                value={data.direction === "up" ? "Up" : "Down"}
                readOnly
                className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
              />
            )}
          </div>
        </div>

        {isEditMode && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="marketCap">Market Cap</Label>
              <Input
                id="marketCap"
                type="number"
                value={data.marketCap || 0}
                onChange={(e) => setData({ ...data, marketCap: parseFloat(e.target.value) || 0 })}
                className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
              />
            </div>
            <div>
              <Label htmlFor="volume">Volume</Label>
              <Input
                id="volume"
                type="number"
                value={data.volume || 0}
                onChange={(e) => setData({ ...data, volume: parseFloat(e.target.value) || 0 })}
                className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
              />
            </div>
          </div>
        )}

        {isEditMode && (
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={data.description || ""}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
            />
          </div>
        )}

        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium mb-2">Historical Data ({timeframe})</h3>
            <div className="h-40 md:h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ccc"} />
                  <XAxis dataKey="time" stroke={darkMode ? "#ccc" : "#666"} />
                  <YAxis stroke={darkMode ? "#ccc" : "#666"} />
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
          <div>
            <h3 className="text-sm font-medium mb-2">Data Distribution</h3>
            <div className="h-40 md:h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => value.toLocaleString()}
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#333' : '#fff',
                      borderColor: darkMode ? '#555' : '#ccc',
                      color: darkMode ? '#fff' : '#333' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {data.description && !isEditMode && (
          <div className="pt-2">
            <h3 className="text-sm font-medium mb-1">Description</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{data.description}</p>
          </div>
        )}

        {!isEditMode && (
          <div className="pt-2 grid grid-cols-2 gap-4">
            {data.marketCap && (
              <div>
                <h3 className="text-sm font-medium mb-1">Market Cap</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ${(data.marketCap / 1000000000).toFixed(2)} B
                </p>
              </div>
            )}
            {data.volume && (
              <div>
                <h3 className="text-sm font-medium mb-1">Volume</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(data.volume / 1000000).toFixed(2)} M
                </p>
              </div>
            )}
          </div>
        )}

        {!isEditMode && (
          <div className="pt-2">
            <h3 className="text-sm font-medium mb-1">Last Updated</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {data.lastUpdated 
                ? new Date(data.lastUpdated).toLocaleString() 
                : new Date().toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </DetailView>
  );
};

export default MarketDataDetail;
