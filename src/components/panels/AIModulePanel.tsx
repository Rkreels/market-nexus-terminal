
import { FC, useState } from "react";
import { 
  Bot, 
  Search, 
  Send, 
  Sparkles, 
  TrendingUp, 
  BarChart3, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AIModulePanelProps {
  darkMode: boolean;
}

// Mock AI insights data
const aiInsights = [
  {
    title: "NVIDIA (NVDA) Outlook",
    content: "AI demand continues to drive NVDA's growth with potential upside of 14% based on order backlog metrics and new chip announcements.",
    sentiment: "bullish",
    confidence: 87,
    timestamp: "15 mins ago"
  },
  {
    title: "Tech Sector Momentum",
    content: "Tech sector showing strong momentum with positive earnings surprises 12% above consensus. Software and semiconductor subsectors particularly strong.",
    sentiment: "bullish",
    confidence: 82,
    timestamp: "35 mins ago"
  },
  {
    title: "Tesla (TSLA) Production",
    content: "Satellite imagery analysis shows Tesla Giga Berlin production may miss Q1 targets by 8-12% based on shipping container counts and employee parking.",
    sentiment: "bearish",
    confidence: 76,
    timestamp: "1 hour ago"
  },
  {
    title: "Energy Sector Volatility",
    content: "Natural language processing of OPEC+ statements suggests potential surprise production cuts in April meeting, impacting energy stocks.",
    sentiment: "neutral",
    confidence: 64,
    timestamp: "2 hours ago"
  }
];

// Mock AI trading signals
const aiTradingSignals = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    signal: "buy",
    price: 215.45,
    targetPrice: 242.50,
    stopLoss: 198.75,
    confidence: 84,
    timeFrame: "3-6 months"
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    signal: "buy",
    price: 189.62,
    targetPrice: 210.00,
    stopLoss: 178.50,
    confidence: 78,
    timeFrame: "1-3 months"
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    signal: "hold",
    price: 196.75,
    targetPrice: 205.00,
    stopLoss: 185.50,
    confidence: 65,
    timeFrame: "1-3 months"
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
    signal: "sell",
    price: 638.21,
    targetPrice: 590.00,
    stopLoss: 670.00,
    confidence: 72,
    timeFrame: "1-3 months"
  }
];

// Mock chat history
const initialChatHistory = [
  {
    role: "assistant",
    content: "Hello! I'm your AI market assistant. How can I help you analyze the markets today?"
  }
];

