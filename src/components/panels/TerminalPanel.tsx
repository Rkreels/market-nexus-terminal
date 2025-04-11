import React, { FC, useState, useRef, useEffect } from "react";
import { 
  Terminal as TerminalIcon, 
  HelpCircle, 
  Search, 
  ArrowRight, 
  XCircle,
  Clock,
  FileText,
  Keyboard,
  SendHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TerminalPanelProps {
  darkMode: boolean;
}

interface CommandOutput {
  command: string;
  output: string | React.ReactNode;
  timestamp: string;
}

const TerminalPanel: FC<TerminalPanelProps> = ({ darkMode }) => {
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<CommandOutput[]>([]);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);
  
  const getCurrentTimestamp = () => {
    return new Date().toLocaleTimeString();
  };
  
  const handleCommand = () => {
    if (!input.trim()) return;
    
    let output: string | React.ReactNode = "Command not recognized. Type HELP for available commands.";
    
    const command = input.toUpperCase();
    
    if (command === "HELP") {
      output = (
        <div className="space-y-2">
          <div>Available Commands:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <div className="font-mono text-green-500">HELP</div>
              <div className="text-sm opacity-70">Show available commands</div>
            </div>
            <div>
              <div className="font-mono text-green-500">AAPL &lt;Equity&gt;</div>
              <div className="text-sm opacity-70">Show Apple stock details</div>
            </div>
            <div>
              <div className="font-mono text-green-500">AAPL &lt;Equity&gt; FA</div>
              <div className="text-sm opacity-70">Show Apple fundamentals</div>
            </div>
            <div>
              <div className="font-mono text-green-500">MSFT &lt;Equity&gt; EARN</div>
              <div className="text-sm opacity-70">Show Microsoft earnings</div>
            </div>
            <div>
              <div className="font-mono text-green-500">SPX &lt;Index&gt;</div>
              <div className="text-sm opacity-70">Show S&P 500 Index</div>
            </div>
            <div>
              <div className="font-mono text-green-500">WMT MSFT RATIO</div>
              <div className="text-sm opacity-70">Price ratio analysis</div>
            </div>
            <div>
              <div className="font-mono text-green-500">CL &lt;Commodity&gt;</div>
              <div className="text-sm opacity-70">Show Crude Oil futures</div>
            </div>
            <div>
              <div className="font-mono text-green-500">TOP MOVERS</div>
              <div className="text-sm opacity-70">Show top market movers</div>
            </div>
            <div>
              <div className="font-mono text-green-500">FOMC</div>
              <div className="text-sm opacity-70">FOMC meeting schedule</div>
            </div>
            <div>
              <div className="font-mono text-green-500">CLEAR</div>
              <div className="text-sm opacity-70">Clear terminal output</div>
            </div>
          </div>
        </div>
      );
    } 
    else if (command === "CLEAR") {
      setCommandHistory([]);
      return;
    }
    else if (command === "AAPL <EQUITY>" || command === "AAPL" || command === "AAPL EQUITY") {
      output = (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-lg">Apple Inc (AAPL)</div>
              <div className="text-sm opacity-70">NASDAQ GS - NASDAQ GS Real-time Price. Currency in USD</div>
            </div>
            <div className="text-green-500 font-medium text-lg">$215.45 +1.28 (0.60%)</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-2">
            <div>
              <div className="text-xs opacity-70">Previous Close</div>
              <div>214.17</div>
            </div>
            <div>
              <div className="text-xs opacity-70">Open</div>
              <div>213.76</div>
            </div>
            <div>
              <div className="text-xs opacity-70">Day Range</div>
              <div>213.25 - 216.20</div>
            </div>
            <div>
              <div className="text-xs opacity-70">52-Week Range</div>
              <div>164.32 - 232.15</div>
            </div>
            <div>
              <div className="text-xs opacity-70">Volume</div>
              <div>41.58M</div>
            </div>
            <div>
              <div className="text-xs opacity-70">Avg. Volume</div>
              <div>54.82M</div>
            </div>
            <div>
              <div className="text-xs opacity-70">Market Cap</div>
              <div>3.38T</div>
            </div>
            <div>
              <div className="text-xs opacity-70">P/E Ratio</div>
              <div>33.76</div>
            </div>
          </div>
          <div className="text-xs opacity-70">As of March 15, 2025 4:00 PM EDT. Market open.</div>
        </div>
      );
    }
    else if (command === "AAPL <EQUITY> FA" || command === "AAPL EQUITY FA" || command === "AAPL FA")  {
      output = (
        <div className="space-y-3">
          <div className="font-medium text-lg">Apple Inc (AAPL) - Fundamental Analysis</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
            <div>
              <div className="text-xs opacity-70">P/E Ratio (TTM)</div>
              <div>33.76</div>
            </div>
            <div>
              <div className="text-xs opacity-70">EPS (TTM)</div>
              <div>$6.38</div>
            </div>
            <div>
              <div className="text-xs opacity-70">PEG Ratio</div>
              <div>2.75</div>
            </div>
            <div>
              <div className="text-xs opacity-70">P/S Ratio</div>
              <div>8.34</div>
            </div>
            <div>
              <div className="text-xs opacity-70">P/B Ratio</div>
              <div>42.18</div>
            </div>
            <div>
              <div className="text-xs opacity-70">Dividend Yield</div>
              <div>0.48%</div>
            </div>
            <div>
              <div className="text-xs opacity-70">Revenue (TTM)</div>
              <div>$405.73B</div>
            </div>
            <div>
              <div className="text-xs opacity-70">Gross Margin</div>
              <div>45.2%</div>
            </div>
            <div>
              <div className="text-xs opacity-70">Operating Margin</div>
              <div>31.1%</div>
            </div>
            <div>
              <div className="text-xs opacity-70">ROE</div>
              <div>162.8%</div>
            </div>
            <div>
              <div className="text-xs opacity-70">ROA</div>
              <div>30.1%</div>
            </div>
            <div>
              <div className="text-xs opacity-70">Debt to Equity</div>
              <div>1.75</div>
            </div>
          </div>
          <div className="font-medium mt-2">Analyst Recommendations</div>
          <div className="grid grid-cols-5 gap-2 text-center">
            <div className="text-green-500 font-medium">Buy: 28</div>
            <div className="text-green-400">Outperform: 8</div>
            <div>Hold: 11</div>
            <div className="text-red-400">Underperform: 3</div>
            <div className="text-red-500">Sell: 1</div>
          </div>
        </div>
      );
    } 
    else if (command === "SPX <INDEX>" || command === "SPX" || command === "SPX INDEX") {
      output = (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-lg">S&P 500 Index (SPX)</div>
              <div className="text-sm opacity-70">Chicago - Chicago Real-time Price</div>
            </div>
            <div className="text-green-500 font-medium text-lg">5,234.18 +15.87 (0.30%)</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-2">
            <div>
              <div className="text-xs opacity-70">Previous Close</div>
              <div>5,218.31</div>
            </div>
            <div>
              <div className="text-xs opacity-70">Open</div>
              <div>5,220.45</div>
            </div>
            <div>
              <div className="text-xs opacity-70">Day Range</div>
              <div>5,214.65 - 5,238.52</div>
            </div>
            <div>
              <div className="text-xs opacity-70">52-Week Range</div>
              <div>4,123.15 - 5,264.85</div>
            </div>
            <div>
              <div className="text-xs opacity-70">P/E Ratio</div>
              <div>28.76</div>
            </div>
            <div>
              <div className="text-xs opacity-70">Dividend Yield</div>
              <div>1.32%</div>
            </div>
          </div>
          <div className="text-xs opacity-70">As of March 15, 2025 4:00 PM EDT. Market open.</div>
        </div>
      );
    }
    else if (command === "TOP MOVERS") {
      output = (
        <div className="space-y-3">
          <div className="font-medium">Top Market Movers - S&P 500</div>
          
          <div>
            <div className="font-medium mb-1">Top Gainers</div>
            <div className="overflow-x-auto">
              <table className={cn(
                "w-full text-sm",
                darkMode ? "text-gray-200" : "text-gray-600"
              )}>
                <thead>
                  <tr className={cn(
                    "border-b",
                    darkMode ? "border-gray-700" : "border-gray-300"
                  )}>
                    <th className="text-left py-2 px-3">Symbol</th>
                    <th className="text-left py-2 px-3">Company</th>
                    <th className="text-right py-2 px-3">Price</th>
                    <th className="text-right py-2 px-3">Change</th>
                    <th className="text-right py-2 px-3">% Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-3">NVDA</td>
                    <td className="py-2 px-3">NVIDIA Corp</td>
                    <td className="py-2 px-3 text-right">$875.22</td>
                    <td className="py-2 px-3 text-right text-green-500">+34.18</td>
                    <td className="py-2 px-3 text-right text-green-500">+4.07%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">AMD</td>
                    <td className="py-2 px-3">Advanced Micro Devices</td>
                    <td className="py-2 px-3 text-right">$178.57</td>
                    <td className="py-2 px-3 text-right text-green-500">+6.42</td>
                    <td className="py-2 px-3 text-right text-green-500">+3.73%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">META</td>
                    <td className="py-2 px-3">Meta Platforms Inc</td>
                    <td className="py-2 px-3 text-right">$485.72</td>
                    <td className="py-2 px-3 text-right text-green-500">+12.84</td>
                    <td className="py-2 px-3 text-right text-green-500">+2.72%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <div className="font-medium mb-1">Top Losers</div>
            <div className="overflow-x-auto">
              <table className={cn(
                "w-full text-sm",
                darkMode ? "text-gray-200" : "text-gray-600"
              )}>
                <thead>
                  <tr className={cn(
                    "border-b",
                    darkMode ? "border-gray-700" : "border-gray-300"
                  )}>
                    <th className="text-left py-2 px-3">Symbol</th>
                    <th className="text-left py-2 px-3">Company</th>
                    <th className="text-right py-2 px-3">Price</th>
                    <th className="text-right py-2 px-3">Change</th>
                    <th className="text-right py-2 px-3">% Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-3">INTC</td>
                    <td className="py-2 px-3">Intel Corp</td>
                    <td className="py-2 px-3 text-right">$45.32</td>
                    <td className="py-2 px-3 text-right text-red-500">-2.18</td>
                    <td className="py-2 px-3 text-right text-red-500">-4.59%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">CVX</td>
                    <td className="py-2 px-3">Chevron Corp</td>
                    <td className="py-2 px-3 text-right">$155.37</td>
                    <td className="py-2 px-3 text-right text-red-500">-4.92</td>
                    <td className="py-2 px-3 text-right text-red-500">-3.07%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">WMT</td>
                    <td className="py-2 px-3">Walmart Inc</td>
                    <td className="py-2 px-3 text-right">$72.15</td>
                    <td className="py-2 px-3 text-right text-red-500">-1.87</td>
                    <td className="py-2 px-3 text-right text-red-500">-2.53%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
    else if (command === "FOMC") {
      output = (
        <div className="space-y-3">
          <div className="font-medium text-lg">FOMC Meeting Schedule 2025</div>
          <div className="overflow-x-auto">
            <table className={cn(
              "w-full text-sm",
              darkMode ? "text-gray-200" : "text-gray-600"
            )}>
              <thead>
                <tr className={cn(
                  "border-b",
                  darkMode ? "border-gray-700" : "border-gray-300"
                )}>
                  <th className="text-left py-2 px-3">Meeting Date</th>
                  <th className="text-left py-2 px-3">Statement Release</th>
                  <th className="text-left py-2 px-3">Press Conference</th>
                  <th className="text-left py-2 px-3">Minutes Release</th>
                </tr>
              </thead>
              <tbody>
                <tr className={cn(
                  "bg-amber-500/10 border-amber-600/30 border-l-4"
                )}>
                  <td className="py-2 px-3">March 19-20</td>
                  <td className="py-2 px-3">March 20, 2:00 PM ET</td>
                  <td className="py-2 px-3">March 20, 2:30 PM ET</td>
                  <td className="py-2 px-3">April 10</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">April 30-May 1</td>
                  <td className="py-2 px-3">May 1, 2:00 PM ET</td>
                  <td className="py-2 px-3">May 1, 2:30 PM ET</td>
                  <td className="py-2 px-3">May 22</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">June 11-12</td>
                  <td className="py-2 px-3">June 12, 2:00 PM ET</td>
                  <td className="py-2 px-3">June 12, 2:30 PM ET</td>
                  <td className="py-2 px-3">July 3</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">July 30-31</td>
                  <td className="py-2 px-3">July 31, 2:00 PM ET</td>
                  <td className="py-2 px-3">July 31, 2:30 PM ET</td>
                  <td className="py-2 px-3">August 21</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">September 17-18</td>
                  <td className="py-2 px-3">September 18, 2:00 PM ET</td>
                  <td className="py-2 px-3">September 18, 2:30 PM ET</td>
                  <td className="py-2 px-3">October 9</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-amber-500 flex items-center text-sm">
            <Clock className="w-4 h-4 mr-2" />
            Next meeting: March 19-20, 2025 (4 days from now)
          </div>
        </div>
      );
    }
    
    setCommandHistory([
      ...commandHistory, 
      { 
        command: input, 
        output, 
        timestamp: getCurrentTimestamp() 
      }
    ]);
    
    setInput("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className={cn(
        "border md:col-span-3", 
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center justify-between">
            <div className="flex items-center">
              <TerminalIcon className="w-5 h-5 mr-2" />
              Bloomberg Terminal Command Interface
            </div>
            <Button size="sm" variant="outline" onClick={() => setCommandHistory([])}>
              <XCircle className="w-4 h-4 mr-2" /> Clear
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={terminalRef}
            className={cn(
              "h-[500px] font-mono text-sm p-4 rounded-lg mb-4 overflow-y-auto", 
              darkMode ? "bg-black" : "bg-gray-900 text-gray-100"
            )}
          >
            <div className="border-b border-dashed border-gray-600 pb-2 mb-2">
              <div className="text-green-400">Bloomberg Professional Terminal v2025.3</div>
              <div className="text-green-400">Type HELP for available commands</div>
            </div>
            
            {commandHistory.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center text-yellow-500">
                  <ArrowRight className="w-3 h-3 mr-1" />
                  <span className="opacity-50">[{item.timestamp}]</span>
                  <span className="ml-2">{item.command}</span>
                </div>
                <div className="ml-4 mt-1 text-gray-100">{item.output}</div>
              </div>
            ))}
            
            <div className="flex items-center text-yellow-500 animate-pulse">
              <ArrowRight className="w-3 h-3 mr-1" />
              <span className="opacity-50">[{getCurrentTimestamp()}]</span>
              <span className="ml-2 mr-1">_</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input 
              placeholder="Enter command..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCommand()}
              className={cn(
                "font-mono",
                darkMode ? "bg-zinc-700 border-zinc-600" : "border-gray-300"
              )}
            />
            <Button onClick={handleCommand}>
              <SendHorizontal className="w-4 h-4 mr-2" />
              Execute
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className={cn(
        "border", 
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <HelpCircle className="w-5 h-5 mr-2" />
            Terminal Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={cn(
              "p-3 rounded-lg border",
              darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
            )}>
              <div className="flex items-center font-medium mb-1">
                <FileText className="w-4 h-4 mr-1" />
                Quick Reference
              </div>
              <div className="text-sm space-y-1">
                <div><span className="font-mono text-green-500">HELP</span> - Show all commands</div>
                <div><span className="font-mono text-green-500">[TICKER]</span> - Display quote</div>
                <div><span className="font-mono text-green-500">[TICKER] FA</span> - Fundamentals</div>
                <div><span className="font-mono text-green-500">TOP MOVERS</span> - Market movers</div>
                <div><span className="font-mono text-green-500">FOMC</span> - Fed meeting schedule</div>
              </div>
            </div>
            
            <div className={cn(
              "p-3 rounded-lg border",
              darkMode ? "bg-zinc-700 border-zinc-600" : "bg-gray-50 border-gray-200"
            )}>
              <div className="flex items-center font-medium mb-1">
                <Keyboard className="w-4 h-4 mr-1" />
                Keyboard Shortcuts
              </div>
              <div className="text-sm space-y-1">
                <div><span className="font-mono">Enter</span> - Execute command</div>
                <div><span className="font-mono">Up/Down</span> - Command history</div>
                <div><span className="font-mono">Tab</span> - Autocomplete</div>
                <div><span className="font-mono">Esc</span> - Clear input</div>
              </div>
            </div>
            
            <div>
              <Button size="sm" className="w-full">
                <HelpCircle className="w-4 h-4 mr-2" />
                Full Documentation
              </Button>
            </div>
            
            <div className="text-xs text-center opacity-70 mt-2">
              Try typing a sample command like<br />
              <Badge variant="outline" className="mt-1">AAPL</Badge> or <Badge variant="outline">SPX</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TerminalPanel;
