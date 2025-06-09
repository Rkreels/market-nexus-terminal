import { FC, useState } from "react";
import { 
  PlusCircle, 
  Filter,
  Bell,
  RefreshCw,
  Settings,
  Download,
  Search
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUI } from "@/contexts/UIContext";
import { MarketDataItem } from "@/types/marketData";
import AddMarketDataForm from "@/components/AddMarketDataForm";
import DataTable from "@/components/DataTable";
import FilterPanel from "@/components/FilterPanel";
import { useVoiceTrainer } from "@/contexts/VoiceTrainerContext";
import { useToast } from "@/hooks/use-toast";

interface MarketDataPanelProps {
  darkMode: boolean;
}

const MarketDataPanel: FC<MarketDataPanelProps> = ({ darkMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [selectedItem, setSelectedItem] = useState<MarketDataItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<MarketDataItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { marketData, addMarketDataItem, deleteMarketDataItem, editMarketDataItem } = useUI();
  const { announceAction, announceSuccess, announceError } = useVoiceTrainer();
  const { toast } = useToast();

  console.log('MarketDataPanel: Market data', marketData);
  console.log('MarketDataPanel: Applied filters', appliedFilters);

  const applyFilters = (data: MarketDataItem[]) => {
    let filtered = [...data];
    
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.symbol.toLowerCase().includes(searchLower) ||
        item.type.toLowerCase().includes(searchLower) ||
        item.sector?.toLowerCase().includes(searchLower)
      );
    }
    
    if (appliedFilters.type && appliedFilters.type !== 'all') {
      filtered = filtered.filter(item => item.type === appliedFilters.type);
    }
    
    if (appliedFilters.category && appliedFilters.category !== 'all') {
      filtered = filtered.filter(item => item.sector === appliedFilters.category);
    }

    if (appliedFilters.priceRange) {
      const [min, max] = appliedFilters.priceRange;
      filtered = filtered.filter(item => item.value >= min && item.value <= max);
    }

    if (appliedFilters.onlyActive) {
      filtered = filtered.filter(item => item.direction === 'up');
    }
    
    return filtered;
  };

  const filteredData = applyFilters(marketData);

  const handleAddItem = (item: MarketDataItem) => {
    try {
      const newItem = {
        ...item,
        id: `${item.symbol}-${Date.now()}`,
        lastUpdated: new Date().toISOString()
      };
      addMarketDataItem(newItem);
      setIsAddItemDialogOpen(false);
      announceSuccess(`Added ${item.name} to market data`);
      toast({
        title: "Market Data Added",
        description: `Successfully added ${item.name}`,
      });
      console.log('Market Data: Successfully added new item', newItem);
    } catch (error) {
      console.error('Market Data: Error adding item', error);
      announceError('Error adding market data item');
      toast({
        title: "Error",
        description: "Failed to add market data item",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = (updatedItem: MarketDataItem) => {
    try {
      editMarketDataItem(updatedItem.id, updatedItem);
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      announceSuccess(`Updated ${updatedItem.name}`);
      toast({
        title: "Market Data Updated",
        description: `Successfully updated ${updatedItem.name}`,
      });
    } catch (error) {
      console.error('Market Data: Error editing item', error);
      announceError('Error updating market data item');
      toast({
        title: "Error",
        description: "Failed to update market data item",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = () => {
    if (!selectedItem) return;
    
    try {
      deleteMarketDataItem(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      announceSuccess(`Deleted ${selectedItem.name}`);
      toast({
        title: "Market Data Deleted",
        description: `Successfully deleted ${selectedItem.name}`,
      });
    } catch (error) {
      console.error('Market Data: Error deleting item', error);
      announceError('Error deleting market data item');
      toast({
        title: "Error",
        description: "Failed to delete market data item",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    
    try {
      selectedItems.forEach(item => deleteMarketDataItem(item.id));
      setSelectedItems([]);
      announceSuccess(`Deleted ${selectedItems.length} items`);
      toast({
        title: "Bulk Delete Complete",
        description: `Successfully deleted ${selectedItems.length} items`,
      });
    } catch (error) {
      console.error('Market Data: Error bulk deleting items', error);
      announceError('Error deleting selected items');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    announceAction('Refreshing market data');
    
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      announceSuccess('Market data refreshed');
      toast({
        title: "Data Refreshed",
        description: "Market data has been updated",
      });
    }, 2000);
  };

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    setIsFilterOpen(false);
    const resultCount = applyFilters(marketData).length;
    announceSuccess(`Applied filters showing ${resultCount} results`);
    console.log('Market Data: Applied filters', filters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value) {
      const results = applyFilters(marketData);
      announceAction(`Search results: ${results.length} items found`);
    }
  };

  const handleRowEdit = (item: MarketDataItem) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
    announceAction('Opening edit form', item.name);
  };

  const handleRowDelete = (item: MarketDataItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
    announceAction('Confirming delete', item.name);
  };

  const handleExport = (data: MarketDataItem[]) => {
    const csvContent = [
      ['Symbol', 'Name', 'Type', 'Value', 'Change', 'Percent Change', 'Direction', 'Sector'].join(','),
      ...data.map(item => [
        item.symbol,
        item.name,
        item.type,
        item.value,
        item.change,
        item.percentChange,
        item.direction,
        item.sector || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    announceSuccess('Market data exported successfully');
  };

  // Fixed filter options to ensure no empty strings
  const filterOptions = {
    search: true,
    categories: ["Technology", "Healthcare", "Finance", "Energy", "Cryptocurrency"].filter(cat => cat && cat.trim() !== ""),
    types: ["stock", "crypto", "index", "commodity", "forex"].filter(type => type && type.trim() !== ""),
    status: ["active", "inactive"].filter(status => status && status.trim() !== ""),
    dates: true,
    price: true,
    advanced: true
  };

  console.log('MarketDataPanel: Filter options', filterOptions);

  const columns = [
    {
      key: 'symbol',
      header: 'Symbol',
      sortable: true,
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
    },
    {
      key: 'value',
      header: 'Value',
      sortable: true,
      render: (value: number) => (
        <span>${value.toFixed(2)}</span>
      ),
    },
    {
      key: 'change',
      header: 'Change',
      sortable: true,
      render: (value: number, row: MarketDataItem) => (
        <span className={row.direction === "up" ? "text-green-500" : "text-red-500"}>
          {row.direction === "up" ? "+" : ""}{value.toFixed(2)} ({row.percentChange.toFixed(2)}%)
        </span>
      ),
    },
    {
      key: 'sector',
      header: 'Sector',
      sortable: true,
    }
  ];

  console.log('MarketDataPanel: Columns', columns);
  console.log('MarketDataPanel: Filtered data', filteredData);

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
          <div className="flex gap-2 flex-wrap">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh data"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "filter-button",
                isFilterOpen && "bg-blue-100 dark:bg-blue-900"
              )}
              title="Open filter options"
            >
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsSettingsOpen(true)}
              title="Settings"
            >
              <Settings className="w-4 h-4 mr-2" /> Settings
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
          <DataTable 
            columns={columns} 
            data={filteredData} 
            darkMode={darkMode} 
            itemType="marketData"
            searchable={true}
            filterable={true}
            exportable={true}
            selectable={true}
            pageSize={15}
            onRowSelect={setSelectedItems}
            onEdit={handleRowEdit}
            onDelete={handleRowDelete}
            onExport={handleExport}
          />
          
          {selectedItems.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedItems.length} items selected
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport(selectedItems)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Selected
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    Delete Selected
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className={cn(
          "w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <DialogHeader>
            <DialogTitle>Edit Market Data</DialogTitle>
            <DialogDescription>
              Update the market data item information.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <AddMarketDataForm 
              darkMode={darkMode} 
              onSuccess={handleEditItem} 
              onCancel={() => setIsEditDialogOpen(false)}
              initialData={selectedItem}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className={darkMode ? "bg-zinc-800 border-zinc-700" : ""}>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
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
