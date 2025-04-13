
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
  itemName,
}) => {
  const { toast } = useToast();

  const handleDelete = () => {
    // In a real app, this would delete from the database
    toast({
      title: "Market Data Deleted",
      description: `${itemName} has been deleted successfully`,
      duration: 3000,
    });
    onDelete();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-[425px]",
        darkMode ? "bg-zinc-800 text-white border-zinc-700" : "bg-white text-black border-gray-200"
      )}>
        <DialogHeader>
          <DialogTitle>Delete Market Data</DialogTitle>
          <DialogDescription className={darkMode ? "text-gray-300" : "text-gray-600"}>
            Are you sure you want to delete {itemName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMarketDataDialog;
