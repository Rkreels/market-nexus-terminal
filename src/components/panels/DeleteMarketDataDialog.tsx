
import React from 'react';
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
import { cn } from "@/lib/utils";

interface DeleteMarketDataDialogProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  itemName: string;
}

const DeleteMarketDataDialog: React.FC<DeleteMarketDataDialogProps> = ({
  darkMode,
  isOpen,
  onClose,
  onDelete,
  itemName
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={cn(
        darkMode ? "bg-zinc-800 border-zinc-700 text-white" : ""
      )}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {itemName}</AlertDialogTitle>
          <AlertDialogDescription className={darkMode ? "text-gray-300" : ""}>
            Are you sure you want to delete {itemName}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className={darkMode ? "bg-zinc-700 hover:bg-zinc-600" : ""}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMarketDataDialog;
