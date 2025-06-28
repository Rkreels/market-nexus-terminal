
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface FixedIncomePanelProps {
  darkMode: boolean;
}

const FixedIncomePanel: React.FC<FixedIncomePanelProps> = ({ darkMode }) => {
  return (
    <Card className={cn("border", darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200")}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Fixed Income
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600 py-8">Bond analysis tools coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default FixedIncomePanel;
