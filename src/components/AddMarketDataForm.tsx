
import React from 'react';
import { MarketDataItem } from '@/types/marketData';
import AddItemForm from './AddItemForm';

interface AddMarketDataFormProps {
  darkMode: boolean;
  onSuccess: (item: MarketDataItem) => void;
  onCancel: () => void;
  initialData?: MarketDataItem;
}

const AddMarketDataForm: React.FC<AddMarketDataFormProps> = ({
  darkMode,
  onSuccess,
  onCancel,
  initialData
}) => {
  const fields = [
    {
      name: 'symbol',
      label: 'Symbol',
      type: 'text' as const,
      placeholder: 'e.g., AAPL',
      required: true
    },
    {
      name: 'name',
      label: 'Company Name',
      type: 'text' as const,
      placeholder: 'e.g., Apple Inc.',
      required: true
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select' as const,
      options: ['stock', 'crypto', 'etf', 'index', 'commodity'],
      required: true
    },
    {
      name: 'value',
      label: 'Current Price',
      type: 'number' as const,
      placeholder: '0.00',
      required: true
    },
    {
      name: 'sector',
      label: 'Sector',
      type: 'select' as const,
      options: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer'],
      required: false
    }
  ];

  const handleSubmit = (data: any) => {
    const marketDataItem: MarketDataItem = {
      id: initialData?.id || '',
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      type: data.type,
      value: parseFloat(data.value),
      change: initialData?.change || 0,
      percentChange: initialData?.percentChange || 0,
      direction: initialData?.direction || 'up',
      sector: data.sector,
      lastUpdated: new Date().toISOString()
    };
    onSuccess(marketDataItem);
  };

  return (
    <AddItemForm
      itemType="Market Data"
      fields={fields}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      darkMode={darkMode}
    />
  );
};

export default AddMarketDataForm;
