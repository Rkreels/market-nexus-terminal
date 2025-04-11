
import { FC } from "react";
import { 
  BookOpen, 
  Search, 
  FileText, 
  Zap, 
  TrendingUp,
  User, 
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ResearchPanelProps {
  darkMode: boolean;
}

// Mock analyst reports
const analystReports = [
  {
    id: 1,
    title: "NVIDIA (NVDA) Q4 Earnings Analysis",
    firm: "Goldman Sachs",
    date: "2025-03-15",
    rating: "Buy",
    targetPrice: 950,
    currentPrice: 875.22,
    sector: "Technology"
  },
  {
    id: 2,
    title: "Tesla (TSLA) Electric Vehicle Market Share",
    firm: "Morgan Stanley",
    date: "2025-03-12",
    rating: "Overweight",
    targetPrice: 310,
    currentPrice: 280.32,
    sector: "Automotive"
  },
  {
    id: 3,
    title: "Amazon (AMZN) AWS Growth Outlook",
    firm: "JP Morgan",
    date: "2025-03-10",
    rating: "Buy",
    targetPrice: 225,
    currentPrice: 196.75,
    sector: "Technology"
  },
  {
    id: 4,
    title: "Apple (AAPL) iPhone 17 Product Cycle",
    firm: "Wedbush",
    date: "2025-03-08",
    rating: "Outperform",
    targetPrice: 240,
    currentPrice: 215.45,
    sector: "Technology"
  },
  {
    id: 5,
    title: "Microsoft (MSFT) Azure vs. Competition",
    firm: "Jefferies",
    date: "2025-03-05",
    rating: "Buy",
    targetPrice: 475,
    currentPrice: 429.90,
    sector: "Technology"
  }
];

// Mock insider transactions
const insiderTransactions = [
  {
    company: "Meta Platforms",
    symbol: "META",
    insider: "Mark Zuckerberg",
    position: "CEO",
    transactionType: "Sell",
    shares: 125000,
    price: 485.30,
    date: "2025-03-14"
  },
  {
    company: "Salesforce",
    symbol: "CRM",
    insider: "Marc Benioff",
    position: "CEO",
    transactionType: "Sell",
    shares: 10000,
    price: 285.75,
    date: "2025-03-12"
  },
  {
    company: "Microsoft",
    symbol: "MSFT",
    insider: "Satya Nadella",
    position: "CEO",
    transactionType: "Sell",
    shares: 5000,
    price: 432.15,
    date: "2025-03-10"
  },
  {
    company: "AMD",
    symbol: "AMD",
    insider: "Lisa Su",
    position: "CEO",
    transactionType: "Buy",
    shares: 25000,
    price: 178.30,
    date: "2025-03-08"
  }
];

const ResearchPanel: FC<ResearchPanelProps> = ({ darkMode }) => {
  return (
    <div className="space-y-4">
      {/* Search Area */}
      <Card className={cn(
        "border", 
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Research Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-2">
            <Input 
              className={cn(
                "flex-grow",
                darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"
              )}
              placeholder="Search for companies, sectors, or keywords..." 
            />
            <div className="flex gap-2">
              <Button>
                <Search className="w-4 h-4 mr-2" /> Search
              </Button>
              <Button variant="outline">
                <Globe className="w-4 h-4 mr-2" /> Advanced
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="secondary">Reports</Badge>
            <Badge variant="secondary">SEC Filings</Badge>
            <Badge variant="secondary">Earnings Calls</Badge>
            <Badge variant="secondary">Market Research</Badge>
            <Badge variant="secondary">Analyst Ratings</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Analyst Reports */}
        <Card className={cn(
          "border lg:col-span-2 h-[360px] overflow-auto", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Recent Analyst Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analystReports.map((report) => (
                <div 
                  key={report.id}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition hover:bg-opacity-70",
                    darkMode 
                      ? "bg-zinc-700 border-zinc-600 hover:bg-zinc-600" 
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{report.title}</h3>
                      <div className="text-sm opacity-70 mt-1">{report.firm} • {report.date}</div>
                    </div>
                    <Badge 
                      className={cn(
                        report.rating === "Buy" || report.rating === "Outperform" || report.rating === "Overweight"
                          ? "bg-green-600"
                          : report.rating === "Hold" || report.rating === "Neutral"
                            ? "bg-yellow-600"
                            : "bg-red-600"
                      )}
                    >
                      {report.rating}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-2 py-1 rounded",
                        darkMode ? "bg-zinc-600" : "bg-gray-200"
                      )}>
                        Target: ${report.targetPrice}
                      </span>
                      <span className={cn(
                        "px-2 py-1 rounded",
                        darkMode ? "bg-zinc-600" : "bg-gray-200"
                      )}>
                        Current: ${report.currentPrice}
                      </span>
                      <span>
                        {((report.targetPrice - report.currentPrice) / report.currentPrice * 100).toFixed(1)}% upside
                      </span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                      {report.sector}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insider Transactions */}
        <Card className={cn(
          "border h-[360px] overflow-auto", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <User className="w-5 h-5 mr-2" />
              Insider Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insiderTransactions.map((transaction, index) => (
                <div 
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border",
                    darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
                  )}
                >
                  <div className="flex justify-between">
                    <div className="font-medium">{transaction.symbol}</div>
                    <div 
                      className={cn(
                        "px-2 py-0.5 text-xs rounded-full",
                        transaction.transactionType === "Buy" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-red-500/20 text-red-400"
                      )}
                    >
                      {transaction.transactionType}
                    </div>
                  </div>
                  <div className="text-sm mt-1">{transaction.company}</div>
                  <div className="flex justify-between mt-2 text-sm">
                    <div>{transaction.insider}, {transaction.position}</div>
                    <div>{transaction.date}</div>
                  </div>
                  <div className="text-sm mt-1">
                    {transaction.shares.toLocaleString()} shares at ${transaction.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Research Summary */}
      <Card className={cn(
        "border", 
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "p-4 rounded-lg border",
            darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
          )}>
            <h3 className="font-medium text-lg mb-2">Technology Sector: Weekly Summary</h3>
            <p className="text-sm mb-3">
              Semiconductor stocks rallied this week amid optimism over AI demand and improved supply chains. 
              NVIDIA continued its upward trajectory (+8.3%) after reports of increased AI chip orders. 
              Cloud providers (AWS, Azure, GCP) reported strong enterprise migration trends, positively impacting their parent companies.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <div className={cn(
                "p-3 rounded border",
                darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-300"
              )}>
                <div className="text-sm font-medium mb-1">Key Winners</div>
                <div className="flex items-center text-green-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>NVDA, AMD, AVGO</span>
                </div>
              </div>
              <div className={cn(
                "p-3 rounded border",
                darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-300"
              )}>
                <div className="text-sm font-medium mb-1">Analyst Activity</div>
                <div className="text-sm">
                  16 upgrades, 5 downgrades this week
                </div>
              </div>
              <div className={cn(
                "p-3 rounded border",
                darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-300"
              )}>
                <div className="text-sm font-medium mb-1">Earnings Calendar</div>
                <div className="text-sm">
                  ORCL, ADBE reporting next week
                </div>
              </div>
            </div>
            <Button className="mt-4" size="sm">
              <BookOpen className="w-4 h-4 mr-2" /> Full AI Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchPanel;
