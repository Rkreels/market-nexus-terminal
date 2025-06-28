
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleDollarSign } from 'lucide-react';

interface TradingPanelProps {
  darkMode: boolean;
}

const TradingPanel: React.FC<TradingPanelProps> = ({ darkMode }) => {
  return (
    <Card className={cn("border", darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200")}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CircleDollarSign className="w-4 h-4 mr-2" />
          Trading
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600 py-8">Trading interface coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default TradingPanel;
