
import { FC, useState } from "react";
import { WatchlistItem } from "@/types/marketData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddSymbolFormProps {
  onAddSymbol: (symbol: WatchlistItem) => void;
  onCancel: () => void;
  darkMode: boolean;
}

const AddSymbolForm: FC<AddSymbolFormProps> = ({ onAddSymbol, onCancel, darkMode }) => {
  const [symbol, setSymbol] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!symbol || !name || !price) {
      return;
    }
    
    // Construct the symbol object
    const newSymbol: WatchlistItem = {
      symbol: symbol.toUpperCase(),
      name,
      price: Number(price),
      change: (Math.random() * 5 * (Math.random() > 0.5 ? 1 : -1)).toFixed(2) as unknown as number,
      direction: Math.random() > 0.5 ? "up" : "down"
    };
    
    onAddSymbol(newSymbol);
  };

  return (
    <Card className={cn(
      "border shadow-lg", 
      darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
    )}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add Symbol to Watchlist
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
          
          <div className="space-y-2">
            <Label>Current Price</Label>
            <Input 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              placeholder="Enter current price" 
              type="number"
              min="0"
              step="0.01"
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
              <Plus className="w-4 h-4 mr-2" /> Add Symbol
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddSymbolForm;
