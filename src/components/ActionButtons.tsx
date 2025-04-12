
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye, Trash2, Filter } from "lucide-react";
import { useUI } from "@/contexts/UIContext";

interface ActionButtonsProps {
  itemType: string;
  showFilter?: boolean;
  itemId?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  itemType, 
  showFilter = false, 
  itemId = "", 
  size = "icon" 
}) => {
  const { handleAction, toggleFilter } = useUI();

  return (
    <div className="flex items-center gap-2">
      {showFilter && (
        <Button variant="outline" size={size} className={size === "icon" ? "h-8 w-8" : ""} onClick={toggleFilter}>
          <Filter className="h-4 w-4" />
          {size !== "icon" && <span className="ml-2">Filter</span>}
        </Button>
      )}
      <Button 
        variant="outline" 
        size={size} 
        className={size === "icon" ? "h-8 w-8" : ""} 
        onClick={() => handleAction('add', itemType)}
      >
        <Plus className="h-4 w-4" />
        {size !== "icon" && <span className="ml-2">Add</span>}
      </Button>
      {itemId && (
        <>
          <Button 
            variant="outline" 
            size={size} 
            className={size === "icon" ? "h-8 w-8" : ""} 
            onClick={() => handleAction('view', itemType, itemId)}
          >
            <Eye className="h-4 w-4" />
            {size !== "icon" && <span className="ml-2">View</span>}
          </Button>
          <Button 
            variant="outline" 
            size={size} 
            className={size === "icon" ? "h-8 w-8" : ""} 
            onClick={() => handleAction('edit', itemType, itemId)}
          >
            <Edit className="h-4 w-4" />
            {size !== "icon" && <span className="ml-2">Edit</span>}
          </Button>
          <Button 
            variant="outline" 
            size={size} 
            className={size === "icon" ? "h-8 w-8" : ""} 
            onClick={() => handleAction('delete', itemType, itemId)}
          >
            <Trash2 className="h-4 w-4" />
            {size !== "icon" && <span className="ml-2">Delete</span>}
          </Button>
        </>
      )}
    </div>
  );
};

export default ActionButtons;
