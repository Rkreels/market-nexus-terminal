
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

interface DashboardSummaryPanelProps {
  darkMode: boolean;
}

const DashboardSummaryPanel: React.FC<DashboardSummaryPanelProps> = ({ darkMode }) => {
  const summaryData = [
    {
      title: "Portfolio Value",
      value: "$124,550.00",
      change: "+2.5%",
      isPositive: true,
      icon: DollarSign
    },
    {
      title: "Daily P&L",
      value: "+$3,050.00",
      change: "+2.5%",
      isPositive: true,
      icon: TrendingUp
    },
    {
      title: "Market Performance",
      value: "Mixed",
      change: "+0.8%",
      isPositive: true,
      icon: BarChart3
    },
    {
      title: "Active Alerts",
      value: "5",
      change: "2 triggered",
      isPositive: false,
      icon: TrendingDown
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryData.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card
            key={index}
            className={cn(
              "border",
              darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className={cn(
                "text-xs",
                item.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {item.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardSummaryPanel;
