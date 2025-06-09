
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUI } from "@/contexts/UIContext";
import { useVoiceTrainer } from "@/contexts/VoiceTrainerContext";
import { cn } from "@/lib/utils";

interface AddMarketDataFormProps {
  darkMode: boolean;
  onAdd: (item: any) => void;
  onCancel: () => void;
}

const AddMarketDataForm: React.FC<AddMarketDataFormProps> = ({ darkMode, onAdd, onCancel }) => {
  const { handleAction } = useUI();
  const { announceAction, announceSuccess, announceError } = useVoiceTrainer();
  
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    type: '',
    sector: '',
    price: '',
    change: '',
    volume: '',
    marketCap: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Symbol is required';
    } else if (!/^[A-Z]{1,5}$/.test(formData.symbol.toUpperCase())) {
      newErrors.symbol = 'Symbol must be 1-5 uppercase letters';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Asset type is required';
    }
    
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (formData.volume && (isNaN(Number(formData.volume)) || Number(formData.volume) < 0)) {
      newErrors.volume = 'Volume must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      announceError('Please correct the form errors');
      return;
    }
    
    setIsSubmitting(true);
    announceAction('Adding new market data item');
    
    try {
      const newItem = {
        id: Date.now().toString(),
        symbol: formData.symbol.toUpperCase(),
        name: formData.name,
        type: formData.type,
        sector: formData.sector || 'Technology',
        price: parseFloat(formData.price),
        change: parseFloat(formData.change) || 0,
        changePercent: formData.change ? (parseFloat(formData.change) / parseFloat(formData.price)) * 100 : 0,
        volume: formData.volume ? parseInt(formData.volume) : Math.floor(Math.random() * 10000000),
        marketCap: formData.marketCap || 'N/A',
        lastUpdate: new Date().toISOString()
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onAdd(newItem);
      handleAction('add', 'market data item', newItem.id, newItem);
      announceSuccess(`Added ${newItem.symbol} to market data`);
      
      // Reset form
      setFormData({
        symbol: '',
        name: '',
        type: '',
        sector: '',
        price: '',
        change: '',
        volume: '',
        marketCap: ''
      });
      
    } catch (error) {
      console.error('Error adding market data:', error);
      announceError('Failed to add market data item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200")}>
      <CardHeader>
        <CardTitle className={cn("text-xl font-semibold", darkMode ? "text-white" : "text-black")}>
          Add Market Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-field">
              <Label htmlFor="symbol" className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>
                Symbol *
              </Label>
              <Input
                id="symbol"
                type="text"
                value={formData.symbol}
                onChange={(e) => handleInputChange('symbol', e.target.value)}
                placeholder="AAPL"
                className={cn(
                  "mt-1",
                  darkMode ? "bg-zinc-700 border-zinc-600 text-white" : "bg-white border-gray-300",
                  errors.symbol ? "border-red-500" : ""
                )}
                maxLength={5}
              />
              {errors.symbol && (
                <span className="form-error text-red-500 text-xs mt-1">{errors.symbol}</span>
              )}
            </div>
            
            <div className="form-field">
              <Label htmlFor="name" className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>
                Company Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Apple Inc."
                className={cn(
                  "mt-1",
                  darkMode ? "bg-zinc-700 border-zinc-600 text-white" : "bg-white border-gray-300",
                  errors.name ? "border-red-500" : ""
                )}
              />
              {errors.name && (
                <span className="form-error text-red-500 text-xs mt-1">{errors.name}</span>
              )}
            </div>
            
            <div className="form-field">
              <Label htmlFor="type" className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>
                Asset Type *
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className={cn(
                  "mt-1",
                  darkMode ? "bg-zinc-700 border-zinc-600 text-white" : "bg-white border-gray-300",
                  errors.type ? "border-red-500" : ""
                )}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="etf">ETF</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="index">Index</SelectItem>
                  <SelectItem value="commodity">Commodity</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <span className="form-error text-red-500 text-xs mt-1">{errors.type}</span>
              )}
            </div>
            
            <div className="form-field">
              <Label htmlFor="sector" className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>
                Sector
              </Label>
              <Select value={formData.sector} onValueChange={(value) => handleInputChange('sector', value)}>
                <SelectTrigger className={cn("mt-1", darkMode ? "bg-zinc-700 border-zinc-600 text-white" : "bg-white border-gray-300")}>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Energy">Energy</SelectItem>
                  <SelectItem value="Consumer">Consumer</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="form-field">
              <Label htmlFor="price" className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>
                Price ($) *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="150.00"
                className={cn(
                  "mt-1",
                  darkMode ? "bg-zinc-700 border-zinc-600 text-white" : "bg-white border-gray-300",
                  errors.price ? "border-red-500" : ""
                )}
              />
              {errors.price && (
                <span className="form-error text-red-500 text-xs mt-1">{errors.price}</span>
              )}
            </div>
            
            <div className="form-field">
              <Label htmlFor="change" className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>
                Daily Change ($)
              </Label>
              <Input
                id="change"
                type="number"
                step="0.01"
                value={formData.change}
                onChange={(e) => handleInputChange('change', e.target.value)}
                placeholder="2.50"
                className={cn("mt-1", darkMode ? "bg-zinc-700 border-zinc-600 text-white" : "bg-white border-gray-300")}
              />
            </div>
            
            <div className="form-field">
              <Label htmlFor="volume" className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>
                Volume
              </Label>
              <Input
                id="volume"
                type="number"
                min="0"
                value={formData.volume}
                onChange={(e) => handleInputChange('volume', e.target.value)}
                placeholder="1000000"
                className={cn(
                  "mt-1",
                  darkMode ? "bg-zinc-700 border-zinc-600 text-white" : "bg-white border-gray-300",
                  errors.volume ? "border-red-500" : ""
                )}
              />
              {errors.volume && (
                <span className="form-error text-red-500 text-xs mt-1">{errors.volume}</span>
              )}
            </div>
            
            <div className="form-field">
              <Label htmlFor="marketCap" className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>
                Market Cap
              </Label>
              <Input
                id="marketCap"
                type="text"
                value={formData.marketCap}
                onChange={(e) => handleInputChange('marketCap', e.target.value)}
                placeholder="2.5T"
                className={cn("mt-1", darkMode ? "bg-zinc-700 border-zinc-600 text-white" : "bg-white border-gray-300")}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className={cn("px-6", darkMode ? "border-zinc-600 text-gray-300 hover:bg-zinc-700" : "")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6"
            >
              {isSubmitting ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddMarketDataForm;
