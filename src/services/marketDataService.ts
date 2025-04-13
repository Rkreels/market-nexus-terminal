
import { MarketDataItem, TimeframeData } from '@/types/marketData';
import { Timeframe, generateTimeframeData } from '@/utils/timeframeUtils';

// Mock market data
const marketDataItems: MarketDataItem[] = [
  { 
    id: "sp500",
    name: "S&P 500", 
    symbol: "SPX",
    type: "Index",
    value: 4892.17, 
    change: 15.28, 
    percentChange: 0.31, 
    direction: "up",
    lastUpdated: new Date().toISOString(),
    description: "The Standard and Poor's 500 is a stock market index tracking the stock performance of 500 large companies listed on stock exchanges in the United States.",
    sector: "Multi-Sector",
    marketCap: 38200000000000,
    volume: 4123450000
  },
  { 
    id: "dow",
    name: "Dow Jones", 
    symbol: "DJI",
    type: "Index",
    value: 38671.69, 
    change: 134.22, 
    percentChange: 0.35, 
    direction: "up",
    lastUpdated: new Date().toISOString(),
    description: "The Dow Jones Industrial Average is a stock market index of 30 prominent companies listed on stock exchanges in the United States.",
    sector: "Multi-Sector",
    marketCap: 11500000000000,
    volume: 3245670000
  },
  { 
    id: "nasdaq",
    name: "NASDAQ", 
    symbol: "COMP",
    type: "Index",
    value: 15461.84, 
    change: -3.25, 
    percentChange: -0.02, 
    direction: "down",
    lastUpdated: new Date().toISOString(),
    description: "The Nasdaq Composite is a stock market index that includes almost all stocks listed on the Nasdaq stock market.",
    sector: "Technology",
    marketCap: 21700000000000,
    volume: 5234560000
  },
  { 
    id: "russell",
    name: "Russell 2000", 
    symbol: "RUT",
    type: "Index",
    value: 1998.32, 
    change: 12.07, 
    percentChange: 0.61, 
    direction: "up",
    lastUpdated: new Date().toISOString(),
    description: "The Russell 2000 Index is a small-cap stock market index that makes up the smallest 2,000 stocks in the Russell 3000 Index.",
    sector: "Multi-Sector",
    marketCap: 2800000000000,
    volume: 1876540000
  },
  {
    id: "btcusd",
    name: "Bitcoin USD",
    symbol: "BTCUSD",
    type: "Crypto",
    value: 64287.12,
    change: 1243.56,
    percentChange: 1.97,
    direction: "up",
    lastUpdated: new Date().toISOString(),
    description: "Bitcoin to USD exchange rate",
    sector: "Cryptocurrency",
    marketCap: 1250000000000,
    volume: 38765200000
  },
  {
    id: "ethusd",
    name: "Ethereum USD",
    symbol: "ETHUSD",
    type: "Crypto",
    value: 3074.23,
    change: -42.15,
    percentChange: -1.35,
    direction: "down",
    lastUpdated: new Date().toISOString(),
    description: "Ethereum to USD exchange rate",
    sector: "Cryptocurrency",
    marketCap: 370000000000,
    volume: 21398700000
  },
  {
    id: "aapl",
    name: "Apple Inc",
    symbol: "AAPL",
    type: "Stock",
    value: 173.32,
    change: 0.87,
    percentChange: 0.51,
    direction: "up",
    lastUpdated: new Date().toISOString(),
    description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
    sector: "Technology",
    marketCap: 2850000000000,
    volume: 43765000
  },
  {
    id: "msft",
    name: "Microsoft",
    symbol: "MSFT",
    type: "Stock",
    value: 412.65,
    change: -2.14,
    percentChange: -0.52,
    direction: "down",
    lastUpdated: new Date().toISOString(),
    description: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.",
    sector: "Technology",
    marketCap: 3120000000000,
    volume: 28765400
  }
];

// Get all market data
export const getAllMarketData = (): MarketDataItem[] => {
  return marketDataItems;
};

// Get market data by ID
export const getMarketDataById = (id: string): MarketDataItem | undefined => {
  return marketDataItems.find(item => item.id === id);
};

// Get filtered market data
export const getFilteredMarketData = (filters: {
  search?: string;
  type?: string;
  category?: string;
}): MarketDataItem[] => {
  let filtered = [...marketDataItems];
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(searchLower) || 
      item.symbol.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(item => item.type === filters.type);
  }
  
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(item => item.sector === filters.category);
  }
  
  return filtered;
};

// Get chart data for a specific symbol and timeframe
export const getChartDataForSymbol = (symbol: string, timeframe: Timeframe): TimeframeData[] => {
  // For now, we'll generate random data based on the symbol's first character code
  const baseValue = symbol.charCodeAt(0) * 10;
  const volatility = (symbol.charCodeAt(1) % 10) / 100 + 0.01;
  
  return generateTimeframeData(timeframe, baseValue, volatility);
};

// Add new market data item
export const addMarketDataItem = (item: Omit<MarketDataItem, 'id'>): MarketDataItem => {
  const newItem: MarketDataItem = {
    ...item,
    id: `${item.symbol.toLowerCase()}-${Date.now()}`,
    lastUpdated: new Date().toISOString()
  };
  
  marketDataItems.push(newItem);
  return newItem;
};

// Update existing market data item
export const updateMarketDataItem = (id: string, updates: Partial<MarketDataItem>): MarketDataItem | undefined => {
  const index = marketDataItems.findIndex(item => item.id === id);
  if (index === -1) return undefined;
  
  const updatedItem = {
    ...marketDataItems[index],
    ...updates,
    lastUpdated: new Date().toISOString()
  };
  
  marketDataItems[index] = updatedItem;
  return updatedItem;
};

// Delete market data item
export const deleteMarketDataItem = (id: string): boolean => {
  const index = marketDataItems.findIndex(item => item.id === id);
  if (index === -1) return false;
  
  marketDataItems.splice(index, 1);
  return true;
};
