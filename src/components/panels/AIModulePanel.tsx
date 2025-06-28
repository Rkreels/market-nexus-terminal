
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

interface AIModulePanelProps {
  darkMode: boolean;
}

const AIModulePanel: React.FC<AIModulePanelProps> = ({ darkMode }) => {
  return (
    <Card className={cn("border", darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200")}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="w-4 h-4 mr-2" />
          AI Module
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600 py-8">AI insights coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default AIModulePanel;
