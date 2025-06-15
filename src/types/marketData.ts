
export interface MarketDataItem {
  id: string;
  name: string;
  symbol: string;
  type: string;
  value: number;
  change: number;
  percentChange: number;
  direction: "up" | "down";
  lastUpdated?: string;
  description?: string;
  sector?: string;
  marketCap?: number;
  volume?: number;
}

export interface FilterOptions {
  categories?: boolean;
  types?: boolean;
  status?: boolean;
  dates?: boolean;
  search?: boolean;
}

export interface TimeframeData {
  time: string;
  value: number;
}

export interface Alert {
  id: number;
  type: string;
  symbol: string;
  name: string;
  condition?: string;
  value?: number;
  currentValue?: number;
  status: "pending" | "triggered";
  created: string;
  triggered?: string;
  details?: string;
  keyword?: string;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  direction: "up" | "down";
}

export interface Watchlist {
  id: number;
  name: string;
  symbols: WatchlistItem[];
}
