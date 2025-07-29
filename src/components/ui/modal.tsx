import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUI } from '@/contexts/UIContext';
import { useForm } from 'react-hook-form';

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
    editHolding
  } = useUI();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const getTitle = () => {
    const actionText = action?.charAt(0).toUpperCase() + action?.slice(1);
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

  const onSubmit = (data: any) => {
    switch (action) {
      case 'add':
        switch (itemType) {
          case 'market-data':
            addMarketDataItem({
              id: `item-${Date.now()}`,
              symbol: data.symbol,
              name: data.name,
              type: data.type || 'stock',
              value: parseFloat(data.value) || 0,
              change: parseFloat(data.change) || 0,
              percentChange: parseFloat(data.percentChange) || 0,
              direction: parseFloat(data.change) >= 0 ? 'up' : 'down',
              sector: data.sector || 'Technology',
              lastUpdated: new Date().toISOString(),
              volume: parseInt(data.volume) || 0,
              marketCap: parseInt(data.marketCap) || 0,
              description: data.description || ''
            });
            break;
          case 'watchlist':
            addWatchlist({
              name: data.name,
              symbols: []
            });
            break;
          case 'alert':
            addAlert({
              type: data.type,
              symbol: data.symbol,
              name: data.name,
              condition: data.condition,
              value: parseFloat(data.value),
              currentValue: parseFloat(data.currentValue) || 0,
              status: 'pending',
              created: new Date().toISOString()
            });
            break;
          case 'holding':
            addHolding({
              symbol: data.symbol,
              name: data.name,
              quantity: parseInt(data.quantity),
              averagePrice: parseFloat(data.averagePrice),
              currentPrice: parseFloat(data.currentPrice),
              sector: data.sector || 'Technology'
            });
            break;
        }
        break;
      case 'edit':
        if (itemId) {
          switch (itemType) {
            case 'market-data':
              const currentMarketItem = getCurrentItem();
              if (currentMarketItem) {
                editMarketDataItem(itemId, {
                  ...currentMarketItem,
                  ...data,
                  value: parseFloat(data.value) || currentMarketItem.value,
                  change: parseFloat(data.change) || currentMarketItem.change,
                  percentChange: parseFloat(data.percentChange) || currentMarketItem.percentChange,
                  volume: parseInt(data.volume) || currentMarketItem.volume,
                  marketCap: parseInt(data.marketCap) || currentMarketItem.marketCap,
                });
              }
              break;
            case 'watchlist':
              const currentWatchlist = getCurrentItem();
              if (currentWatchlist) {
                editWatchlist(parseInt(itemId), {
                  ...currentWatchlist,
                  name: data.name
                });
              }
              break;
            case 'alert':
              const currentAlert = getCurrentItem();
              if (currentAlert) {
                editAlert(parseInt(itemId), {
                  ...currentAlert,
                  ...data,
                  value: parseFloat(data.value) || currentAlert.value,
                  currentValue: parseFloat(data.currentValue) || currentAlert.currentValue,
                });
              }
              break;
            case 'holding':
              const currentHolding = getCurrentItem();
              if (currentHolding) {
                editHolding(itemId, {
                  ...currentHolding,
                  ...data,
                  quantity: parseInt(data.quantity) || currentHolding.quantity,
                  averagePrice: parseFloat(data.averagePrice) || currentHolding.averagePrice,
                  currentPrice: parseFloat(data.currentPrice) || currentHolding.currentPrice,
                });
              }
              break;
          }
        }
        break;
    }
    
    reset();
    onClose();
  };

  const renderForm = () => {
    const currentItem = getCurrentItem();
    const isViewOnly = action === 'view';

    switch (itemType) {
      case 'market-data':
        return (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                {...register('symbol', { required: !isViewOnly })}
                defaultValue={currentItem?.symbol || ''}
                disabled={isViewOnly}
                placeholder="e.g., AAPL"
              />
            </div>
            <div>
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                {...register('name', { required: !isViewOnly })}
                defaultValue={currentItem?.name || ''}
                disabled={isViewOnly}
                placeholder="e.g., Apple Inc."
              />
            </div>
            <div>
              <Label htmlFor="value">Current Price</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                {...register('value')}
                defaultValue={currentItem?.value || ''}
                disabled={isViewOnly}
                placeholder="e.g., 150.25"
              />
            </div>
            <div>
              <Label htmlFor="sector">Sector</Label>
              <Input
                id="sector"
                {...register('sector')}
                defaultValue={currentItem?.sector || ''}
                disabled={isViewOnly}
                placeholder="e.g., Technology"
              />
            </div>
            {!isViewOnly && (
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {action === 'add' ? 'Add' : 'Save'}
                </Button>
              </div>
            )}
          </form>
        );

      case 'watchlist':
        return (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Watchlist Name</Label>
              <Input
                id="name"
                {...register('name', { required: !isViewOnly })}
                defaultValue={currentItem?.name || ''}
                disabled={isViewOnly}
                placeholder="e.g., Tech Stocks"
              />
            </div>
            {!isViewOnly && (
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {action === 'add' ? 'Create' : 'Save'}
                </Button>
              </div>
            )}
          </form>
        );

      case 'alert':
        return (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                {...register('symbol', { required: !isViewOnly })}
                defaultValue={currentItem?.symbol || ''}
                disabled={isViewOnly}
                placeholder="e.g., AAPL"
              />
            </div>
            <div>
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                {...register('name', { required: !isViewOnly })}
                defaultValue={currentItem?.name || ''}
                disabled={isViewOnly}
                placeholder="e.g., Apple Inc."
              />
            </div>
            <div>
              <Label htmlFor="type">Alert Type</Label>
              <Select defaultValue={currentItem?.type || 'price'} disabled={isViewOnly}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price Alert</SelectItem>
                  <SelectItem value="volume">Volume Alert</SelectItem>
                  <SelectItem value="change">Percentage Change</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select defaultValue={currentItem?.condition || 'above'} disabled={isViewOnly}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Above</SelectItem>
                  <SelectItem value="below">Below</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value">Target Value</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                {...register('value', { required: !isViewOnly })}
                defaultValue={currentItem?.value || ''}
                disabled={isViewOnly}
                placeholder="e.g., 160.00"
              />
            </div>
            {!isViewOnly && (
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {action === 'add' ? 'Create Alert' : 'Save'}
                </Button>
              </div>
            )}
          </form>
        );

      case 'holding':
        return (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                {...register('symbol', { required: !isViewOnly })}
                defaultValue={currentItem?.symbol || ''}
                disabled={isViewOnly}
                placeholder="e.g., AAPL"
              />
            </div>
            <div>
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                {...register('name', { required: !isViewOnly })}
                defaultValue={currentItem?.name || ''}
                disabled={isViewOnly}
                placeholder="e.g., Apple Inc."
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                {...register('quantity', { required: !isViewOnly })}
                defaultValue={currentItem?.quantity || ''}
                disabled={isViewOnly}
                placeholder="e.g., 100"
              />
            </div>
            <div>
              <Label htmlFor="averagePrice">Average Price</Label>
              <Input
                id="averagePrice"
                type="number"
                step="0.01"
                {...register('averagePrice', { required: !isViewOnly })}
                defaultValue={currentItem?.averagePrice || ''}
                disabled={isViewOnly}
                placeholder="e.g., 145.50"
              />
            </div>
            <div>
              <Label htmlFor="currentPrice">Current Price</Label>
              <Input
                id="currentPrice"
                type="number"
                step="0.01"
                {...register('currentPrice')}
                defaultValue={currentItem?.currentPrice || ''}
                disabled={isViewOnly}
                placeholder="e.g., 150.25"
              />
            </div>
            {!isViewOnly && (
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {action === 'add' ? 'Add Holding' : 'Save'}
                </Button>
              </div>
            )}
          </form>
        );

      default:
        return <div>Unsupported item type</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};