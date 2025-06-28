
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { FilterOptions } from "@/types/marketData";
import { useVoiceTrainer } from "@/contexts/VoiceTrainerContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface FilterPanelProps {
  darkMode: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onApplyFilters: (filters: any) => void;
  filterOptions: FilterOptions & {
    price?: boolean;
    performance?: boolean;
    dateRange?: boolean;
    advanced?: boolean;
  };
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  darkMode, 
  isOpen = false,
  onClose,
  onApplyFilters,
  filterOptions 
}) => {
  const { speak, announceAction } = useVoiceTrainer();
  const isMobile = useIsMobile();
  
  const [category, setCategory] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showOnlyActive, setShowOnlyActive] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Static valid options with proper validation - ensure no empty strings
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "energy", label: "Energy" }
  ];

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
  ];

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "stock", label: "Stock" },
    { value: "crypto", label: "Crypto" },
    { value: "index", label: "Index" },
    { value: "commodity", label: "Commodity" }
  ];

  const resetFilters = () => {
    setCategory("all");
    setType("all");
    setStatus("all");
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
    setPriceRange([0, 1000]);
    setShowOnlyActive(true);
    setSelectedTags([]);
    announceAction('All filters reset to default values');
    speak('Filters have been reset. All categories and types are now selected.', 'medium');
  };

  const handleApplyFilters = () => {
    const filters = {
      category,
      type,
      status,
      searchTerm,
      dateRange: dateFrom && dateTo ? { from: dateFrom, to: dateTo } : null,
      priceRange: filterOptions.price ? priceRange : null,
      onlyActive: showOnlyActive,
      tags: selectedTags.length > 0 ? selectedTags : null,
    };
    
    onApplyFilters(filters);
    announceAction('Filters applied successfully');
    speak(`Filters applied. Category: ${category}, Type: ${type}, ${showOnlyActive ? 'showing only active items' : 'showing all items'}.`, 'medium');
    
    if (onClose) {
      onClose();
    }
  };

  const handleFieldFocus = (fieldName: string, description: string) => {
    speak(`${fieldName}: ${description}`, 'low');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={cn(
      "absolute top-16 right-0 z-10 w-full md:w-80 p-3 sm:p-4 shadow-lg rounded-lg border",
      darkMode 
        ? "bg-zinc-800 border-zinc-700 text-white" 
        : "bg-white border-gray-200 text-black",
      isMobile ? "inset-x-2" : ""
    )}>
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className="font-medium text-base sm:text-lg">Filters</h3>
        <Button
          variant="ghost" 
          size="icon"
          onClick={() => {
            if (onClose) onClose();
            speak('Filter panel closed', 'low');
          }}
          className="h-6 w-6 sm:h-8 sm:w-8"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
      
      <div className="space-y-3 sm:space-y-4 max-h-[70vh] overflow-y-auto">
        {filterOptions.search && (
          <div>
            <Label htmlFor="search" className="text-sm">Search</Label>
            <Input
              id="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => handleFieldFocus('Search', 'Enter keywords to filter results')}
              className={cn(
                "text-sm",
                darkMode ? "bg-zinc-700 border-zinc-600" : ""
              )}
            />
          </div>
        )}
        
        {filterOptions.categories && (
          <div>
            <Label htmlFor="category" className="text-sm">Category</Label>
            <Select 
              value={category} 
              onValueChange={(value) => {
                setCategory(value);
                speak(`Category selected: ${value}`, 'low');
              }}
              onOpenChange={(open) => {
                if (open) handleFieldFocus('Category', 'Select a market sector or category');
              }}
            >
              <SelectTrigger id="category" className={cn(
                "text-sm",
                darkMode ? "bg-zinc-700 border-zinc-600" : ""
              )}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-sm">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {filterOptions.status && (
          <div>
            <Label htmlFor="status" className="text-sm">Status</Label>
            <Select 
              value={status} 
              onValueChange={(value) => {
                setStatus(value);
                speak(`Status selected: ${value}`, 'low');
              }}
              onOpenChange={(open) => {
                if (open) handleFieldFocus('Status', 'Filter by active or inactive status');
              }}
            >
              <SelectTrigger id="status" className={cn(
                "text-sm",
                darkMode ? "bg-zinc-700 border-zinc-600" : ""
              )}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-sm">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {filterOptions.types && (
          <div>
            <Label htmlFor="type" className="text-sm">Type</Label>
            <Select 
              value={type} 
              onValueChange={(value) => {
                setType(value);
                speak(`Type selected: ${value}`, 'low');
              }}
              onOpenChange={(open) => {
                if (open) handleFieldFocus('Type', 'Select security type such as stock, crypto, or index');
              }}
            >
              <SelectTrigger id="type" className={cn(
                "text-sm",
                darkMode ? "bg-zinc-700 border-zinc-600" : ""
              )}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-sm">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {filterOptions.dates && (
          <div className="space-y-2">
            <Label className="text-sm">Date Range</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Label htmlFor="dateFrom" className="text-xs">From</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  onFocus={() => handleFieldFocus('Date from', 'Select start date for filtering')}
                  className={cn("mt-1 text-sm", darkMode ? "bg-zinc-700 border-zinc-600" : "")}
                />
              </div>
              <div>
                <Label htmlFor="dateTo" className="text-xs">To</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  onFocus={() => handleFieldFocus('Date to', 'Select end date for filtering')}
                  className={cn("mt-1 text-sm", darkMode ? "bg-zinc-700 border-zinc-600" : "")}
                />
              </div>
            </div>
          </div>
        )}
        
        {filterOptions.price && (
          <div className="space-y-2">
            <Label className="text-sm">Price Range</Label>
            <Slider
              defaultValue={priceRange}
              max={1000}
              step={1}
              onValueChange={(value) => {
                setPriceRange(value as [number, number]);
                speak(`Price range: ${value[0]} to ${value[1]} dollars`, 'low');
              }}
              onFocus={() => handleFieldFocus('Price range', 'Adjust minimum and maximum price values')}
              className="my-4 sm:my-6"
            />
            <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        )}
        
        {filterOptions.advanced && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="active-only" 
              checked={showOnlyActive} 
              onCheckedChange={(checked) => {
                setShowOnlyActive(checked as boolean);
                speak(checked ? 'Show only active items enabled' : 'Show only active items disabled', 'low');
              }}
            />
            <Label 
              htmlFor="active-only" 
              className="text-xs sm:text-sm cursor-pointer"
              onClick={() => handleFieldFocus('Active only', 'Toggle to show only active items')}
            >
              Show only active items
            </Label>
          </div>
        )}
        
        <div className="pt-2 flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className={cn(
              "w-full sm:w-auto text-sm",
              darkMode ? "border-zinc-600 hover:bg-zinc-700" : ""
            )}
          >
            Reset
          </Button>
          <Button 
            onClick={handleApplyFilters}
            className="w-full sm:w-auto text-sm"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
