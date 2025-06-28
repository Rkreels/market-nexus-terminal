
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, DollarSign, TrendingUp } from 'lucide-react';

interface FixedIncomePanelProps {
  darkMode: boolean;
}

const FixedIncomePanel: React.FC<FixedIncomePanelProps> = ({ darkMode }) => {
  const [bondCalculator, setBondCalculator] = useState({
    faceValue: 1000,
    couponRate: 5.0,
    maturity: 10,
    ytm: 4.5
  });

  const bonds = [
    {
      symbol: 'US10Y',
      name: 'US Treasury 10-Year',
      yield: 4.25,
      price: 98.45,
      duration: 9.2,
      rating: 'AAA',
      maturity: '2034-05-15'
    },
    {
      symbol: 'US2Y',
      name: 'US Treasury 2-Year',
      yield: 4.85,
      price: 99.12,
      duration: 1.9,
      rating: 'AAA',
      maturity: '2026-05-15'
    },
    {
      symbol: 'CORP5Y',
      name: 'Corporate Bond 5-Year',
      yield: 5.45,
      price: 96.78,
      duration: 4.6,
      rating: 'A',
      maturity: '2029-05-15'
    }
  ];

  const yieldCurve = [
    { maturity: '3M', yield: 5.25 },
    { maturity: '6M', yield: 5.15 },
    { maturity: '1Y', yield: 4.95 },
    { maturity: '2Y', yield: 4.85 },
    { maturity: '5Y', yield: 4.45 },
    { maturity: '10Y', yield: 4.25 },
    { maturity: '30Y', yield: 4.35 }
  ];

  const calculateBondPrice = () => {
    const { faceValue, couponRate, maturity, ytm } = bondCalculator;
    const couponPayment = (faceValue * couponRate) / 100;
    const discountRate = ytm / 100;
    
    let pv = 0;
    for (let i = 1; i <= maturity; i++) {
      pv += couponPayment / Math.pow(1 + discountRate, i);
    }
    pv += faceValue / Math.pow(1 + discountRate, maturity);
    
    return pv.toFixed(2);
  };

  const getRatingColor = (rating: string) => {
    if (rating === 'AAA') return 'text-green-600 bg-green-100';
    if (rating.startsWith('A')) return 'text-blue-600 bg-blue-100';
    if (rating.startsWith('B')) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Card className={cn("border", darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200")}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="w-4 h-4 mr-2" />
          Fixed Income
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bonds" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bonds">Bonds</TabsTrigger>
            <TabsTrigger value="yields">Yield Curve</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bonds" className="space-y-3">
            {bonds.map((bond, index) => (
              <div key={index} className={cn(
                "p-3 rounded border",
                darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-200 bg-gray-50"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium">{bond.symbol}</span>
                    <div className="text-sm text-gray-600">{bond.name}</div>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    getRatingColor(bond.rating)
                  )}>
                    {bond.rating}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Yield: </span>
                    <span className="font-medium">{bond.yield}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Price: </span>
                    <span className="font-medium">{bond.price}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration: </span>
                    <span className="font-medium">{bond.duration}</span>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-600">
                  Maturity: {bond.maturity}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="yields" className="space-y-4">
            <div className={cn(
              "p-4 rounded",
              darkMode ? "bg-zinc-700" : "bg-gray-50"
            )}>
              <h4 className="font-medium mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                US Treasury Yield Curve
              </h4>
              <div className="space-y-2">
                {yieldCurve.map((point, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{point.maturity}</span>
                    <span className="font-medium">{point.yield}%</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="calculator" className="space-y-4">
            <div className={cn(
              "p-4 rounded border",
              darkMode ? "border-zinc-600 bg-zinc-700" : "border-gray-200 bg-gray-50"
            )}>
              <h4 className="font-medium mb-4 flex items-center">
                <Calculator className="w-4 h-4 mr-2" />
                Bond Price Calculator
              </h4>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Face Value ($)</label>
                  <Input
                    type="number"
                    value={bondCalculator.faceValue}
                    onChange={(e) => setBondCalculator({
                      ...bondCalculator,
                      faceValue: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Coupon Rate (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={bondCalculator.couponRate}
                    onChange={(e) => setBondCalculator({
                      ...bondCalculator,
                      couponRate: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Maturity (Years)</label>
                  <Input
                    type="number"
                    value={bondCalculator.maturity}
                    onChange={(e) => setBondCalculator({
                      ...bondCalculator,
                      maturity: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">YTM (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={bondCalculator.ytm}
                    onChange={(e) => setBondCalculator({
                      ...bondCalculator,
                      ytm: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
              
              <div className={cn(
                "p-3 rounded text-center",
                darkMode ? "bg-zinc-600" : "bg-gray-100"
              )}>
                <div className="text-sm text-gray-600 mb-1">Calculated Bond Price</div>
                <div className="text-2xl font-bold">${calculateBondPrice()}</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FixedIncomePanel;
