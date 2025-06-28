
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
  volume?: number;
  marketCap?: number;
  description?: string;
}

export interface Alert {
  id: number;
  type: string;
  symbol: string;
  name: string;
  condition?: string;
  value?: number;
  currentValue?: number;
  status: 'pending' | 'triggered';
  created: string;
  triggered?: string;
  keyword?: string;
  details?: string;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  direction: 'up' | 'down';
}

export interface Watchlist {
  id: number;
  name: string;
  symbols: WatchlistItem[];
}

export interface TimeframeData {
  time: string;
  value: number;
  volume?: number;
}

export type Timeframe = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y';
