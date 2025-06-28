
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface ResearchPanelProps {
  darkMode: boolean;
}

const ResearchPanel: React.FC<ResearchPanelProps> = ({ darkMode }) => {
  return (
    <Card className={cn(
      "border",
      darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="w-4 h-4 mr-2" />
          Research & Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600 py-8">
          Research tools and analyst reports coming soon...
        </p>
      </CardContent>
    </Card>
  );
};

export default ResearchPanel;
