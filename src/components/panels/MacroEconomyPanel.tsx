
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Globe, Calendar } from 'lucide-react';

interface MacroEconomyPanelProps {
  darkMode: boolean;
}

const MacroEconomyPanel: React.FC<MacroEconomyPanelProps> = ({ darkMode }) => {
  const economicIndicators = [
    {
      name: 'GDP Growth Rate',
      value: 2.1,
      change: 0.3,
      unit: '%',
      period: 'Q3 2024'
    },
    {
      name: 'Unemployment Rate',
      value: 3.7,
      change: -0.1,
      unit: '%',
      period: 'Nov 2024'
    },
    {
      name: 'Inflation Rate (CPI)',
      value: 3.2,
      change: -0.4,
      unit: '%',
      period: 'Nov 2024'
    },
    {
      name: 'Federal Funds Rate',
      value: 5.25,
      change: 0.0,
      unit: '%',
      period: 'Dec 2024'
    },
    {
      name: 'Consumer Confidence',
      value: 102.3,
      change: 2.1,
      unit: 'Index',
      period: 'Dec 2024'
    },
    {
      name: 'Manufacturing PMI',
      value: 48.4,
      change: -1.2,
      unit: 'Index',
      period: 'Dec 2024'
    }
  ];

  const centralBankData = [
    {
      bank: 'Federal Reserve (US)',
      rate: 5.25,
      lastChange: 0.0,
      nextMeeting: '2024-01-31'
    },
    {
      bank: 'European Central Bank',
      rate: 4.00,
      lastChange: 0.0,
      nextMeeting: '2024-01-25'
    },
    {
      bank: 'Bank of England',
      rate: 5.25,
      lastChange: 0.0,
      nextMeeting: '2024-02-01'
    },
    {
      bank: 'Bank of Japan',
      rate: -0.10,
      lastChange: 0.0,
      nextMeeting: '2024-01-23'
    }
  ];

  const upcomingEvents = [
    {
      date: '2024-01-12',
      event: 'US CPI Release',
      importance: 'High',
      expected: '3.2%'
    },
    {
      date: '2024-01-17',
      event: 'US Retail Sales',
      importance: 'Medium',
      expected: '0.4%'
    },
    {
      date: '2024-01-26',
      event: 'US GDP Q4 Preliminary',
      importance: 'High',
      expected: '2.0%'
    },
    {
      date: '2024-01-31',
      event: 'FOMC Meeting',
      importance: 'High',
      expected: 'No Change'
    }
  ];

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card className={cn("border", darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200")}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="w-4 h-4 mr-2" />
          Macro Economy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="indicators" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="indicators">Indicators</TabsTrigger>
            <TabsTrigger value="central-banks">Central Banks</TabsTrigger>
            <TabsTrigger value="calendar">Economic Calendar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="indicators" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {economicIndicators.map((indicator, index) => (
                <div key={index} className={cn(
                  "p-3 rounded border",
                  darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-200 bg-gray-50"
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{indicator.name}</span>
                    <div className="flex items-center space-x-1">
                      {indicator.change > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      ) : indicator.change < 0 ? (
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full" />
                      )}
                      <span className={cn("text-xs", getChangeColor(indicator.change))}>
                        {indicator.change > 0 ? '+' : ''}{indicator.change}{indicator.unit}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {indicator.value}{indicator.unit}
                      </div>
                      <div className="text-xs text-gray-600">{indicator.period}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="central-banks" className="space-y-3">
            {centralBankData.map((bank, index) => (
              <div key={index} className={cn(
                "p-3 rounded border",
                darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-200 bg-gray-50"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{bank.bank}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold">{bank.rate}%</span>
                    <span className={cn("text-xs", getChangeColor(bank.lastChange))}>
                      {bank.lastChange > 0 ? '+' : ''}{bank.lastChange}%
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  Next Meeting: {new Date(bank.nextMeeting).toLocaleDateString()}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className={cn(
                "p-3 rounded border",
                darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-200 bg-gray-50"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{event.event}</span>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs",
                    getImportanceColor(event.importance)
                  )}>
                    {event.importance}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray-600">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="text-gray-600">Expected: </span>
                    <span className="font-medium">{event.expected}</span>
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

export default MacroEconomyPanel;