const AIModulePanel: FC<AIModulePanelProps> = ({ darkMode }) => {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState(initialChatHistory);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { role: "user", content: input }]);
    
    // Simulate AI response
    setTimeout(() => {
      let response;
      
      if (input.toLowerCase().includes("nasdaq") || input.toLowerCase().includes("market")) {
        response = "The NASDAQ Composite is currently up 0.7% at 16,427, led by semiconductor stocks. The index is trading above its 50-day moving average with positive momentum indicators.";
      } else if (input.toLowerCase().includes("recession") || input.toLowerCase().includes("outlook")) {
        response = "Our AI models currently estimate a 34% probability of a U.S. recession in the next 12 months, down from 42% last quarter. Leading indicators like the yield curve and employment data have improved.";
      } else if (input.toLowerCase().includes("tesla") || input.toLowerCase().includes("tsla")) {
        response = "TSLA is currently showing mixed signals. While production metrics indicate possible Q1 weakness, sentiment analysis from social media and earnings calls remains neutral to positive. Our AI model has a HOLD recommendation with 65% confidence.";
      } else {
        response = "Based on my analysis, market conditions are currently showing mixed signals. The S&P 500 has a positive momentum but watch for resistance at the 5,200 level. I can provide more specific insights if you ask about particular stocks or sectors.";
      }
      
      setChatHistory(prev => [...prev, { role: "assistant", content: response }]);
    }, 1000);
    
    // Clear input
    setInput("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* AI Chat Assistant */}
      <Card className={cn(
        "border lg:col-span-2", 
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="w-5 h-5 mr-2" />
              Market Intelligence Assistant
            </div>
            <Button size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" /> Reset Chat
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "h-[500px] mb-4 p-4 rounded-lg overflow-y-auto", 
            darkMode ? "bg-zinc-700" : "bg-gray-50"
          )}>
            {chatHistory.map((message, index) => (
              <div 
                key={index} 
                className={cn(
                  "mb-4 max-w-[80%] p-3 rounded-lg",
                  message.role === "user" 
                    ? "ml-auto bg-blue-600 text-white" 
                    : darkMode 
                      ? "bg-zinc-800 border border-zinc-600" 
                      : "bg-white border border-gray-200"
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center mb-1">
                    <Bot className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">AI Assistant</span>
                  </div>
                )}
                <div>{message.content}</div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input 
              placeholder="Ask something about the markets..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className={cn(
                darkMode ? "bg-zinc-700 border-zinc-600" : "border-gray-300"
              )}
            />
            <Button onClick={handleSendMessage}>
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge 
              variant="outline" 
              className={cn(
                "cursor-pointer",
                darkMode ? "hover:bg-zinc-700" : "hover:bg-gray-100"
              )}
              onClick={() => setInput("What's the outlook for the NASDAQ today?")}
            >
              NASDAQ outlook
            </Badge>
            <Badge 
              variant="outline" 
              className={cn(
                "cursor-pointer",
                darkMode ? "hover:bg-zinc-700" : "hover:bg-gray-100"
              )}
              onClick={() => setInput("What's the probability of a recession?")}
            >
              Recession probability
            </Badge>
            <Badge 
              variant="outline" 
              className={cn(
                "cursor-pointer",
                darkMode ? "hover:bg-zinc-700" : "hover:bg-gray-100"
              )}
              onClick={() => setInput("Analyze Tesla (TSLA) stock")}
            >
              Analyze TSLA
            </Badge>
            <Badge 
              variant="outline" 
              className={cn(
                "cursor-pointer",
                darkMode ? "hover:bg-zinc-700" : "hover:bg-gray-100"
              )}
              onClick={() => setInput("Show me undervalued tech stocks")}
            >
              Undervalued tech
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights and Signals */}
      <div className="space-y-4">
        {/* AI Market Insights */}
        <Card className={cn(
          "border", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              AI Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiInsights.map((insight, index) => (
                <div 
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border",
                    darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium">{insight.title}</div>
                    <Badge 
                      className={cn(
                        insight.sentiment === "bullish" ? "bg-green-600" :
                        insight.sentiment === "bearish" ? "bg-red-600" :
                        "bg-blue-600"
                      )}
                    >
                      {insight.sentiment}
                    </Badge>
                  </div>
                  <div className="text-sm mt-1">
                    {insight.content}
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <div className="opacity-70">{insight.timestamp}</div>
                    <div>Confidence: {insight.confidence}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Trading Signals */}
        <Card className={cn(
          "border", 
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                AI Trading Signals
              </div>
              <Button size="sm" variant="outline">
                <Search className="w-4 h-4 mr-2" /> Custom Scan
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiTradingSignals.map((signal) => (
                <div 
                  key={signal.symbol}
                  className={cn(
                    "p-3 rounded-lg border",
                    darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{signal.symbol}</div>
                      <div className="text-xs opacity-70">{signal.name}</div>
                    </div>
                    <Badge 
                      className={cn(
                        signal.signal === "buy" ? "bg-green-600" :
                        signal.signal === "sell" ? "bg-red-600" :
                        "bg-blue-600"
                      )}
                    >
                      {signal.signal.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
                    <div>
                      <span className="opacity-70">Price: </span>
                      <span className="font-medium">${signal.price}</span>
                    </div>
                    <div>
                      <span className="opacity-70">Target: </span>
                      <span className={cn(
                        "font-medium flex items-center",
                        signal.targetPrice > signal.price ? "text-green-500" : "text-red-500"
                      )}>
                        ${signal.targetPrice}
                        {signal.targetPrice > signal.price ? (
                          <ArrowUpRight className="w-3 h-3 ml-1" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 ml-1" />
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="opacity-70">Stop: </span>
                      <span className="font-medium">${signal.stopLoss}</span>
                    </div>
                    <div>
                      <span className="opacity-70">Timeframe: </span>
                      <span className="font-medium">{signal.timeFrame}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-dashed flex justify-between items-center text-xs">
                    <div>Confidence: {signal.confidence}%</div>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      <BarChart3 className="w-3 h-3 mr-1" /> Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIModulePanel;
