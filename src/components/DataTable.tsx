
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useUI } from "@/contexts/UIContext";

interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  darkMode: boolean;
  caption?: string;
  itemType: string;
  showActions?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ 
  columns, 
  data, 
  darkMode, 
  caption, 
  itemType,
  showActions = true
}) => {
  const { handleAction } = useUI();

  return (
    <div className={cn("rounded-md border", 
      darkMode ? "border-zinc-700" : "border-gray-200"
    )}>
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        
        <TableHeader className={darkMode ? "bg-zinc-800" : "bg-gray-50"}>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={darkMode ? "text-gray-300" : ""}>
                {column.header}
              </TableHead>
            ))}
            {showActions && <TableHead className={darkMode ? "text-gray-300" : ""}>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <TableRow 
                key={index} 
                className={darkMode ? "hover:bg-zinc-700/50 border-zinc-700" : "hover:bg-gray-50 border-gray-200"}
              >
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
                        onClick={() => handleAction('view', itemType, row.id || index.toString())}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAction('edit', itemType, row.id || index.toString())}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAction('delete', itemType, row.id || index.toString())}
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
                colSpan={columns.length + (showActions ? 1 : 0)} 
                className="text-center py-6"
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
