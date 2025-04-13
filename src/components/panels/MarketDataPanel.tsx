
import { FC, useState } from "react";
import { 
  PlusCircle, 
  Filter,
  Bell,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUI } from "@/contexts/UIContext";
import { MarketDataItem } from "@/types/marketData";
import AddMarketDataForm from "@/components/AddMarketDataForm";
import DataTable from "@/components/DataTable";
import { useToast } from "@/hooks/use-toast";

interface MarketDataPanelProps {
  darkMode: boolean;
}

const MarketDataPanel: FC<MarketDataPanelProps> = ({ darkMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const { marketData, addMarketDataItem, deleteMarketDataItem, editMarketDataItem } = useUI();
  const { toast } = useToast();

  const filteredData = marketData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = (item: MarketDataItem) => {
    addMarketDataItem(item);
    setIsAddItemDialogOpen(false);
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
    },
    {
      key: 'change',
      header: 'Change',
      render: (value: number, row: MarketDataItem) => (
        <span className={row.direction === "up" ? "text-green-500" : "text-red-500"}>
          {value.toFixed(2)}
        </span>
      ),
    },
  ];

  return (
    <Card className={cn(
      "border", 
      darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
    )}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Market Data
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              setActiveFilters([]);
              toast({
                title: "Filters Reset",
                description: "All filters have been cleared",
                duration: 2000,
              });
            }}
          >
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className={cn(
              "sm:max-w-[500px]", 
              darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white"
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
            darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
          )}
          placeholder="Search market data..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="mt-4">
          <DataTable 
            columns={columns} 
            data={filteredData} 
            darkMode={darkMode} 
            itemType="marketData"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketDataPanel;
