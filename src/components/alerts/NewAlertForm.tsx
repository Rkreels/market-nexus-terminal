
import { FC, useState } from "react";
import { Alert } from "@/types/marketData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  Bell, 
  X,
  Slash
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NewAlertFormProps {
  onAddAlert: (alert: Omit<Alert, 'id' | 'status' | 'created'>) => void;
  onCancel: () => void;
  darkMode: boolean;
}

const NewAlertForm: FC<NewAlertFormProps> = ({ onAddAlert, onCancel, darkMode }) => {
  const [alertType, setAlertType] = useState<string>("price");
  const [symbol, setSymbol] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [condition, setCondition] = useState<string>("above");
  const [value, setValue] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [details, setDetails] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!symbol || !name) {
      return;
    }
    
    // Construct the alert object based on type
    const newAlert: Omit<Alert, 'id' | 'status' | 'created'> = {
      type: alertType,
      symbol: symbol.toUpperCase(),
      name,
    };
    
    if (alertType === "price" || alertType === "volume") {
      newAlert.condition = condition;
      newAlert.value = Number(value);
      // Mock current value
      newAlert.currentValue = Number(value) * (Math.random() > 0.5 ? 0.95 : 1.05);
    } else if (alertType === "news") {
      newAlert.keyword = keyword;
    } else if (alertType === "earnings") {
      newAlert.details = details;
    }
    
    onAddAlert(newAlert);
  };

  // Static valid options - ensuring no empty strings or invalid values
  const alertTypeOptions = [
    { value: 'price', label: 'Price Alert' },
    { value: 'volume', label: 'Volume Alert' },
    { value: 'news', label: 'News Alert' },
    { value: 'earnings', label: 'Earnings Alert' }
  ].filter(option => option.value && option.value.trim() !== "");

  const conditionOptions = [
    { value: 'above', label: 'Above' },
    { value: 'below', label: 'Below' },
    { value: 'equal', label: 'Equal to' }
  ].filter(option => option.value && option.value.trim() !== "");

  return (
    <Card className={cn(
      "border shadow-lg", 
      darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
    )}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Create New Alert
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Alert Type</Label>
              <Select value={alertType} onValueChange={setAlertType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select alert type" />
                </SelectTrigger>
                <SelectContent>
                  {alertTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Symbol</Label>
              <Input 
                value={symbol} 
                onChange={(e) => {
                  setSymbol(e.target.value);
                  // Auto-populate name based on common stocks
                  const symbolMap: Record<string, string> = {
                    'AAPL': 'Apple Inc.',
                    'MSFT': 'Microsoft Corp.',
                    'GOOGL': 'Alphabet Inc.',
                    'AMZN': 'Amazon.com Inc.',
                    'META': 'Meta Platforms Inc.',
                    'TSLA': 'Tesla Inc.',
                    'NVDA': 'NVIDIA Corp.'
                  };
                  
                  if (symbolMap[e.target.value.toUpperCase()]) {
                    setName(symbolMap[e.target.value.toUpperCase()]);
                  }
                }} 
                placeholder="Enter stock symbol" 
                className={cn(
                  darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                )}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter company name" 
              className={cn(
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
              )}
            />
          </div>
          
          {(alertType === "price" || alertType === "volume") && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Condition</Label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>{alertType === "price" ? "Price" : "Volume"}</Label>
                <Input 
                  value={value} 
                  onChange={(e) => setValue(e.target.value)} 
                  placeholder={`Enter target ${alertType}`} 
                  type="number"
                  min="0"
                  step={alertType === "price" ? "0.01" : "1"}
                  className={cn(
                    darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                  )}
                />
              </div>
            </div>
          )}
          
          {alertType === "news" && (
            <div className="space-y-2">
              <Label>Keyword</Label>
              <Input 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)} 
                placeholder="Enter keyword to track in news" 
                className={cn(
                  darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                )}
              />
            </div>
          )}
          
          {alertType === "earnings" && (
            <div className="space-y-2">
              <Label>Details</Label>
              <Input 
                value={details} 
                onChange={(e) => setDetails(e.target.value)} 
                placeholder="Enter earnings details" 
                className={cn(
                  darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
                )}
              />
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className={cn(
                darkMode ? "border-zinc-600 hover:bg-zinc-700" : ""
              )}
            >
              <Slash className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button type="submit">
              <Bell className="w-4 h-4 mr-2" /> Create Alert
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewAlertForm;
