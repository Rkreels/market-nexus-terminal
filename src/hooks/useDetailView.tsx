
import { useState } from 'react';

interface UseDetailViewOptions {
  onViewItem?: (id: string) => void;
  onEditItem?: (id: string) => void;
  onDeleteItem?: (id: string) => void;
}

export const useDetailView = (options?: UseDetailViewOptions) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const viewItem = (id: string) => {
    setSelectedItemId(id);
    setIsEditMode(false);
    setIsDetailOpen(true);
    options?.onViewItem?.(id);
  };

  const editItem = (id: string) => {
    setSelectedItemId(id);
    setIsEditMode(true);
    setIsDetailOpen(true);
    options?.onEditItem?.(id);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setIsEditMode(false);
  };

  const confirmDelete = (id: string) => {
    setSelectedItemId(id);
    setIsDeleteDialogOpen(true);
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    options?.onDeleteItem?.(id);
    setIsDeleteDialogOpen(false);
  };

  return {
    isDetailOpen,
    isEditMode,
    isDeleteDialogOpen,
    selectedItemId,
    viewItem,
    editItem,
    closeDetail,
    confirmDelete,
    cancelDelete,
    handleDelete
  };
};
