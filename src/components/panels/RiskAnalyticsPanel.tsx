
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, TrendingDown, Activity, Download, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RiskAnalyticsPanelProps {
  darkMode: boolean;
}

const RiskAnalyticsPanel: React.FC<RiskAnalyticsPanelProps> = ({ darkMode }) => {
  const { toast } = useToast();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [riskSettings, setRiskSettings] = useState({
    confidenceLevel: '95',
    riskModel: 'montecarlo',
    includeOptions: true
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const portfolioRisk = {
    var95: 2.45, // Value at Risk 95%
    var99: 4.23, // Value at Risk 99%
    beta: 1.15,
    sharpe: 1.23,
    maxDrawdown: -8.4,
    volatility: 18.7
  };

  const sectorExposure = [
    { sector: 'Technology', allocation: 45, risk: 'High' },
    { sector: 'Healthcare', allocation: 20, risk: 'Medium' },
    { sector: 'Finance', allocation: 15, risk: 'Medium' },
    { sector: 'Consumer', allocation: 12, risk: 'Low' },
    { sector: 'Energy', allocation: 8, risk: 'High' }
  ];

  const riskMetrics = [
    {
      symbol: 'AAPL',
      beta: 1.21,
      volatility: 24.5,
      var95: 3.2,
      correlationToSP500: 0.76,
      riskGrade: 'B+'
    },
    {
      symbol: 'MSFT',
      beta: 0.89,
      volatility: 19.8,
      var95: 2.8,
      correlationToSP500: 0.82,
      riskGrade: 'A-'
    },
    {
      symbol: 'TSLA',
      beta: 2.04,
      volatility: 45.2,
      var95: 8.9,
      correlationToSP500: 0.45,
      riskGrade: 'C'
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const handleExportRiskData = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ['VaR 95%', `${portfolioRisk.var95}%`],
      ['VaR 99%', `${portfolioRisk.var99}%`],
      ['Beta', portfolioRisk.beta.toString()],
      ['Sharpe Ratio', portfolioRisk.sharpe.toString()],
      ['Max Drawdown', `${portfolioRisk.maxDrawdown}%`],
      ['Volatility', `${portfolioRisk.volatility}%`],
      ...sectorExposure.map(sector => [`${sector.sector} Allocation`, `${sector.allocation}%`])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'risk_analytics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Risk analytics exported to CSV successfully.",
    });
  };

  const handleSaveSettings = () => {
    setIsSettingsOpen(false);
    toast({
      title: "Settings Saved",
      description: "Your risk analytics preferences have been updated.",
    });
  };

  return (
    <Card className={cn("border", darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Risk Analytics
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Risk Analytics Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Confidence Level</label>
                  <Select value={riskSettings.confidenceLevel} onValueChange={(value) => setRiskSettings({...riskSettings, confidenceLevel: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90%</SelectItem>
                      <SelectItem value="95">95%</SelectItem>
                      <SelectItem value="99">99%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Risk Model</label>
                  <Select value={riskSettings.riskModel} onValueChange={(value) => setRiskSettings({...riskSettings, riskModel: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="montecarlo">Monte Carlo</SelectItem>
                      <SelectItem value="historical">Historical</SelectItem>
                      <SelectItem value="parametric">Parametric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveSettings}>Save Settings</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button size="sm" variant="outline" onClick={handleExportRiskData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sectors">Sectors</TabsTrigger>
            <TabsTrigger value="securities">Securities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className={cn(
                "p-3 rounded",
                darkMode ? "bg-zinc-700" : "bg-gray-50"
              )}>
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Value at Risk (95%)</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {portfolioRisk.var95}%
                </div>
                <div className="text-xs text-gray-600">Daily potential loss</div>
              </div>
              
              <div className={cn(
                "p-3 rounded",
                darkMode ? "bg-zinc-700" : "bg-gray-50"
              )}>
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Portfolio Beta</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {portfolioRisk.beta}
                </div>
                <div className="text-xs text-gray-600">vs S&P 500</div>
              </div>
              
              <div className={cn(
                "p-3 rounded",
                darkMode ? "bg-zinc-700" : "bg-gray-50"
              )}>
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Max Drawdown</span>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {portfolioRisk.maxDrawdown}%
                </div>
                <div className="text-xs text-gray-600">Historical peak-to-trough</div>
              </div>
              
              <div className={cn(
                "p-3 rounded",
                darkMode ? "bg-zinc-700" : "bg-gray-50"
              )}>
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Sharpe Ratio</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {portfolioRisk.sharpe}
                </div>
                <div className="text-xs text-gray-600">Risk-adjusted return</div>
              </div>
            </div>
            
            <div className={cn(
              "p-4 rounded border",
              darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-200 bg-gray-50"
            )}>
              <h4 className="font-medium mb-3">Risk Assessment</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Risk Level</span>
                  <span className="font-medium">Moderate-High</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sectors" className="space-y-3">
            {sectorExposure.map((sector, index) => (
              <div key={index} className={cn(
                "p-3 rounded border",
                darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-200 bg-gray-50"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{sector.sector}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{sector.allocation}%</span>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs",
                      getRiskColor(sector.risk)
                    )}>
                      {sector.risk} Risk
                    </span>
                  </div>
                </div>
                <Progress value={sector.allocation} className="h-2" />
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="securities" className="space-y-3">
            {riskMetrics.map((security, index) => (
              <div key={index} className={cn(
                "p-3 rounded border",
                darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-200 bg-gray-50"
              )}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">{security.symbol}</span>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    getGradeColor(security.riskGrade)
                  )}>
                    {security.riskGrade}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Beta: </span>
                    <span className="font-medium">{security.beta}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Volatility: </span>
                    <span className="font-medium">{security.volatility}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">VaR 95%: </span>
                    <span className="font-medium">{security.var95}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Correlation: </span>
                    <span className="font-medium">{security.correlationToSP500}</span>
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

export default RiskAnalyticsPanel;
