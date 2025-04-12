
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailViewProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}

const DetailView: React.FC<DetailViewProps> = ({ 
  title, 
  isOpen, 
  onClose, 
  darkMode, 
  children,
  footerContent
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-[700px] max-h-[80vh] overflow-y-auto",
        darkMode ? "bg-zinc-800 text-white border-zinc-700" : "bg-white text-black border-gray-200"
      )}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{title}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {children}
        </div>
        
        {footerContent && (
          <DialogFooter>
            {footerContent}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetailView;
