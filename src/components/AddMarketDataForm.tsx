
import { FC, useState } from "react";
import { MarketDataItem } from "@/types/marketData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddMarketDataFormProps {
  darkMode: boolean;
  onSuccess: (data: MarketDataItem) => void;
  onCancel: () => void;
}

const AddMarketDataForm: FC<AddMarketDataFormProps> = ({ onSuccess, onCancel, darkMode }) => {
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    type: "stock",
    value: 0,
    volume: 0,
    direction: "up" as "up" | "down",
    description: "",
    sector: "",
    marketCap: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "value" || name === "volume" || name === "marketCap") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Random change values
    const change = (Math.random() * 5 * (Math.random() > 0.5 ? 1 : -1));
    const percentChange = change / (formData.value / 100);
    
    // Required properties for MarketDataItem
    const newData: MarketDataItem = {
      id: formData.symbol, // Using symbol as a unique ID
      symbol: formData.symbol,
      type: formData.type,
      name: formData.name,
      value: formData.value,
      change: parseFloat(change.toFixed(2)),
      percentChange: parseFloat(percentChange.toFixed(2)),
      direction: formData.direction,
      lastUpdated: new Date().toISOString(),
      description: formData.description,
      sector: formData.sector,
      marketCap: formData.marketCap,
      volume: formData.volume
    };
    
    onSuccess(newData);
  };

  return (
    <Card className={cn(
      "border shadow-lg", 
      darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
    )}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add Market Data
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Symbol</Label>
            <Input 
              name="symbol"
              value={formData.symbol} 
              onChange={handleInputChange} 
              placeholder="Enter symbol" 
              className={cn(
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
              )}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Name</Label>
            <Input 
              name="name"
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="Enter name" 
              className={cn(
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
              )}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Type</Label>
            <Select 
              name="type" 
              value={formData.type} 
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger className={cn(
                "w-full",
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
              )}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stock">Stock</SelectItem>
                <SelectItem value="crypto">Crypto</SelectItem>
                <SelectItem value="forex">Forex</SelectItem>
                <SelectItem value="index">Index</SelectItem>
                <SelectItem value="commodity">Commodity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Value</Label>
            <Input 
              name="value"
              value={formData.value.toString()} 
              onChange={handleInputChange} 
              placeholder="Enter value" 
              type="number"
              step="0.01"
              className={cn(
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Volume</Label>
            <Input 
              name="volume"
              value={formData.volume.toString()} 
              onChange={handleInputChange} 
              placeholder="Enter volume" 
              type="number"
              className={cn(
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Direction</Label>
            <Select 
              value={formData.direction} 
              onValueChange={(value) => handleSelectChange('direction', value as "up" | "down")}
            >
              <SelectTrigger className={cn(
                "w-full",
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
              )}>
                <SelectValue placeholder="Select direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="up">Up</SelectItem>
                <SelectItem value="down">Down</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              className={cn(
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Sector</Label>
            <Input
              name="sector"
              value={formData.sector}
              onChange={handleInputChange}
              placeholder="Enter sector"
              className={cn(
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Market Cap</Label>
            <Input
              name="marketCap"
              value={formData.marketCap.toString()}
              onChange={handleInputChange}
              placeholder="Enter market cap"
              type="number"
              className={cn(
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
              )}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className={cn(
                darkMode ? "border-zinc-600 hover:bg-zinc-700" : ""
              )}
            >
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" /> Add Data
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddMarketDataForm;
