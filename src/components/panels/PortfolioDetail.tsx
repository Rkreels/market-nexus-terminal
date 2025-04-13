
import React, { useState, useEffect } from "react";
import { useUI } from "@/contexts/UIContext";
import DetailView from "@/components/DetailView";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getPortfolioHoldings, getChartData } from "@/services/mockDataService";

interface PortfolioDetailProps {
  darkMode: boolean;
  selectedItemId: string | null;
  isOpen: boolean;
  isEditMode: boolean;
  onClose: () => void;
}

interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  change: number;
  notes?: string;
}

const PortfolioDetail: React.FC<PortfolioDetailProps> = ({
  darkMode,
  selectedItemId,
  isOpen,
  isEditMode,
  onClose,
}) => {
  const { toast } = useToast();
  const { activeTimeframe } = useUI();
  const [holding, setHolding] = useState<PortfolioHolding | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [allHoldings, setAllHoldings] = useState<PortfolioHolding[]>([]);

  // Load all holdings
  useEffect(() => {
    // Convert the mock data to our extended format
    const holdings = getPortfolioHoldings().map(item => ({
      ...item,
      notes: `Investment notes for ${item.name}`
    }));
    setAllHoldings(holdings);
  }, []);

  // Load selected holding when ID changes
  useEffect(() => {
    if (selectedItemId && isOpen && allHoldings.length > 0) {
      const selectedHolding = allHoldings.find(item => item.id === selectedItemId);
      if (selectedHolding) {
        setHolding(selectedHolding);
        // Load chart data for the selected holding
        const chartData = getChartData(selectedHolding.symbol, activeTimeframe);
        setChartData(chartData);
      }
    }
  }, [selectedItemId, isOpen, allHoldings, activeTimeframe]);

  const handleSave = () => {
    if (holding) {
      toast({
        title: `${isEditMode ? "Updated" : "Viewed"} Portfolio Holding`,
        description: `${holding.name} (${holding.symbol}) has been ${isEditMode ? "updated" : "viewed"} successfully`,
        duration: 3000,
      });
      onClose();
    }
  };

  if (!holding) return null;

  return (
    <DetailView
      title={isEditMode ? `Edit Holding: ${holding.symbol}` : `Holding Details: ${holding.symbol}`}
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
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              value={holding.symbol}
              onChange={(e) => setHolding({ ...holding, symbol: e.target.value })}
              readOnly={!isEditMode}
              className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
            />
          </div>
          <div>
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              value={holding.name}
              onChange={(e) => setHolding({ ...holding, name: e.target.value })}
              readOnly={!isEditMode}
              className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="shares">Shares</Label>
            <Input
              id="shares"
              type="number"
              value={holding.shares}
              onChange={(e) => setHolding({ ...holding, shares: parseFloat(e.target.value) || 0 })}
              readOnly={!isEditMode}
              className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
            />
          </div>
          <div>
            <Label htmlFor="avgPrice">Average Price</Label>
            <Input
              id="avgPrice"
              type="number"
              value={holding.avgPrice}
              onChange={(e) => setHolding({ ...holding, avgPrice: parseFloat(e.target.value) || 0 })}
              readOnly={!isEditMode}
              className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentPrice">Current Price</Label>
            <Input
              id="currentPrice"
              type="number"
              value={holding.currentPrice}
              onChange={(e) => setHolding({ ...holding, currentPrice: parseFloat(e.target.value) || 0 })}
              readOnly={!isEditMode}
              className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
            />
          </div>
          <div>
            <Label htmlFor="value">Total Value</Label>
            <Input
              id="value"
              type="number"
              value={holding.value}
              readOnly
              className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={holding.notes || ""}
            onChange={(e) => setHolding({ ...holding, notes: e.target.value })}
            readOnly={!isEditMode}
            rows={4}
            className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
          />
        </div>

        <div className="pt-4">
          <h3 className="text-sm font-medium mb-2">Price Chart ({activeTimeframe})</h3>
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

export default PortfolioDetail;
