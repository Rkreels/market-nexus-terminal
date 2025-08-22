
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
import { useIsMobile } from "@/hooks/use-mobile";

interface MarketDataPanelProps {}

const MarketDataPanel: FC<MarketDataPanelProps> = () => {
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
  const { announceAction, announceSuccess, announceError, speak } = useVoiceTrainer();
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
      announceSuccess(`Added ${item.name} to market data tracking`);
      speak(`${item.name} stock added successfully. Current price is ${item.value} dollars with ${item.change > 0 ? 'positive' : 'negative'} change of ${Math.abs(item.change)} dollars.`, 'medium');
      toast({
        title: "Market Data Added",
        description: `Successfully added ${item.name}`,
      });
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
      announceSuccess(`Updated ${updatedItem.name} market data`);
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
      announceSuccess(`Removed ${selectedItem.name} from tracking`);
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
      announceSuccess(`Removed ${selectedItems.length} items from tracking`);
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
    announceAction('Refreshing market data from live feeds');
    speak('Updating real-time market data. This may take a few seconds.', 'medium');
    
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      announceSuccess('Market data refreshed with latest prices');
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
    announceSuccess(`Filters applied. Showing ${resultCount} market data items`);
    speak(`Filter results: ${resultCount} securities match your criteria. Use arrow keys to navigate through the results.`, 'medium');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value) {
      const results = applyFilters(marketData);
      announceAction(`Search updated: ${results.length} securities found`);
    }
  };

  const handleRowEdit = (item: MarketDataItem) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
    announceAction('Opening edit form', `${item.name} - ${item.symbol}`);
    speak(`Editing ${item.name}. Current price is ${item.value} dollars. Use tab to navigate through form fields.`, 'medium');
  };

  const handleRowDelete = (item: MarketDataItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
    announceAction('Confirming delete', `${item.name} - ${item.symbol}`);
    speak(`Confirm deletion of ${item.name}. This will remove it from your market data tracking.`, 'high');
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
    
    announceSuccess(`Market data exported successfully as CSV file with ${data.length} items`);
  };

  // Fixed filter options - use boolean flags only, not arrays
  const filterOptions = {
    search: true,
    categories: true,
    types: true,
    status: true,
    dates: true,
    price: true,
    advanced: true
  };

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
    ...(!isMobile ? [{
      key: 'sector',
      header: 'Sector',
      sortable: true,
    }] : [])
  ];

  return (
    <div className="relative">
      <Card 
        className="border"
        data-component="market-data-panel"
      >
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
          <CardTitle className="text-base sm:text-lg font-medium flex items-center">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Market Data ({filteredData.length} items)
          </CardTitle>
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh data"
              className="text-xs sm:text-sm"
            >
              <RefreshCw className={cn("w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2", isRefreshing && "animate-spin")} />
              {!isMobile && "Refresh"}
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "filter-button text-xs sm:text-sm",
                isFilterOpen && "bg-blue-100 dark:bg-blue-900"
              )}
              title="Open filter options"
            >
              <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> 
              {!isMobile && "Filter"}
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsSettingsOpen(true)}
              title="Settings"
              className="text-xs sm:text-sm"
            >
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> 
              {!isMobile && "Settings"}
            </Button>
            
            <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  className="add-button text-xs sm:text-sm"
                  title="Add new market data item"
                  onClick={() => speak('Opening add market data form. Enter symbol, name, and other details to track a new security.', 'medium')}
                >
                  <PlusCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> 
                  {!isMobile && "Add Item"}
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto z-50">
                <DialogHeader>
                  <DialogTitle>Add New Market Data</DialogTitle>
                  <DialogDescription>
                    Add a new market data item to your dashboard.
                  </DialogDescription>
                </DialogHeader>
                <AddMarketDataForm 
                  onSuccess={handleAddItem} 
                  onCancel={() => setIsAddItemDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <DataTable 
            columns={columns} 
            data={filteredData}
            darkMode={false}
            itemType="marketData"
            searchable={true}
            filterable={true}
            exportable={true}
            selectable={true}
            pageSize={isMobile ? 10 : 15}
            onRowSelect={setSelectedItems}
            onEdit={handleRowEdit}
            onDelete={handleRowDelete}
            onExport={handleExport}
          />
          
          {selectedItems.length > 0 && (
            <div className="mt-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <span className="text-sm font-medium">
                  {selectedItems.length} items selected
                </span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport(selectedItems)}
                    className="flex-1 sm:flex-none text-xs sm:text-sm"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Export Selected
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="flex-1 sm:flex-none text-xs sm:text-sm"
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
        <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Market Data</DialogTitle>
            <DialogDescription>
              Update the market data item information.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <AddMarketDataForm 
              onSuccess={handleEditItem} 
              onCancel={() => setIsEditDialogOpen(false)}
              initialData={selectedItem}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
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
        darkMode={false}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        filterOptions={filterOptions}
      />
    </div>
  );
};

export default MarketDataPanel;
