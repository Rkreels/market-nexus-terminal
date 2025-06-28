
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface RiskAnalyticsPanelProps {
  darkMode: boolean;
}

const RiskAnalyticsPanel: React.FC<RiskAnalyticsPanelProps> = ({ darkMode }) => {
  return (
    <Card className={cn("border", darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200")}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-4 h-4 mr-2" />
          Risk Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600 py-8">Risk analysis tools coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default RiskAnalyticsPanel;
