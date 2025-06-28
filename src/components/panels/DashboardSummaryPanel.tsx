
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertCircle, Eye } from 'lucide-react';

interface DashboardSummaryPanelProps {
  darkMode: boolean;
}

const DashboardSummaryPanel: React.FC<DashboardSummaryPanelProps> = ({ darkMode }) => {
  const summaryCards = [
    {
      title: 'Portfolio Value',
      value: '$125,450.23',
      change: '+$1,234.56',
      changePercent: '+0.99%',
      icon: DollarSign,
      positive: true
    },
    {
      title: 'Day P&L',
      value: '$856.78',
      change: '+$234.12',
      changePercent: '+0.38%',
      icon: TrendingUp,
      positive: true
    },
    {
      title: 'Active Positions',
      value: '12',
      change: '+2',
      changePercent: 'New today',
      icon: Activity,
      positive: true
    },
    {
      title: 'Watchlist Items',
      value: '8',
      change: '+1',
      changePercent: 'This week',
      icon: Eye,
      positive: true
    },
    {
      title: 'Active Alerts',
      value: '5',
      change: '2 triggered',
      changePercent: 'Today',
      icon: AlertCircle,
      positive: false
    },
    {
      title: 'Market Exposure',
      value: '87.5%',
      change: '-2.1%',
      changePercent: 'vs yesterday',
      icon: TrendingDown,
      positive: false
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-4">
      {summaryCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card key={index} className={cn(
            "border",
            darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
          )}>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <IconComponent className={cn(
                  "w-4 h-4 sm:w-5 sm:h-5",
                  card.positive ? "text-green-500" : "text-red-500"
                )} />
                <span className={cn(
                  "text-xs px-2 py-1 rounded",
                  card.positive 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                )}>
                  {card.positive ? '↗' : '↘'}
                </span>
              </div>
              
              <div>
                <div className="text-xl sm:text-2xl font-bold mb-1">
                  {card.value}
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  {card.title}
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <span className={cn(
                    "font-medium",
                    card.positive ? "text-green-600" : "text-red-600"
                  )}>
                    {card.change}
                  </span>
                  <span className="text-gray-500">
                    {card.changePercent}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardSummaryPanel;
