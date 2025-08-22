
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUI } from '@/contexts/UIContext';
import { useToast } from '@/hooks/use-toast';
import AddMarketDataForm from '@/components/AddMarketDataForm';
import AddItemForm from '@/components/AddItemForm';
import DetailView from '@/components/DetailView';
import LoadingState from '@/components/LoadingState';
import ErrorBoundary from '@/components/ErrorBoundary';
import { cn } from '@/lib/utils';
import { 
  marketDataSchema, 
  watchlistSchema, 
  holdingSchema, 
  alertSchema, 
  symbolSchema 
} from '@/utils/validation';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'add' | 'edit' | 'view' | 'delete' | null;
  itemType: string;
  itemId?: string;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  action,
  itemType,
  itemId
}) => {
  const { 
    isDarkMode, 
    marketData, 
    watchlists, 
    alerts, 
    portfolioHoldings,
    addMarketDataItem,
    editMarketDataItem,
    addWatchlist,
    editWatchlist,
    addAlert,
    editAlert,
    addHolding,
    editHolding,
    addToWatchlist
  } = useUI();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  if (!action || !itemType) return null;

  const getModalTitle = () => {
    const actionText = action === 'add' ? 'Add' : action === 'edit' ? 'Edit' : action === 'view' ? 'View' : 'Delete';
    const typeText = itemType.charAt(0).toUpperCase() + itemType.slice(1).replace('-', ' ');
    return `${actionText} ${typeText}`;
  };

  const getCurrentItem = () => {
    if (!itemId) return null;
    
    switch (itemType) {
      case 'market-data':
        return marketData.find(item => item.id === itemId);
      case 'watchlist':
        return watchlists.find(item => item.id === parseInt(itemId));
      case 'alert':
        return alerts.find(item => item.id === parseInt(itemId));
      case 'holding':
        return portfolioHoldings.find(item => item.id === itemId);
      default:
        return null;
    }
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      switch (itemType) {
        case 'market-data':
          if (action === 'add') {
            const newItem = {
              ...data,
              id: `market-${Date.now()}`,
              change: 0,
              percentChange: 0,
              direction: 'up' as const,
              lastUpdated: new Date().toISOString()
            };
            addMarketDataItem(newItem);
          } else if (action === 'edit' && itemId) {
            const currentItem = getCurrentItem();
            if (currentItem) {
              editMarketDataItem(itemId, { ...currentItem, ...data });
            }
          }
          break;
          
        case 'watchlist':
          if (action === 'add') {
            addWatchlist({ name: data.name, symbols: [] });
          } else if (action === 'edit' && itemId) {
            const currentItem = getCurrentItem();
            if (currentItem) {
              editWatchlist(parseInt(itemId), { ...currentItem, ...data });
            }
          }
          break;
          
        case 'alert':
          if (action === 'add') {
            addAlert({
              type: data.type,
              symbol: data.symbol.toUpperCase(),
              name: data.name,
              condition: data.condition,
              value: data.value,
              status: 'pending',
              created: new Date().toISOString()
            });
          } else if (action === 'edit' && itemId) {
            const currentItem = getCurrentItem();
            if (currentItem) {
              editAlert(parseInt(itemId), { ...currentItem, ...data });
            }
          }
          break;
          
        case 'holding':
          if (action === 'add') {
            const marketItem = marketData.find(item => item.symbol.toUpperCase() === data.symbol.toUpperCase());
            if (marketItem) {
              addHolding({
                symbol: data.symbol.toUpperCase(),
                name: marketItem.name,
                shares: data.shares,
                avgPrice: data.avgPrice,
              });
            } else {
              throw new Error('Symbol not found in market data');
            }
          } else if (action === 'edit' && itemId) {
            const currentItem = getCurrentItem();
            if (currentItem) {
              editHolding(itemId, { ...currentItem, ...data });
            }
          }
          break;
          
        case 'symbol':
          if (action === 'add' && itemId) {
            const marketItem = marketData.find(item => item.symbol.toUpperCase() === data.symbol.toUpperCase());
            if (marketItem) {
              const watchlistItem = {
                symbol: marketItem.symbol,
                name: marketItem.name,
                price: marketItem.value,
                change: marketItem.change,
                direction: marketItem.direction
              };
              addToWatchlist(parseInt(itemId), watchlistItem);
            } else {
              throw new Error('Symbol not found in market data');
            }
          }
          break;
      }
      
      onClose();
    } catch (error) {
      console.error('Modal submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFormFields = () => {
    switch (itemType) {
      case 'market-data':
        return [
          { name: 'symbol', label: 'Symbol', type: 'text' as const, placeholder: 'e.g., AAPL', required: true },
          { name: 'name', label: 'Company Name', type: 'text' as const, placeholder: 'e.g., Apple Inc.', required: true },
          { name: 'type', label: 'Type', type: 'select' as const, options: ['stock', 'crypto', 'etf', 'index', 'commodity'], required: true },
          { name: 'value', label: 'Current Price', type: 'number' as const, placeholder: '0.00', required: true },
          { name: 'sector', label: 'Sector', type: 'select' as const, options: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer'], required: false }
        ];
        
      case 'watchlist':
        return [
          { name: 'name', label: 'Watchlist Name', type: 'text' as const, placeholder: 'e.g., Tech Stocks', required: true }
        ];
        
      case 'alert':
        return [
          { name: 'symbol', label: 'Symbol', type: 'text' as const, placeholder: 'e.g., AAPL', required: true },
          { name: 'name', label: 'Company Name', type: 'text' as const, placeholder: 'e.g., Apple Inc.', required: true },
          { name: 'type', label: 'Alert Type', type: 'select' as const, options: ['price', 'volume', 'change'], required: true },
          { name: 'condition', label: 'Condition', type: 'select' as const, options: ['above', 'below', 'equals'], required: true },
          { name: 'value', label: 'Target Value', type: 'number' as const, placeholder: '0.00', required: true }
        ];
        
      case 'holding':
        return [
          { name: 'symbol', label: 'Symbol', type: 'text' as const, placeholder: 'e.g., AAPL', required: true },
          { name: 'shares', label: 'Shares', type: 'number' as const, placeholder: '100', required: true },
          { name: 'avgPrice', label: 'Average Price', type: 'number' as const, placeholder: '150.00', required: true }
        ];
        
      case 'symbol':
        return [
          { name: 'symbol', label: 'Symbol', type: 'text' as const, placeholder: 'e.g., AAPL', required: true }
        ];
        
      default:
        return [];
    }
  };

  const getValidationSchema = () => {
    switch (itemType) {
      case 'market-data':
        return marketDataSchema;
      case 'watchlist':
        return watchlistSchema;
      case 'alert':
        return alertSchema;
      case 'holding':
        return holdingSchema;
      case 'symbol':
        return symbolSchema;
      default:
        return undefined;
    }
  };

  const renderContent = () => {
    if (action === 'view') {
      const currentItem = getCurrentItem();
      if (!currentItem) {
        return <div className="p-4 text-center text-gray-500">Item not found</div>;
      }
      
      return (
        <DetailView
          title={getModalTitle()}
          isOpen={isOpen}
          onClose={onClose}
          darkMode={isDarkMode}
        >
          <div className="space-y-3">
            {Object.entries(currentItem).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
              </div>
            ))}
          </div>
        </DetailView>
      );
    }

    const currentItem = action === 'edit' ? getCurrentItem() : null;
    const fields = getFormFields().map(field => ({
      ...field,
      defaultValue: currentItem?.[field.name]?.toString() || field.defaultValue
    }));

    return (
      <ErrorBoundary darkMode={isDarkMode}>
        <AddItemForm
          itemType={getModalTitle().split(' ').slice(1).join(' ')}
          fields={fields}
          onSubmit={handleSubmit}
          onCancel={onClose}
          darkMode={isDarkMode}
          validationSchema={getValidationSchema()}
          isLoading={isLoading}
        />
      </ErrorBoundary>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-2xl max-h-[90vh] overflow-y-auto",
        isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
        </DialogHeader>
        {isLoading && action !== 'view' ? (
          <LoadingState message="Processing..." darkMode={isDarkMode} />
        ) : (
          renderContent()
        )}
      </DialogContent>
    </Dialog>
  );
};
