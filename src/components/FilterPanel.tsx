
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
  const [category, setCategory] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showOnlyActive, setShowOnlyActive] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
    
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Static valid options to prevent any empty string issues
  const categoryOptions = [
    "Technology",
    "Healthcare", 
    "Finance",
    "Energy"
  ];

  const statusOptions = [
    "active",
    "inactive"
  ];

  const typeOptions = [
    "stock",
    "crypto", 
    "index",
    "commodity"
  ];

  return (
    <div className={cn(
      "absolute top-16 right-0 z-10 w-full md:w-80 p-4 shadow-lg rounded-lg border",
      darkMode 
        ? "bg-zinc-800 border-zinc-700 text-white" 
        : "bg-white border-gray-200 text-black"
    )}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">Filters</h3>
        <Button
          variant="ghost" 
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {filterOptions.search && (
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
            />
          </div>
        )}
        
        {filterOptions.categories && (
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                <SelectItem value="all">All Categories</SelectItem>
                {categoryOptions.map((categoryOption, index) => (
                  <SelectItem key={`category-${index}`} value={categoryOption}>
                    {categoryOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {filterOptions.status && (
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map((statusOption, index) => (
                  <SelectItem key={`status-${index}`} value={statusOption}>
                    {statusOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {filterOptions.types && (
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type" className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                <SelectItem value="all">All Types</SelectItem>
                {typeOptions.map((typeOption, index) => (
                  <SelectItem key={`type-${index}`} value={typeOption}>
                    {typeOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {filterOptions.dates && (
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="dateFrom" className="text-xs">From</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className={cn("mt-1", darkMode ? "bg-zinc-700 border-zinc-600" : "")}
                />
              </div>
              <div>
                <Label htmlFor="dateTo" className="text-xs">To</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className={cn("mt-1", darkMode ? "bg-zinc-700 border-zinc-600" : "")}
                />
              </div>
            </div>
          </div>
        )}
        
        {filterOptions.price && (
          <div className="space-y-2">
            <Label>Price Range</Label>
            <Slider
              defaultValue={priceRange}
              max={1000}
              step={1}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="my-6"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
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
              onCheckedChange={(checked) => setShowOnlyActive(checked as boolean)}
            />
            <Label htmlFor="active-only" className="text-sm cursor-pointer">Show only active items</Label>
          </div>
        )}
        
        <div className="pt-2 flex justify-between">
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className={darkMode ? "border-zinc-600 hover:bg-zinc-700" : ""}
          >
            Reset
          </Button>
          <Button onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
