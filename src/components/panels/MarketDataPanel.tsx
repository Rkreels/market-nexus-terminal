import { FC, useState } from "react";
import { 
  PlusCircle, 
  Filter,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUI } from "@/contexts/UIContext";
import { MarketDataItem } from "@/types/marketData";
import AddMarketDataForm from "@/components/AddMarketDataForm";
import DataTable from "@/components/DataTable";
import FilterPanel from "@/components/FilterPanel";
import { useVoiceTrainer } from "@/contexts/VoiceTrainerContext";

interface MarketDataPanelProps {
  darkMode: boolean;
}

const MarketDataPanel: FC<MarketDataPanelProps> = ({ darkMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const { marketData, addMarketDataItem, deleteMarketDataItem, editMarketDataItem } = useUI();
  const { speak } = useVoiceTrainer();

  const applyFilters = (data: MarketDataItem[]) => {
    let filtered = [...data];
    
    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.symbol.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply additional filters
    if (appliedFilters.type && appliedFilters.type !== 'all') {
      filtered = filtered.filter(item => item.type === appliedFilters.type);
    }
    
    if (appliedFilters.category && appliedFilters.category !== 'all') {
      filtered = filtered.filter(item => item.sector === appliedFilters.category);
    }
    
    return filtered;
  };

  const filteredData = applyFilters(marketData);

  const handleAddItem = (item: MarketDataItem) => {
    try {
      addMarketDataItem(item);
      setIsAddItemDialogOpen(false);
      speak(`Successfully added ${item.name} to market data`, 'medium');
      console.log('Market Data: Successfully added new item', item);
    } catch (error) {
      console.error('Market Data: Error adding item', error);
      speak('Error adding market data item', 'high');
    }
  };

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    setIsFilterOpen(false);
    speak(`Applied filters to market data showing ${applyFilters(marketData).length} results`, 'medium');
    console.log('Market Data: Applied filters', filters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value) {
      const results = applyFilters(marketData);
      speak(`Search results: ${results.length} items found`, 'low');
    }
  };

  const handleFilterToggle = () => {
    const newState = !isFilterOpen;
    setIsFilterOpen(newState);
    speak(newState ? 'Filter panel opened' : 'Filter panel closed', 'medium');
  };

  const filterOptions = {
    search: true,
    categories: ["Technology", "Healthcare", "Finance", "Energy", "Cryptocurrency"],
    types: ["stock", "crypto", "index", "commodity", "forex"],
    status: ["active", "inactive"],
    dates: true,
    price: true,
    advanced: true
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
    },
    {
      key: 'symbol',
      header: 'Symbol',
    },
    {
      key: 'type',
      header: 'Type',
    },
    {
      key: 'value',
      header: 'Value',
      render: (value: number) => (
        <span>${value.toFixed(2)}</span>
      ),
    },
    {
      key: 'change',
      header: 'Change',
      render: (value: number, row: MarketDataItem) => (
        <span className={row.direction === "up" ? "text-green-500" : "text-red-500"}>
          {row.direction === "up" ? "+" : ""}{value.toFixed(2)} ({row.percentChange.toFixed(2)}%)
        </span>
      ),
    },
  ];

  return (
    <div className="relative">
      <Card 
        className={cn(
          "border", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}
        data-component="market-data-panel"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Market Data ({filteredData.length} items)
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleFilterToggle}
              className={cn(
                "filter-button",
                isFilterOpen && "bg-blue-100 dark:bg-blue-900"
              )}
              title="Open filter options"
            >
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
            <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  className="add-button"
                  title="Add new market data item"
                >
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className={cn(
                "w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto z-50", 
                darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
              )}>
                <DialogHeader>
                  <DialogTitle>Add New Market Data</DialogTitle>
                  <DialogDescription>
                    Add a new market data item to your dashboard.
                  </DialogDescription>
                </DialogHeader>
                <AddMarketDataForm 
                  darkMode={darkMode} 
                  onSuccess={handleAddItem} 
                  onCancel={() => setIsAddItemDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Input 
            className={cn(
              "mb-4 search-input",
              darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
            )}
            placeholder="Search symbols, company names, or asset types..." 
            value={searchQuery}
            onChange={handleSearchChange}
            title="Search market data by symbol or name"
          />
          <div className="chart-container">
            <DataTable 
              columns={columns} 
              data={filteredData} 
              darkMode={darkMode} 
              itemType="marketData"
            />
          </div>
        </CardContent>
      </Card>
      
      <FilterPanel 
        darkMode={darkMode}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        filterOptions={filterOptions}
      />
    </div>
  );
};

export default MarketDataPanel;
