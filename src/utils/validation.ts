
import { z } from 'zod';

// Market Data validation schema
export const marketDataSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required').max(10, 'Symbol too long'),
  name: z.string().min(1, 'Company name is required'),
  type: z.enum(['stock', 'crypto', 'etf', 'index', 'commodity']),
  value: z.number().positive('Price must be positive'),
  sector: z.string().optional()
});

// Watchlist validation schema
export const watchlistSchema = z.object({
  name: z.string().min(1, 'Watchlist name is required').max(50, 'Name too long')
});

// Portfolio holding validation schema
export const holdingSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required').max(10, 'Symbol too long'),
  shares: z.number().positive('Shares must be positive'),
  avgPrice: z.number().positive('Average price must be positive')
});

// Alert validation schema
export const alertSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required').max(10, 'Symbol too long'),
  name: z.string().min(1, 'Company name is required'),
  type: z.enum(['price', 'volume', 'change']),
  condition: z.enum(['above', 'below', 'equals']),
  value: z.number().positive('Target value must be positive')
});

// Symbol validation schema
export const symbolSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required').max(10, 'Symbol too long')
});

export type MarketDataFormData = z.infer<typeof marketDataSchema>;
export type WatchlistFormData = z.infer<typeof watchlistSchema>;
export type HoldingFormData = z.infer<typeof holdingSchema>;
export type AlertFormData = z.infer<typeof alertSchema>;
export type SymbolFormData = z.infer<typeof symbolSchema>;
