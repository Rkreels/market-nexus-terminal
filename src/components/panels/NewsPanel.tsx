
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

interface NewsPanelProps {
  darkMode: boolean;
}

const NewsPanel: React.FC<NewsPanelProps> = ({ darkMode }) => {
  const newsItems = [
    {
      title: "Market reaches new highs amid tech rally",
      time: "2 hours ago",
      source: "Financial Times"
    },
    {
      title: "Federal Reserve hints at rate cuts",
      time: "4 hours ago", 
      source: "Reuters"
    }
  ];

  return (
    <Card className={cn(
      "border",
      darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Newspaper className="w-4 h-4 mr-2" />
          Latest News
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newsItems.map((item, index) => (
            <div key={index} className="border-b pb-3 last:border-b-0">
              <div className="font-medium mb-1">{item.title}</div>
              <div className="text-sm text-gray-600">{item.source} • {item.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsPanel;
