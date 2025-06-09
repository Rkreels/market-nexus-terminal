
import { FC, useState, useEffect } from "react";
import { MarketDataItem } from "@/types/marketData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoiceTrainer } from "@/contexts/VoiceTrainerContext";

interface AddMarketDataFormProps {
  darkMode: boolean;
  onSuccess: (data: MarketDataItem) => void;
  onCancel: () => void;
  initialData?: MarketDataItem;
}

const AddMarketDataForm: FC<AddMarketDataFormProps> = ({ 
  onSuccess, 
  onCancel, 
  darkMode, 
  initialData 
}) => {
  const { announceAction, announceError } = useVoiceTrainer();
  const isEditing = !!initialData;
  
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        symbol: initialData.symbol || "",
        name: initialData.name || "",
        type: initialData.type || "stock",
        value: initialData.value || 0,
        volume: initialData.volume || 0,
        direction: initialData.direction || "up",
        description: initialData.description || "",
        sector: initialData.sector || "",
        marketCap: initialData.marketCap || 0
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.symbol.trim()) {
      newErrors.symbol = "Symbol is required";
    }
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (formData.value <= 0) {
      newErrors.value = "Value must be greater than 0";
    }
    
    if (formData.volume < 0) {
      newErrors.volume = "Volume cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      announceError("Please fix form errors before submitting");
      return;
    }
    
    try {
      const change = isEditing ? 
        (initialData?.change || 0) : 
        (Math.random() * 5 * (Math.random() > 0.5 ? 1 : -1));
      const percentChange = isEditing ? 
        (initialData?.percentChange || 0) : 
        change / (formData.value / 100);
      
      const dataToSubmit: MarketDataItem = {
        id: initialData?.id || formData.symbol,
        symbol: formData.symbol.toUpperCase(),
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
      
      onSuccess(dataToSubmit);
      announceAction(isEditing ? 'Updated' : 'Added', `market data for ${formData.name}`);
    } catch (error) {
      console.error('Form submission error:', error);
      announceError('Error submitting form');
    }
  };

  return (
    <Card className={cn(
      "border shadow-lg", 
      darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
    )}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center">
          {isEditing ? <Edit className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {isEditing ? 'Edit Market Data' : 'Add Market Data'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol *</Label>
              <Input 
                id="symbol"
                name="symbol"
                value={formData.symbol} 
                onChange={handleInputChange} 
                placeholder="e.g., AAPL" 
                className={cn(
                  darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300",
                  errors.symbol && "border-red-500"
                )}
                maxLength={10}
              />
              {errors.symbol && <p className="text-sm text-red-500">{errors.symbol}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                name="type" 
                value={formData.type} 
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger 
                  id="type"
                  className={cn(
                    "w-full",
                    darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                  )}
                >
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input 
              id="name"
              name="name"
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="e.g., Apple Inc." 
              className={cn(
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300",
                errors.name && "border-red-500"
              )}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Value *</Label>
              <Input 
                id="value"
                name="value"
                value={formData.value.toString()} 
                onChange={handleInputChange} 
                placeholder="0.00" 
                type="number"
                step="0.01"
                min="0"
                className={cn(
                  darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300",
                  errors.value && "border-red-500"
                )}
              />
              {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume">Volume</Label>
              <Input 
                id="volume"
                name="volume"
                value={formData.volume.toString()} 
                onChange={handleInputChange} 
                placeholder="0" 
                type="number"
                min="0"
                className={cn(
                  darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300",
                  errors.volume && "border-red-500"
                )}
              />
              {errors.volume && <p className="text-sm text-red-500">{errors.volume}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="direction">Direction</Label>
              <Select 
                value={formData.direction} 
                onValueChange={(value) => handleSelectChange('direction', value as "up" | "down")}
              >
                <SelectTrigger 
                  id="direction"
                  className={cn(
                    "w-full",
                    darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                  )}
                >
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="up">Up ↗</SelectItem>
                  <SelectItem value="down">Down ↘</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Select 
                value={formData.sector} 
                onValueChange={(value) => handleSelectChange('sector', value)}
              >
                <SelectTrigger 
                  id="sector"
                  className={cn(
                    "w-full",
                    darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                  )}
                >
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Select sector</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Energy">Energy</SelectItem>
                  <SelectItem value="Cryptocurrency">Cryptocurrency</SelectItem>
                  <SelectItem value="Consumer">Consumer</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketCap">Market Cap</Label>
            <Input
              id="marketCap"
              name="marketCap"
              value={formData.marketCap.toString()}
              onChange={handleInputChange}
              placeholder="0"
              type="number"
              min="0"
              className={cn(
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
              )}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional description..."
              rows={3}
              className={cn(
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
              )}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
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
              {isEditing ? (
                <>
                  <Edit className="w-4 h-4 mr-2" /> Update Data
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" /> Add Data
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddMarketDataForm;
