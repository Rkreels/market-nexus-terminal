
import { Timeframe } from "@/utils/timeframeUtils";

// Mock watchlist data
export const getWatchlistItems = () => {
  return [
    { id: "aapl", symbol: "AAPL", name: "Apple Inc.", price: 173.45, change: 2.31, changePercent: 1.35, direction: "up" },
    { id: "msft", symbol: "MSFT", name: "Microsoft Corp.", price: 329.78, change: -1.25, changePercent: -0.38, direction: "down" },
    { id: "googl", symbol: "GOOGL", name: "Alphabet Inc.", price: 138.21, change: 0.75, changePercent: 0.55, direction: "up" },
    { id: "amzn", symbol: "AMZN", name: "Amazon.com Inc.", price: 178.35, change: 3.28, changePercent: 1.87, direction: "up" },
    { id: "nvda", symbol: "NVDA", name: "NVIDIA Corp.", price: 840.12, change: -15.34, changePercent: -1.79, direction: "down" },
    { id: "tsla", symbol: "TSLA", name: "Tesla Inc.", price: 178.21, change: -3.41, changePercent: -1.88, direction: "down" }
  ];
};

// Mock news data
export const getNewsItems = () => {
  return [
    { 
      id: "news1", 
      title: "Federal Reserve Keeps Interest Rates Unchanged", 
      source: "Financial Times", 
      date: "2025-04-12T14:32:00Z", 
      category: "Economy", 
      summary: "The Federal Reserve has decided to maintain current interest rates following the latest FOMC meeting." 
    },
    { 
      id: "news2", 
      title: "Apple Announces New Product Line", 
      source: "TechCrunch", 
      date: "2025-04-12T10:15:00Z", 
      category: "Technology", 
      summary: "Apple unveiled its latest innovations at a special event today, including new AI-powered devices." 
    },
    { 
      id: "news3", 
      title: "Oil Prices Surge Amid Middle East Tensions", 
      source: "Bloomberg", 
      date: "2025-04-11T21:45:00Z", 
      category: "Commodities", 
      summary: "Crude oil futures climbed over 3% as geopolitical concerns in the Middle East intensified." 
    },
    { 
      id: "news4", 
      title: "Microsoft Expands Cloud Services", 
      source: "Wall Street Journal", 
      date: "2025-04-11T16:20:00Z", 
      category: "Technology", 
      summary: "Microsoft announced major expansions to its Azure cloud platform, targeting enterprise customers." 
    },
    { 
      id: "news5", 
      title: "S&P 500 Reaches New All-Time High", 
      source: "CNBC", 
      date: "2025-04-10T22:00:00Z", 
      category: "Markets", 
      summary: "The S&P 500 index closed at a record high, led by technology and healthcare sectors." 
    }
  ];
};

// Mock research reports
export const getResearchReports = () => {
  return [
    { 
      id: "report1", 
      title: "Technology Sector Outlook Q2 2025", 
      author: "J. Smith", 
      date: "2025-04-01", 
      category: "Sector Analysis", 
      rating: "Bullish" 
    },
    { 
      id: "report2", 
      title: "AAPL Stock Analysis", 
      author: "M. Johnson", 
      date: "2025-04-05", 
      category: "Equity Research", 
      rating: "Buy" 
    },
    { 
      id: "report3", 
      title: "Renewable Energy Market Trends", 
      author: "S. Williams", 
      date: "2025-03-28", 
      category: "Industry Analysis", 
      rating: "Overweight" 
    },
    { 
      id: "report4", 
      title: "Global Economic Outlook 2025", 
      author: "A. Brown", 
      date: "2025-03-15", 
      category: "Macroeconomics", 
      rating: "Neutral" 
    }
  ];
};

// Mock portfolio holdings
export const getPortfolioHoldings = () => {
  return [
    { id: "hold1", symbol: "AAPL", name: "Apple Inc.", shares: 50, avgPrice: 150.25, currentPrice: 173.45, value: 8672.50, change: 15.44 },
    { id: "hold2", symbol: "MSFT", name: "Microsoft Corp.", shares: 30, avgPrice: 280.50, currentPrice: 329.78, value: 9893.40, change: 17.57 },
    { id: "hold3", symbol: "GOOGL", name: "Alphabet Inc.", shares: 20, avgPrice: 125.75, currentPrice: 138.21, value: 2764.20, change: 9.91 },
    { id: "hold4", symbol: "AMZN", name: "Amazon.com Inc.", shares: 15, avgPrice: 160.30, currentPrice: 178.35, value: 2675.25, change: 11.26 },
    { id: "hold5", symbol: "VTI", name: "Vanguard Total Stock Market ETF", shares: 100, avgPrice: 210.45, currentPrice: 238.72, value: 23872.00, change: 13.43 }
  ];
};

// Mock alerts
export const getAlerts = () => {
  return [
    { id: "alert1", symbol: "AAPL", condition: "Price above", value: 180, status: "Active", createdAt: "2025-04-01" },
    { id: "alert2", symbol: "MSFT", condition: "Price below", value: 300, status: "Triggered", createdAt: "2025-04-02" },
    { id: "alert3", symbol: "SPY", condition: "Volume above", value: 100000000, status: "Active", createdAt: "2025-04-05" },
    { id: "alert4", symbol: "TSLA", condition: "Price change", value: 5, status: "Active", createdAt: "2025-04-08" },
    { id: "alert5", symbol: "NVDA", condition: "Price above", value: 850, status: "Active", createdAt: "2025-04-10" }
  ];
};

// Get data for charts based on timeframe
export const getChartData = (symbol: string, timeframe: Timeframe) => {
  const basePrice = {
    AAPL: 173.45,
    MSFT: 329.78,
    GOOGL: 138.21,
    AMZN: 178.35,
    NVDA: 840.12,
    TSLA: 178.21,
    SPY: 498.75,
    QQQ: 426.88,
    BTC: 67893.21
  }[symbol.toUpperCase()] || 100;
  
  const volatility = 0.02;
  let dataPoints = [];
  let currentValue = basePrice;
  
  const applyChange = () => {
    const change = Math.random() * volatility * 2 - volatility;
    return currentValue * (1 + change);
  };
  
  const pointsCount = {
    '1D': 8,
    '1W': 5,
    '1M': 20,
    '3M': 60,
    '6M': 120,
    '1Y': 250,
    '5Y': 60,
    'ALL': 100
  }[timeframe];
  
  for (let i = 0; i < pointsCount; i++) {
    currentValue = applyChange();
    dataPoints.push({ 
      time: i.toString(), 
      value: parseFloat(currentValue.toFixed(2)) 
    });
  }
  
  return dataPoints;
};
