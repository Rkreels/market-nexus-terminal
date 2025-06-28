
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Newspaper, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

interface NewsPanelProps {
  darkMode: boolean;
}

interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  timestamp: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
  symbols: string[];
  url: string;
}

const NewsPanel: React.FC<NewsPanelProps> = ({ darkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const newsItems: NewsItem[] = [
    {
      id: '1',
      headline: 'Apple Reports Strong Q4 Earnings, Beats Expectations',
      summary: 'Apple Inc. reported quarterly earnings that exceeded analyst expectations, driven by strong iPhone and services revenue.',
      source: 'Reuters',
      timestamp: new Date(),
      sentiment: 'positive',
      symbols: ['AAPL'],
      url: '#'
    },
    {
      id: '2',
      headline: 'Federal Reserve Holds Interest Rates Steady',
      summary: 'The Federal Reserve decided to maintain current interest rates, citing ongoing economic uncertainty and inflation concerns.',
      source: 'Bloomberg',
      timestamp: new Date(Date.now() - 3600000),
      sentiment: 'neutral',
      symbols: ['SPY', 'QQQ'],
      url: '#'
    },
    {
      id: '3',
      headline: 'Tesla Stock Drops on Production Concerns',
      summary: 'Tesla shares declined after the company reported lower-than-expected vehicle production numbers for the quarter.',
      source: 'CNBC',
      timestamp: new Date(Date.now() - 7200000),
      sentiment: 'negative',
      symbols: ['TSLA'],
      url: '#'
    },
    {
      id: '4',
      headline: 'Microsoft Azure Revenue Surges 30%',
      summary: 'Microsoft reported strong growth in its cloud computing division, with Azure revenue increasing 30% year-over-year.',
      source: 'Wall Street Journal',
      timestamp: new Date(Date.now() - 10800000),
      sentiment: 'positive',
      symbols: ['MSFT'],
      url: '#'
    }
  ];

  const filteredNews = newsItems.filter(item => 
    item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.symbols.some(symbol => symbol.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <Card className={cn("border", darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200")}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Newspaper className="w-4 h-4 mr-2" />
          Market News
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredNews.map((item) => (
              <div key={item.id} className={cn(
                "p-3 rounded border",
                darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-200 bg-gray-50"
              )}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getSentimentIcon(item.sentiment)}
                    <span className="text-xs text-gray-500">{item.source}</span>
                    <span className="text-xs text-gray-500">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
                
                <h4 className="font-medium text-sm mb-1">{item.headline}</h4>
                <p className="text-xs text-gray-600 mb-2">{item.summary}</p>
                
                <div className="flex flex-wrap gap-1">
                  {item.symbols.map((symbol) => (
                    <span key={symbol} className={cn(
                      "px-2 py-1 rounded text-xs",
                      darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-800"
                    )}>
                      {symbol}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsPanel;
