
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

interface AlertsPanelProps {
  darkMode: boolean;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ darkMode }) => {
  return (
    <Card className={cn(
      "border",
      darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="w-4 h-4 mr-2" />
          Price Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600 py-8">
          Set up price alerts and notifications...
        </p>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
