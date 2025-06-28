
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal } from 'lucide-react';

interface TerminalPanelProps {
  darkMode: boolean;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ darkMode }) => {
  return (
    <Card className={cn("border", darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200")}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Terminal className="w-4 h-4 mr-2" />
          Terminal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600 py-8">Command terminal coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default TerminalPanel;
