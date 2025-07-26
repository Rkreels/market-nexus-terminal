import React from 'react';
import { Alert } from '@/types/marketData';
import AddItemForm from '../AddItemForm';

interface AddAlertFormProps {
  darkMode: boolean;
  onSuccess: (alert: Omit<Alert, 'id'>) => void;
  onCancel: () => void;
  initialData?: Alert;
}

const AddAlertForm: React.FC<AddAlertFormProps> = ({
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
      label: 'Alert Type',
      type: 'select' as const,
      options: ['price', 'volume', 'change'],
      required: true
    },
    {
      name: 'condition',
      label: 'Condition',
      type: 'select' as const,
      options: ['above', 'below', 'equals'],
      required: true
    },
    {
      name: 'value',
      label: 'Target Value',
      type: 'number' as const,
      placeholder: '0.00',
      required: true
    }
  ];

  const handleSubmit = (data: any) => {
    const alert: Omit<Alert, 'id'> = {
      type: data.type,
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      condition: data.condition,
      value: parseFloat(data.value),
      status: 'pending',
      created: new Date().toISOString()
    };
    onSuccess(alert);
  };

  return (
    <AddItemForm
      itemType="Alert"
      fields={fields}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      darkMode={darkMode}
    />
  );
};

export default AddAlertForm;