
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StockDetailPanelProps {
  darkMode: boolean;
}

const StockDetailPanel: React.FC<StockDetailPanelProps> = ({ darkMode }) => {
  const chartData = [
    { time: '9:30', price: 150 },
    { time: '10:00', price: 152 },
    { time: '10:30', price: 148 },
    { time: '11:00', price: 155 },
  ];

  return (
    <Card className={cn(
      "border",
      darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
    )}>
      <CardHeader>
        <CardTitle>Stock Detail</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockDetailPanel;
