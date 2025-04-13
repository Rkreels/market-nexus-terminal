
import React, { useState, useEffect } from "react";
import { useUI } from "@/contexts/UIContext";
import DetailView from "@/components/DetailView";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getChartData } from "@/services/mockDataService";

interface MarketDataDetailProps {
  darkMode: boolean;
  selectedItemId: string | null;
  isOpen: boolean;
  isEditMode: boolean;
  onClose: () => void;
}

interface MarketDataEntry {
  id: string;
  name: string;
  symbol: string;
  type: string;
  value: number;
  change: number;
  percentChange: number;
  direction: "up" | "down";
}

const MarketDataDetail: React.FC<MarketDataDetailProps> = ({
  darkMode,
  selectedItemId,
  isOpen,
  isEditMode,
  onClose,
}) => {
  const { toast } = useToast();
  const { activeTimeframe } = useUI();
  const [data, setData] = useState<MarketDataEntry | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  // Mock market data list to find the selected item
  const marketData = [
    { 
      id: "sp500",
      name: "S&P 500", 
      symbol: "SPX",
      type: "Index",
      value: 4892.17, 
      change: 15.28, 
      percentChange: 0.31, 
      direction: "up" as "up" | "down"
    },
    { 
      id: "dow",
      name: "Dow Jones", 
      symbol: "DJI",
      type: "Index",
      value: 38671.69, 
      change: 134.22, 
      percentChange: 0.35, 
      direction: "up" as "up" | "down"
    },
    { 
      id: "nasdaq",
      name: "NASDAQ", 
      symbol: "COMP",
      type: "Index",
      value: 15461.84, 
      change: -3.25, 
      percentChange: -0.02, 
      direction: "down" as "up" | "down"
    },
    { 
      id: "russell",
      name: "Russell 2000", 
      symbol: "RUT",
      type: "Index",
      value: 1998.32, 
      change: 12.07, 
      percentChange: 0.61, 
      direction: "up" as "up" | "down"
    }
  ];

  useEffect(() => {
    if (selectedItemId && isOpen) {
      const selectedData = marketData.find(item => item.id === selectedItemId);
      if (selectedData) {
        setData(selectedData as MarketDataEntry);
        // Load chart data for the selected item
        const chartData = getChartData(selectedData.symbol, activeTimeframe);
        setChartData(chartData);
      }
    }
  }, [selectedItemId, isOpen, activeTimeframe]);

  const handleSave = () => {
    if (data) {
      toast({
        title: `${isEditMode ? "Updated" : "Viewed"} Market Data`,
        description: `${data.name} has been ${isEditMode ? "updated" : "viewed"} successfully`,
        duration: 3000,
      });
      onClose();
    }
  };

  if (!data) return null;

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
            <Button onClick={handleSave}>
              Save Changes
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
                onValueChange={(value) => setData({ ...data, type: value })}
              >
                <SelectTrigger id="type" className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                  <SelectItem value="Index">Index</SelectItem>
                  <SelectItem value="Stock">Stock</SelectItem>
                  <SelectItem value="ETF">ETF</SelectItem>
                  <SelectItem value="Crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="Forex">Forex</SelectItem>
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
              onChange={(e) => setData({ ...data, change: parseFloat(e.target.value) || 0 })}
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

        <div className="pt-4">
          <h3 className="text-sm font-medium mb-2">Historical Data ({activeTimeframe})</h3>
          <div className={`p-4 rounded-md ${darkMode ? "bg-zinc-700" : "bg-gray-100"}`}>
            <pre className="text-xs overflow-auto max-h-40">
              {JSON.stringify(chartData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </DetailView>
  );
};

export default MarketDataDetail;
