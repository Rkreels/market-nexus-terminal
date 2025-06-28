
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';

interface MacroEconomyPanelProps {
  darkMode: boolean;
}

const MacroEconomyPanel: React.FC<MacroEconomyPanelProps> = ({ darkMode }) => {
  return (
    <Card className={cn("border", darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200")}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="w-4 h-4 mr-2" />
          Macro Economy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600 py-8">Economic indicators coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default MacroEconomyPanel;
