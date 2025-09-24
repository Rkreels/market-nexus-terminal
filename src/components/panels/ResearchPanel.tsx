
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FileText, TrendingUp, Star, Download, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResearchPanelProps {
  darkMode: boolean;
}

interface ResearchReport {
  id: string;
  symbol: string;
  company: string;
  analyst: string;
  rating: 'Buy' | 'Hold' | 'Sell';
  targetPrice: number;
  currentPrice: number;
  date: Date;
  summary: string;
}

const ResearchPanel: React.FC<ResearchPanelProps> = ({ darkMode }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const researchReports: ResearchReport[] = [
    {
      id: '1',
      symbol: 'AAPL',
      company: 'Apple Inc.',
      analyst: 'Goldman Sachs',
      rating: 'Buy',
      targetPrice: 200.00,
      currentPrice: 178.45,
      date: new Date(),
      summary: 'Strong iPhone demand and services growth support our bullish outlook. Raising price target to $200.'
    },
    {
      id: '2',
      symbol: 'MSFT',
      company: 'Microsoft Corporation',
      analyst: 'Morgan Stanley',
      rating: 'Buy',
      targetPrice: 450.00,
      currentPrice: 415.20,
      date: new Date(Date.now() - 86400000),
      summary: 'Azure continues to gain market share. AI integration across products presents significant upside.'
    },
    {
      id: '3',
      symbol: 'TSLA',
      company: 'Tesla Inc.',
      analyst: 'JP Morgan',
      rating: 'Hold',
      targetPrice: 250.00,
      currentPrice: 245.50,
      date: new Date(Date.now() - 172800000),
      summary: 'Production challenges and increased competition warrant a cautious stance. Maintaining Hold rating.'
    }
  ];

  const fundamentalData = {
    'AAPL': {
      pe: 28.5,
      pbv: 45.2,
      roe: 175.4,
      debt: 0.31,
      revenue: 365.8,
      eps: 6.25
    },
    'MSFT': {
      pe: 32.1,
      pbv: 12.8,
      roe: 44.3,
      debt: 0.18,
      revenue: 198.3,
      eps: 12.93
    }
  };

  const filteredReports = researchReports.filter(report =>
    report.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Buy': return 'text-green-600 bg-green-100';
      case 'Hold': return 'text-yellow-600 bg-yellow-100';
      case 'Sell': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleViewFullReport = (reportId: string) => {
    const report = researchReports.find(r => r.id === reportId);
    if (report) {
      toast({
        title: "Full Report",
        description: `Opening detailed analysis for ${report.symbol} by ${report.analyst}`,
      });
      // In a real app, this would open a detailed report modal or page
    }
  };

  const handleExportReports = () => {
    const csvContent = [
      ['Symbol', 'Company', 'Analyst', 'Rating', 'Target Price', 'Current Price', 'Date', 'Summary'],
      ...filteredReports.map(report => [
        report.symbol,
        report.company,
        report.analyst,
        report.rating,
        report.targetPrice.toString(),
        report.currentPrice.toString(),
        report.date.toISOString(),
        report.summary.replace(/,/g, ';') // Replace commas to avoid CSV issues
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'research_reports.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Research reports exported to CSV successfully.",
    });
  };

  return (
    <Card className={cn("border", darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Research & Analysis
        </CardTitle>
        <Button size="sm" variant="outline" onClick={handleExportReports}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reports">Analyst Reports</TabsTrigger>
            <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredReports.map((report) => (
                <div key={report.id} className={cn(
                  "p-3 rounded border",
                  darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-200 bg-gray-50"
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{report.symbol}</span>
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        getRatingColor(report.rating)
                      )}>
                        {report.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{report.analyst}</span>
                  </div>
                  
                  <p className="text-sm mb-2">{report.summary}</p>
                  
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="text-gray-600">Target: </span>
                      <span className="font-medium">${report.targetPrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Current: </span>
                      <span className="font-medium">${report.currentPrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Upside: </span>
                      <span className={cn(
                        "font-medium",
                        report.targetPrice > report.currentPrice ? "text-green-600" : "text-red-600"
                      )}>
                        {(((report.targetPrice - report.currentPrice) / report.currentPrice) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost" 
                      onClick={() => handleViewFullReport(report.id)}
                    >
                      <BookOpen className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="fundamentals" className="space-y-4">
            {Object.entries(fundamentalData).map(([symbol, data]) => (
              <div key={symbol} className={cn(
                "p-4 rounded border",
                darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-200 bg-gray-50"
              )}>
                <h4 className="font-medium mb-3">{symbol}</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">P/E Ratio</span>
                    <div className="font-medium">{data.pe}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">P/B Ratio</span>
                    <div className="font-medium">{data.pbv}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">ROE %</span>
                    <div className="font-medium">{data.roe}%</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Debt/Equity</span>
                    <div className="font-medium">{data.debt}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Revenue (B)</span>
                    <div className="font-medium">${data.revenue}B</div>
                  </div>
                  <div>
                    <span className="text-gray-600">EPS</span>
                    <div className="font-medium">${data.eps}</div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResearchPanel;
