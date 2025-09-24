
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, TrendingUp, AlertTriangle, Target, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIModulePanelProps {
  darkMode: boolean;
}

interface AIInsight {
  id: string;
  type: 'prediction' | 'alert' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  timestamp: Date;
}

const AIModulePanel: React.FC<AIModulePanelProps> = ({ darkMode }) => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'prediction',
      title: 'AAPL Price Target',
      description: 'AI models suggest AAPL may reach $185 within 30 days based on technical patterns and sentiment analysis.',
      confidence: 78,
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'alert',
      title: 'Market Volatility Warning',
      description: 'Increased volatility expected in tech sector due to upcoming earnings season.',
      confidence: 85,
      timestamp: new Date()
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Portfolio Rebalancing',
      description: 'Consider reducing exposure to growth stocks and increasing defensive positions.',
      confidence: 72,
      timestamp: new Date()
    }
  ]);

  const [analysis, setAnalysis] = useState('');

  const handleAnalyze = () => {
    if (!query.trim()) return;
    
    const responses = [
      `Analysis of ${query}: Technical indicators suggest bullish momentum with RSI at 65 and MACD showing positive divergence.`,
      `${query} shows mixed signals. While fundamental metrics are strong, recent volume patterns indicate potential consolidation.`,
      `AI sentiment analysis for ${query} reveals 68% positive sentiment from news sources and social media mentions.`,
      `Risk assessment for ${query}: Medium risk profile with beta of 1.2. Consider position sizing accordingly.`
    ];
    
    setAnalysis(responses[Math.floor(Math.random() * responses.length)]);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'recommendation': return <Target className="w-4 h-4 text-green-500" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const handleRefreshInsights = () => {
    const newInsights = [
      {
        id: Date.now().toString(),
        type: 'prediction' as const,
        title: 'Market Correction Signal',
        description: 'Technical indicators suggest potential 5-8% market correction in next 2 weeks based on historical patterns.',
        confidence: Math.floor(Math.random() * 30) + 70,
        timestamp: new Date()
      }
    ];
    setInsights(prev => [newInsights[0], ...prev.slice(0, 2)]);
    toast({
      title: "Insights Refreshed",
      description: "AI insights have been updated with latest market data.",
    });
  };

  const handleExportInsights = () => {
    const csvContent = [
      ['Type', 'Title', 'Description', 'Confidence', 'Timestamp'],
      ...insights.map(insight => [
        insight.type,
        insight.title,
        insight.description.replace(/,/g, ';'),
        `${insight.confidence}%`,
        insight.timestamp.toISOString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai_insights.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "AI insights exported to CSV successfully.",
    });
  };

  return (
    <Card className={cn("border", darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center">
          <Bot className="w-4 h-4 mr-2" />
          AI Module
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={handleRefreshInsights}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={handleExportInsights}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="analyzer">Market Analyzer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="space-y-3">
            {insights.map((insight) => (
              <div key={insight.id} className={cn(
                "p-3 rounded border",
                darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-200 bg-gray-50"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getInsightIcon(insight.type)}
                    <span className="font-medium text-sm">{insight.title}</span>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded text-xs",
                    insight.confidence >= 80 ? "bg-green-100 text-green-800" :
                    insight.confidence >= 60 ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  )}>
                    {insight.confidence}% confidence
                  </div>
                </div>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="analyzer" className="space-y-4">
            <div>
              <label className="text-sm font-medium">Ask AI about any stock or market condition</label>
              <div className="flex space-x-2 mt-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., TSLA technical analysis, market sentiment"
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
                <Button onClick={handleAnalyze}>Analyze</Button>
              </div>
            </div>
            
            {analysis && (
              <div className={cn(
                "p-4 rounded border",
                darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-200 bg-gray-50"
              )}>
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-sm">AI Analysis</span>
                </div>
                <p className="text-sm">{analysis}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery('SPY market outlook');
                  handleAnalyze();
                }}
              >
                Market Outlook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery('Portfolio risk assessment');
                  handleAnalyze();
                }}
              >
                Risk Analysis
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIModulePanel;
