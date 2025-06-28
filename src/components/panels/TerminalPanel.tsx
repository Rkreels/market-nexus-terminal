
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TerminalPanelProps {
  darkMode: boolean;
}

interface TerminalCommand {
  input: string;
  output: string;
  timestamp: Date;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ darkMode }) => {
  const [commands, setCommands] = useState<TerminalCommand[]>([
    { input: '', output: 'Market Nexus Terminal v1.0\nType "help" for available commands.', timestamp: new Date() }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [commands]);

  const executeCommand = (input: string) => {
    const trimmedInput = input.trim();
    let output = '';

    switch (trimmedInput.toLowerCase()) {
      case 'help':
        output = `Available commands:
• quote [SYMBOL] - Get stock quote
• portfolio - View portfolio summary
• watchlist - Show watchlist
• news - Latest market news
• alerts - View active alerts
• clear - Clear terminal
• time - Show current time
• market - Market status`;
        break;
      case 'clear':
        setCommands([]);
        return;
      case 'time':
        output = `Current time: ${new Date().toLocaleString()}`;
        break;
      case 'market':
        output = `Market Status: OPEN
NYSE: Open (9:30 AM - 4:00 PM ET)
NASDAQ: Open (9:30 AM - 4:00 PM ET)`;
        break;
      case 'portfolio':
        output = `Portfolio Summary:
Total Value: $125,450.23
Day Change: +$1,234.56 (+0.99%)
Holdings: 12 positions`;
        break;
      case 'watchlist':
        output = `Watchlist:
AAPL: $178.45 (+1.2%)
MSFT: $415.20 (-0.8%)
GOOGL: $140.25 (+0.5%)`;
        break;
      case 'news':
        output = `Latest Market News:
• Fed maintains interest rates at 5.25-5.50%
• Tech stocks rally on AI optimism
• Oil prices surge on supply concerns`;
        break;
      case 'alerts':
        output = `Active Alerts:
• AAPL above $180.00 (Pending)
• TSLA below $200.00 (Pending)`;
        break;
      default:
        if (trimmedInput.startsWith('quote ')) {
          const symbol = trimmedInput.split(' ')[1]?.toUpperCase();
          if (symbol) {
            output = `${symbol}: $${(Math.random() * 500 + 50).toFixed(2)} ${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 5).toFixed(2)}%`;
          } else {
            output = 'Usage: quote [SYMBOL]';
          }
        } else if (trimmedInput === '') {
          return;
        } else {
          output = `Command not found: ${trimmedInput}\nType "help" for available commands.`;
        }
    }

    const newCommand: TerminalCommand = {
      input: trimmedInput,
      output,
      timestamp: new Date()
    };

    setCommands(prev => [...prev, newCommand]);
    setCommandHistory(prev => [...prev, trimmedInput]);
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    }
  };

  return (
    <Card className={cn("border h-full", darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200")}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Terminal className="w-4 h-4 mr-2" />
          Terminal
        </CardTitle>
      </CardHeader>
      <CardContent className="h-96">
        <div className="h-full flex flex-col">
          <div 
            ref={outputRef}
            className={cn(
              "flex-1 overflow-y-auto p-3 font-mono text-sm rounded",
              darkMode ? "bg-black text-green-400" : "bg-gray-900 text-green-300"
            )}
          >
            {commands.map((cmd, index) => (
              <div key={index} className="mb-2">
                {cmd.input && (
                  <div className="flex">
                    <span className="text-yellow-400">$</span>
                    <span className="ml-2">{cmd.input}</span>
                  </div>
                )}
                <div className="whitespace-pre-line text-gray-300 ml-3">
                  {cmd.output}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center mt-2 space-x-2">
            <span className={cn("text-sm font-mono", darkMode ? "text-yellow-400" : "text-yellow-600")}>$</span>
            <Input
              ref={inputRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={cn(
                "font-mono text-sm border-none outline-none ring-0 focus:ring-0",
                darkMode ? "bg-zinc-700 text-white" : "bg-gray-100"
              )}
              placeholder="Enter command..."
              autoFocus
            />
            <Button
              size="sm"
              onClick={() => {
                executeCommand(currentInput);
                setCurrentInput('');
              }}
              className="px-3"
            >
              Run
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TerminalPanel;
