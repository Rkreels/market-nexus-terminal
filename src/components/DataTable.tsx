import React, { useState, useMemo } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { 
  Eye, 
  Edit, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Filter,
  Download
} from "lucide-react";
import { useUI } from "@/contexts/UIContext";
import { useVoiceTrainer } from "@/contexts/VoiceTrainerContext";

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  darkMode: boolean;
  caption?: string;
  itemType: string;
  showActions?: boolean;
  pageSize?: number;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: any[]) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onExport?: (data: any[]) => void;
}

const DataTable: React.FC<DataTableProps> = ({ 
  columns, 
  data, 
  darkMode, 
  caption, 
  itemType,
  showActions = true,
  pageSize = 10,
  searchable = true,
  filterable = true,
  exportable = true,
  selectable = false,
  onRowSelect,
  onEdit,
  onDelete,
  onExport
}) => {
  const { handleAction } = useUI();
  const { announceAction, announceSuccess, announceError } = useVoiceTrainer();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [filterColumn, setFilterColumn] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');

  // Enhanced filtering and searching
  const filteredAndSearchedData = useMemo(() => {
    let result = [...data];
    
    // Apply search
    if (searchQuery) {
      result = result.filter(row =>
        columns.some(col => {
          const value = row[col.key];
          return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }
    
    // Apply column filter
    if (filterColumn && filterValue) {
      result = result.filter(row => {
        const value = row[filterColumn];
        return value && value.toString().toLowerCase().includes(filterValue.toLowerCase());
      });
    }
    
    return result;
  }, [data, searchQuery, filterColumn, filterValue, columns]);

  // Enhanced sorting
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredAndSearchedData;
    
    return [...filteredAndSearchedData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredAndSearchedData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;
    
    setSortConfig(prev => {
      if (prev?.key === key) {
        const newDirection = prev.direction === 'asc' ? 'desc' : 'asc';
        announceAction(`Sorted by ${key} ${newDirection}ending`);
        return { key, direction: newDirection };
      }
      announceAction(`Sorted by ${key} ascending`);
      return { key, direction: 'asc' };
    });
  };

  const handleRowSelection = (index: number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedRows(newSelected);
    
    const selectedData = Array.from(newSelected).map(i => paginatedData[i]);
    onRowSelect?.(selectedData);
    announceAction(`${checked ? 'Selected' : 'Deselected'} row ${index + 1}`);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIndexes = new Set(paginatedData.map((_, index) => index));
      setSelectedRows(allIndexes);
      onRowSelect?.(paginatedData);
      announceAction('Selected all rows');
    } else {
      setSelectedRows(new Set());
      onRowSelect?.([]);
      announceAction('Deselected all rows');
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(selectedRows.size > 0 ? Array.from(selectedRows).map(i => paginatedData[i]) : sortedData);
      announceSuccess('Data exported successfully');
    } else {
      // Default CSV export
      const csvContent = [
        columns.map(col => col.header).join(','),
        ...sortedData.map(row => columns.map(col => row[col.key]).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${itemType}-data.csv`;
      a.click();
      URL.revokeObjectURL(url);
      announceSuccess('CSV file downloaded');
    }
  };

  const handleEdit = (row: any, index: number) => {
    if (onEdit) {
      onEdit(row);
    } else {
      handleAction('edit', itemType, row.id || index.toString());
    }
    announceAction('Opening edit form', `for ${itemType}`);
  };

  const handleDelete = (row: any, index: number) => {
    if (onDelete) {
      onDelete(row);
    } else {
      handleAction('delete', itemType, row.id || index.toString());
    }
    announceAction('Initiating delete', `for ${itemType}`);
  };

  const handleView = (row: any, index: number) => {
    handleAction('view', itemType, row.id || index.toString());
    announceAction('Opening details view', `for ${itemType}`);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      {(searchable || filterable || exportable) && (
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 items-center">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${itemType}...`}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={cn("pl-8", darkMode ? "bg-zinc-700 border-zinc-600" : "")}
                />
              </div>
            )}
            
            {filterable && (
              <div className="flex gap-2">
                <Select value={filterColumn} onValueChange={setFilterColumn}>
                  <SelectTrigger className={cn("w-32", darkMode ? "bg-zinc-700 border-zinc-600" : "")}>
                    <SelectValue placeholder="Column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Columns</SelectItem>
                    {columns.map(col => (
                      <SelectItem key={col.key} value={col.key}>{col.header}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder="Filter value..."
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className={cn("w-32", darkMode ? "bg-zinc-700 border-zinc-600" : "")}
                  disabled={!filterColumn}
                />
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {exportable && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="export-button"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
            
            {selectedRows.size > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedRows.size} selected
              </span>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className={cn("rounded-md border", 
        darkMode ? "border-zinc-700" : "border-gray-200"
      )}>
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}
          
          <TableHeader className={darkMode ? "bg-zinc-800" : "bg-gray-50"}>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              
              {columns.map((column) => (
                <TableHead 
                  key={column.key} 
                  className={cn(
                    darkMode ? "text-gray-300" : "",
                    column.sortable ? "cursor-pointer hover:bg-opacity-80" : ""
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && sortConfig?.key === column.key && (
                      sortConfig.direction === 'asc' ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
              ))}
              
              {showActions && <TableHead className={darkMode ? "text-gray-300" : ""}>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow 
                  key={index} 
                  className={cn(
                    darkMode ? "hover:bg-zinc-700/50 border-zinc-700" : "hover:bg-gray-50 border-gray-200",
                    selectedRows.has(index) ? (darkMode ? "bg-zinc-700" : "bg-blue-50") : ""
                  )}
                >
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(index)}
                        onCheckedChange={(checked) => handleRowSelection(index, checked as boolean)}
                      />
                    </TableCell>
                  )}
                  
                  {columns.map((column) => (
                    <TableCell key={`${index}-${column.key}`} className={darkMode ? "text-gray-200" : ""}>
                      {column.render 
                        ? column.render(row[column.key], row) 
                        : row[column.key]}
                    </TableCell>
                  ))}
                  
                  {showActions && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(row, index)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(row, index)}
                          title="Edit item"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(row, index)}
                          title="Delete item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (showActions ? 1 : 0) + (selectable ? 1 : 0)} 
                  className="text-center py-6"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
