
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
  categories?: string[];
  types?: string[];
  status?: string[];
  dates?: boolean;
  search?: boolean;
}

export interface TimeframeData {
  time: string;
  value: number;
}
