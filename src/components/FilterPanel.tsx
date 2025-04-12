
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useUI } from "@/contexts/UIContext";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  darkMode: boolean;
  filterOptions?: {
    categories?: string[];
    status?: string[];
    types?: string[];
    dates?: boolean;
    search?: boolean;
  }
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  darkMode, 
  filterOptions = {
    categories: ["Category 1", "Category 2", "Category 3"],
    status: ["Active", "Pending", "Completed"],
    types: ["Type A", "Type B", "Type C"],
    dates: true,
    search: true
  }
}) => {
  const { isFilterOpen, toggleFilter, applyFilter } = useUI();
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    type: "",
    dateFrom: "",
    dateTo: "",
    search: "",
    showArchived: false
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    applyFilter(filters);
    toggleFilter();
  };

  const handleReset = () => {
    setFilters({
      category: "",
      status: "",
      type: "",
      dateFrom: "",
      dateTo: "",
      search: "",
      showArchived: false
    });
  };

  return (
    <Dialog open={isFilterOpen} onOpenChange={toggleFilter}>
      <DialogContent className={cn(
        "sm:max-w-[500px]",
        darkMode ? "bg-zinc-800 text-white border-zinc-700" : "bg-white text-black border-gray-200"
      )}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Filter Options</span>
            <Button variant="ghost" size="icon" onClick={toggleFilter}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {filterOptions.search && (
            <div className="grid gap-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => handleChange('search', e.target.value)}
                className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
              />
            </div>
          )}
          
          {filterOptions.categories && filterOptions.categories.length > 0 && (
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={filters.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger id="category" className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                  <SelectItem value="">All Categories</SelectItem>
                  {filterOptions.categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {filterOptions.status && filterOptions.status.length > 0 && (
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger id="status" className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                  <SelectItem value="">All Statuses</SelectItem>
                  {filterOptions.status.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {filterOptions.types && filterOptions.types.length > 0 && (
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select value={filters.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger id="type" className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                  <SelectItem value="">All Types</SelectItem>
                  {filterOptions.types.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {filterOptions.dates && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dateFrom">From Date</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleChange('dateFrom', e.target.value)}
                  className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dateTo">To Date</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleChange('dateTo', e.target.value)}
                  className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
                />
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showArchived"
              checked={filters.showArchived}
              onCheckedChange={(checked) => handleChange('showArchived', checked === true)}
            />
            <Label htmlFor="showArchived">Show archived items</Label>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterPanel;
