
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

interface PortfolioPanelProps {
  darkMode: boolean;
}

const PortfolioPanel: React.FC<PortfolioPanelProps> = ({ darkMode }) => {
  const holdings = [
    { symbol: 'AAPL', shares: 100, value: '$15,025', change: '+$250' },
    { symbol: 'MSFT', shares: 50, value: '$14,280', change: '-$60' },
  ];

  return (
    <Card className={cn(
      "border",
      darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Briefcase className="w-4 h-4 mr-2" />
          Portfolio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {holdings.map((holding, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{holding.symbol}</div>
                <div className="text-sm text-gray-600">{holding.shares} shares</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{holding.value}</div>
                <div className={cn(
                  "text-sm",
                  holding.change.startsWith('+') ? "text-green-600" : "text-red-600"
                )}>
                  {holding.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioPanel;
