
export interface MarketDataItem {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto' | 'etf' | 'index' | 'commodity';
  value: number;
  change: number;
  percentChange: number;
  direction: 'up' | 'down';
  sector?: string;
  lastUpdated: string;
}
