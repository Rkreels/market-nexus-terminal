
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MarketDataItem } from '@/types/marketData';
import { cn } from '@/lib/utils';

interface AddMarketDataFormProps {
  darkMode: boolean;
  onSuccess: (item: MarketDataItem) => void;
  onCancel: () => void;
  initialData?: MarketDataItem;
}

const AddMarketDataForm: React.FC<AddMarketDataFormProps> = ({ 
  darkMode, 
  onSuccess, 
  onCancel, 
  initialData 
}) => {
  const [formData, setFormData] = useState({
    symbol: initialData?.symbol || '',
    name: initialData?.name || '',
    type: initialData?.type || 'stock',
    value: initialData?.value || 0,
    change: initialData?.change || 0,
    percentChange: initialData?.percentChange || 0,
    direction: initialData?.direction || 'up',
    sector: initialData?.sector || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  console.log('AddMarketDataForm: Form data', formData);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Symbol is required';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.value <= 0) {
      newErrors.value = 'Value must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newItem: MarketDataItem = {
      id: initialData?.id || `${formData.symbol}-${Date.now()}`,
      ...formData,
      lastUpdated: new Date().toISOString()
    };

    onSuccess(newItem);
  };

  const handleInputChange = (field: string, value: any) => {
    console.log('AddMarketDataForm: Input change', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Define valid options with strict filtering to ensure no empty values
  const typeOptions = [
    'stock',
    'crypto', 
    'index',
    'commodity',
    'forex'
  ].filter(option => {
    const isValid = option && typeof option === 'string' && option.trim().length > 0;
    console.log(`AddMarketDataForm: Type option "${option}" is valid:`, isValid);
    return isValid;
  });

  const directionOptions = [
    'up',
    'down'
  ].filter(option => {
    const isValid = option && typeof option === 'string' && option.trim().length > 0;
    console.log(`AddMarketDataForm: Direction option "${option}" is valid:`, isValid);
    return isValid;
  });

  console.log('AddMarketDataForm: Final type options:', typeOptions);
  console.log('AddMarketDataForm: Final direction options:', directionOptions);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="symbol">Symbol *</Label>
          <Input
            id="symbol"
            value={formData.symbol}
            onChange={(e) => handleInputChange('symbol', e.target.value)}
            placeholder="e.g., AAPL"
            className={cn(
              darkMode ? "bg-zinc-700 border-zinc-600" : "",
              errors.symbol && "border-red-500"
            )}
          />
          {errors.symbol && <p className="text-red-500 text-sm mt-1">{errors.symbol}</p>}
        </div>
        
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Apple Inc."
            className={cn(
              darkMode ? "bg-zinc-700 border-zinc-600" : "",
              errors.name && "border-red-500"
            )}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
            <SelectTrigger className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.length > 0 ? (
                typeOptions.map((option, index) => {
                  console.log(`AddMarketDataForm: Rendering type option "${option}" with key "${option}-${index}"`);
                  return (
                    <SelectItem key={`type-${option}-${index}`} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  );
                })
              ) : (
                <SelectItem value="fallback-stock" disabled>
                  Stock (fallback)
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="sector">Sector</Label>
          <Input
            id="sector"
            value={formData.sector}
            onChange={(e) => handleInputChange('sector', e.target.value)}
            placeholder="e.g., Technology"
            className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="value">Value *</Label>
          <Input
            id="value"
            type="number"
            step="0.01"
            value={formData.value}
            onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={cn(
              darkMode ? "bg-zinc-700 border-zinc-600" : "",
              errors.value && "border-red-500"
            )}
          />
          {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value}</p>}
        </div>
        
        <div>
          <Label htmlFor="change">Change</Label>
          <Input
            id="change"
            type="number"
            step="0.01"
            value={formData.change}
            onChange={(e) => handleInputChange('change', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
          />
        </div>
        
        <div>
          <Label htmlFor="percentChange">% Change</Label>
          <Input
            id="percentChange"
            type="number"
            step="0.01"
            value={formData.percentChange}
            onChange={(e) => handleInputChange('percentChange', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="direction">Direction</Label>
        <Select value={formData.direction} onValueChange={(value) => handleInputChange('direction', value)}>
          <SelectTrigger className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {directionOptions.length > 0 ? (
              directionOptions.map((option, index) => {
                console.log(`AddMarketDataForm: Rendering direction option "${option}" with key "${option}-${index}"`);
                return (
                  <SelectItem key={`direction-${option}-${index}`} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                );
              })
            ) : (
              <SelectItem value="fallback-up" disabled>
                Up (fallback)
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Add'} Item
        </Button>
      </div>
    </form>
  );
};

export default AddMarketDataForm;
