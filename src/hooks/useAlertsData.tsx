
import { useState, useEffect } from 'react';
import { Alert, Watchlist, WatchlistItem } from '@/types/marketData';
import { useToast } from "@/hooks/use-toast";

// Mock data
const initialAlerts: Alert[] = [
  {
    id: 1,
    type: "price",
    symbol: "AAPL",
    name: "Apple Inc.",
    condition: "above",
    value: 220,
    currentValue: 215.45,
    status: "pending",
    created: "2025-03-15"
  },
  {
    id: 2,
    type: "price",
    symbol: "MSFT",
    name: "Microsoft Corp.",
    condition: "below",
    value: 400,
    currentValue: 429.90,
    status: "triggered",
    triggered: "2025-03-14",
    created: "2025-03-10"
  },
  {
    id: 3,
    type: "volume",
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    condition: "above",
    value: 50000000,
    currentValue: 32541892,
    status: "pending",
    created: "2025-03-14"
  },
  {
    id: 4,
    type: "earnings",
    symbol: "TSLA",
    name: "Tesla Inc.",
    details: "Earnings announcement on 2025-04-22",
    status: "pending",
    created: "2025-03-12"
  },
  {
    id: 5,
    type: "news",
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    keyword: "acquisition",
    status: "triggered",
    triggered: "2025-03-10",
    details: "News about potential acquisition detected",
    created: "2025-03-05"
  }
];

const initialWatchlists: Watchlist[] = [
  {
    id: 1,
    name: "Tech Giants",
    symbols: [
      { symbol: "AAPL", name: "Apple Inc.", price: 215.45, change: 1.28, direction: "up" },
      { symbol: "MSFT", name: "Microsoft Corp.", price: 429.90, change: -0.75, direction: "down" },
      { symbol: "GOOGL", name: "Alphabet Inc.", price: 192.86, change: 0.54, direction: "up" },
      { symbol: "AMZN", name: "Amazon.com Inc.", price: 196.75, change: 2.12, direction: "up" },
      { symbol: "META", name: "Meta Platforms Inc.", price: 485.72, change: -1.32, direction: "down" }
    ]
  },
  {
    id: 2,
    name: "Semiconductors",
    symbols: [
      { symbol: "NVDA", name: "NVIDIA Corp.", price: 875.22, change: 3.89, direction: "up" },
      { symbol: "AMD", name: "Advanced Micro Devices", price: 178.57, change: 2.34, direction: "up" },
      { symbol: "INTC", name: "Intel Corp.", price: 45.32, change: -1.24, direction: "down" },
      { symbol: "TSM", name: "Taiwan Semiconductor", price: 142.18, change: 1.52, direction: "up" },
      { symbol: "MU", name: "Micron Technology", price: 98.43, change: 0.87, direction: "up" }
    ]
  }
];

export const useAlertsData = () => {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [watchlists, setWatchlists] = useState<Watchlist[]>(initialWatchlists);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>(initialAlerts);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Apply filters and search
  useEffect(() => {
    let result = [...alerts];
    
    // Apply type filters
    if (activeFilters.length > 0 && !activeFilters.includes("All")) {
      result = result.filter(alert => activeFilters.includes(alert.type));
    }
    
    // Apply status filters
    if (activeFilters.includes("Pending")) {
      result = result.filter(alert => alert.status === "pending");
    } else if (activeFilters.includes("Triggered")) {
      result = result.filter(alert => alert.status === "triggered");
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(alert => 
        alert.symbol.toLowerCase().includes(query) || 
        alert.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredAlerts(result);
  }, [alerts, activeFilters, searchQuery]);

  // Add new alert
  const addAlert = (alert: Omit<Alert, 'id' | 'status' | 'created'>) => {
    const newAlert: Alert = {
      id: alerts.length + 1,
      ...alert,
      status: "pending",
      created: new Date().toISOString().split('T')[0]
    };
    
    setAlerts([...alerts, newAlert]);
    toast({
      title: "Alert Created",
      description: `New alert for ${alert.symbol} has been created.`,
      duration: 3000,
    });
  };

  // Delete alert
  const deleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alert Deleted",
      description: "The alert has been removed.",
      duration: 3000,
    });
  };

  // Toggle alert status
  const toggleAlertStatus = (id: number) => {
    setAlerts(alerts.map(alert => {
      if (alert.id === id) {
        const newStatus = alert.status === "pending" ? "triggered" : "pending";
        return { 
          ...alert, 
          status: newStatus,
          triggered: newStatus === "triggered" ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return alert;
    }));
    
    toast({
      title: "Alert Status Updated",
      description: "The alert status has been toggled.",
      duration: 3000,
    });
  };

  // Add new watchlist
  const addWatchlist = (name: string) => {
    const newWatchlist: Watchlist = {
      id: watchlists.length + 1,
      name,
      symbols: []
    };
    
    setWatchlists([...watchlists, newWatchlist]);
    toast({
      title: "Watchlist Created",
      description: `New watchlist "${name}" has been created.`,
      duration: 3000,
    });
  };

  // Add symbol to watchlist
  const addSymbolToWatchlist = (watchlistId: number, symbol: WatchlistItem) => {
    setWatchlists(watchlists.map(watchlist => {
      if (watchlist.id === watchlistId) {
        // Check if symbol already exists
        if (watchlist.symbols.some(s => s.symbol === symbol.symbol)) {
          toast({
            title: "Symbol Already Exists",
            description: `${symbol.symbol} is already in this watchlist.`,
            duration: 3000,
          });
          return watchlist;
        }
        
        return {
          ...watchlist,
          symbols: [...watchlist.symbols, symbol]
        };
      }
      return watchlist;
    }));
    
    toast({
      title: "Symbol Added",
      description: `${symbol.symbol} has been added to the watchlist.`,
      duration: 3000,
    });
  };

  // Remove symbol from watchlist
  const removeSymbolFromWatchlist = (watchlistId: number, symbolId: string) => {
    setWatchlists(watchlists.map(watchlist => {
      if (watchlist.id === watchlistId) {
        return {
          ...watchlist,
          symbols: watchlist.symbols.filter(s => s.symbol !== symbolId)
        };
      }
      return watchlist;
    }));
    
    toast({
      title: "Symbol Removed",
      description: `Symbol has been removed from the watchlist.`,
      duration: 3000,
    });
  };

  // Delete watchlist
  const deleteWatchlist = (id: number) => {
    setWatchlists(watchlists.filter(watchlist => watchlist.id !== id));
    toast({
      title: "Watchlist Deleted",
      description: "The watchlist has been removed.",
      duration: 3000,
    });
  };

  // Filter handlers
  const toggleFilter = (filter: string) => {
    if (filter === "All") {
      setActiveFilters(["All"]);
      return;
    }
    
    // Remove "All" if another filter is selected
    let newFilters = activeFilters.filter(f => f !== "All");
    
    if (newFilters.includes(filter)) {
      newFilters = newFilters.filter(f => f !== filter);
    } else {
      newFilters.push(filter);
    }
    
    // If no filters selected, default to "All"
    setActiveFilters(newFilters.length === 0 ? ["All"] : newFilters);
  };

  return {
    alerts: filteredAlerts,
    watchlists,
    addAlert,
    deleteAlert,
    toggleAlertStatus,
    addWatchlist,
    addSymbolToWatchlist,
    removeSymbolFromWatchlist,
    deleteWatchlist,
    activeFilters,
    toggleFilter,
    searchQuery,
    setSearchQuery
  };
};
