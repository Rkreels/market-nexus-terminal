
export const getPortfolioHoldings = () => [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 100,
    avgPrice: 145.50,
    currentPrice: 178.45,
    value: 17845.00,
    change: 3295.00
  },
  {
    id: '2',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 50,
    avgPrice: 380.00,
    currentPrice: 415.20,
    value: 20760.00,
    change: 1760.00
  },
  {
    id: '3',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    shares: 25,
    avgPrice: 135.00,
    currentPrice: 140.25,
    value: 3506.25,
    change: 131.25
  }
];

export const getChartData = (symbol: string, timeframe: string) => {
  const baseValue = symbol.charCodeAt(0) * 3;
  const data = [];
  
  for (let i = 0; i < 30; i++) {
    data.push({
      time: `Day ${i + 1}`,
      value: baseValue + Math.random() * 50 - 25,
      volume: Math.floor(Math.random() * 1000000) + 500000
    });
  }
  
  return data;
};
