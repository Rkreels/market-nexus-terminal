
import { FC, useState, useEffect } from "react";
import { 
  LineChartIcon, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Filter, 
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUI } from "@/contexts/UIContext";
import TimeframeSelector from "@/components/TimeframeSelector";
import { useTimeframeSelection } from "@/hooks/useTimeframeSelection";
import FilterPanel from "@/components/FilterPanel";
import { useDetailView } from "@/hooks/useDetailView";
import MarketDataDetail from "@/components/panels/MarketDataDetail";
import AddMarketDataForm from "@/components/panels/AddMarketDataForm";
import DeleteMarketDataDialog from "@/components/panels/DeleteMarketDataDialog";
import { 
  getAllMarketData, 
  getFilteredMarketData, 
  getChartDataForSymbol,
  deleteMarketDataItem
} from "@/services/marketDataService";
import { MarketDataItem } from "@/types/marketData";

interface MarketDataPanelProps {
  darkMode: boolean;
}

const MarketDataPanel: FC<MarketDataPanelProps> = ({ darkMode }) => {
  const [marketIndexes, setMarketIndexes] = useState<MarketDataItem[]>([]);
  const [filteredData, setFilteredData] = useState<MarketDataItem[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const [selectedIndexName, setSelectedIndexName] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { handleAction } = useUI();
  const { timeframe, handleTimeframeChange } = useTimeframeSelection();

  // Load all market data
  useEffect(() => {
    const data = getAllMarketData();
    setMarketIndexes(data);
    setFilteredData(data);
  }, []);

  // Update chart data when timeframe or selected index changes
  useEffect(() => {
    if (selectedIndex) {
      const selectedItem = marketIndexes.find(item => item.id === selectedIndex);
      if (selectedItem) {
        const data = getChartDataForSymbol(selectedItem.symbol, timeframe);
        setChartData(data);
      }
    } else if (marketIndexes.length > 0) {
      // Default to first item if none selected
      const data = getChartDataForSymbol(marketIndexes[0].symbol, timeframe);
      setChartData(data);
    }
  }, [timeframe, selectedIndex, marketIndexes]);

  // Setup detail view hooks
  const {
    isDetailOpen,
    isEditMode,
    isDeleteDialogOpen,
    selectedItemId,
    viewItem,
    editItem,
    closeDetail,
    confirmDelete,
    cancelDelete,
    handleDelete: processDelete
  } = useDetailView({
    onViewItem: (id) => {
      const index = marketIndexes.find(idx => idx.id === id);
      if (index) {
        setSelectedIndexName(index.name);
      }
    },
    onEditItem: (id) => {
      const index = marketIndexes.find(idx => idx.id === id);
      if (index) {
        setSelectedIndexName(index.name);
      }
    },
    onDeleteItem: () => {
      toast({
        title: "Market Data Deleted",
        description: `${selectedIndexName} has been deleted successfully`,
        duration: 3000,
      });
      
      // Refresh the data after deletion
      const updatedData = getAllMarketData();
      setMarketIndexes(updatedData);
      setFilteredData(updatedData);
      
      // Clear selection if the deleted item was selected
      if (selectedIndex === selectedItemId) {
        setSelectedIndex(null);
      }
    }
  });

  const handleIndexSelect = (index: MarketDataItem) => {
    setSelectedIndex(index.id);
    toast({
      title: `${index.name} Selected`,
      description: "View detailed information for this index",
      duration: 2000,
    });
  };

  const handleActionClick = (action: string, id: string) => {
    switch (action) {
      case 'view':
        viewItem(id);
        break;
      case 'edit':
        editItem(id);
        break;
      case 'delete':
        confirmDelete(id);
        break;
      case 'add':
        setIsAddDialogOpen(true);
        break;
      default:
        break;
    }
  };
  
  const handleDeleteConfirm = (id: string) => {
    deleteMarketDataItem(id);
    processDelete(id);
  };
  
  const handleAddSuccess = (newItem: MarketDataItem) => {
    const updatedData = getAllMarketData();
    setMarketIndexes(updatedData);
    setFilteredData(updatedData);
    toast({
      title: "Market Data Added",
      description: `${newItem.name} has been added successfully`,
      duration: 3000,
    });
  };
  
  const handleUpdateSuccess = (updatedItem: MarketDataItem) => {
    const updatedData = getAllMarketData();
    setMarketIndexes(updatedData);
    setFilteredData(updatedData);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredData(marketIndexes);
    } else {
      const filtered = getFilteredMarketData({ search: query });
      setFilteredData(filtered);
    }
  };
  
  const handleApplyFilters = (filters: any) => {
    const filtered = getFilteredMarketData({
      search: filters.searchTerm,
      type: filters.type,
      category: filters.category
    });
    
    setFilteredData(filtered);
    
    toast({
      title: "Filters Applied",
      description: `Found ${filtered.length} items matching your filters`,
      duration: 3000,
    });
  };

  return (
    <div className={cn("rounded-lg overflow-hidden shadow-md", 
      darkMode ? "bg-zinc-800 border border-zinc-700" : "bg-white border border-gray-200"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <LineChartIcon className={cn("w-5 h-5 mr-2", darkMode ? "text-blue-400" : "text-blue-600")} />
          <h3 className="font-medium">Market Overview</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className={cn(
                "pl-8 h-9 w-[150px] md:w-[200px]", 
                darkMode ? "bg-zinc-700 border-zinc-600" : ""
              )}
            />
          </div>
          <div className={cn("text-xs px-2 py-1 rounded", 
            darkMode ? "bg-zinc-700 text-zinc-300" : "bg-gray-100 text-gray-700"
          )}>
            Live
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className={cn("h-8 w-8", isFilterOpen ? (darkMode ? "bg-blue-800/50" : "bg-blue-100") : "")} 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => handleActionClick('add', '')}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {filteredData.map((index) => (
          <div 
            key={index.id} 
            className={cn("p-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-colors", 
              selectedIndex === index.id 
                ? (darkMode ? "bg-blue-800/30 border border-blue-700" : "bg-blue-50 border border-blue-200") 
                : (darkMode ? "bg-zinc-700 hover:bg-zinc-600" : "bg-gray-50 hover:bg-gray-100")
            )}
            onClick={() => handleIndexSelect(index)}
          >
            <div className="flex justify-between items-start">
              <div className="text-sm font-medium mb-1">{index.name}</div>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick('view', index.id);
                  }}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick('edit', index.id);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick('delete', index.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-lg font-semibold">{index.value.toLocaleString()}</div>
              <div className={cn("flex items-center text-sm", 
                index.direction === "up" ? "text-green-500" : "text-red-500"
              )}>
                {index.direction === "up" ? (
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-1" />
                )}
                {index.percentChange.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      <TimeframeSelector 
        darkMode={darkMode} 
        activeTimeframe={timeframe} 
        onTimeframeChange={handleTimeframeChange} 
      />
      
      <div className="p-4 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ccc"} />
            <XAxis 
              dataKey="time" 
              stroke={darkMode ? "#ccc" : "#666"} 
            />
            <YAxis 
              stroke={darkMode ? "#ccc" : "#666"} 
              domain={['dataMin - 10', 'dataMax + 10']} 
            />
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

      <MarketDataDetail
        darkMode={darkMode}
        selectedItemId={selectedItemId}
        isOpen={isDetailOpen}
        isEditMode={isEditMode}
        onClose={closeDetail}
        onUpdate={handleUpdateSuccess}
      />

      <AddMarketDataForm
        darkMode={darkMode}
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <DeleteMarketDataDialog
        darkMode={darkMode}
        isOpen={isDeleteDialogOpen}
        onClose={cancelDelete}
        onDelete={() => handleDeleteConfirm(selectedItemId || "")}
        itemName={selectedIndexName}
      />

      <FilterPanel 
        darkMode={darkMode} 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        filterOptions={{
          categories: ["Multi-Sector", "Technology", "Healthcare", "Financials", "Energy", "Consumer", "Cryptocurrency"],
          types: ["Index", "Stock", "ETF", "Forex", "Crypto", "Commodity"],
          dates: true,
          search: true,
          price: true
        }} 
      />
    </div>
  );
};

export default MarketDataPanel;
