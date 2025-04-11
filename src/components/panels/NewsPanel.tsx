
import { FC } from "react";
import { Newspaper, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsPanelProps {
  darkMode: boolean;
}

// Mock news data
const newsItems = [
  {
    id: 1,
    title: "Fed signals interest rates will remain steady",
    source: "Financial Times",
    time: "15m ago",
    sentiment: "neutral"
  },
  {
    id: 2,
    title: "Company XYZ beats earnings expectations",
    source: "Bloomberg",
    time: "32m ago",
    sentiment: "positive"
  },
  {
    id: 3,
    title: "Tech sector faces regulatory challenges",
    source: "Reuters",
    time: "1h ago",
    sentiment: "negative"
  },
  {
    id: 4,
    title: "Market volatility expected ahead of economic data",
    source: "CNBC",
    time: "2h ago",
    sentiment: "neutral"
  }
];

const NewsPanel: FC<NewsPanelProps> = ({ darkMode }) => {
  return (
    <div className={cn("rounded-lg overflow-hidden shadow-md", 
      darkMode ? "bg-zinc-800 border border-zinc-700" : "bg-white border border-gray-200"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <Newspaper className={cn("w-5 h-5 mr-2", darkMode ? "text-purple-400" : "text-purple-600")} />
          <h3 className="font-medium">Latest News</h3>
        </div>
        <div className={cn("text-xs px-2 py-1 rounded", 
          darkMode ? "bg-zinc-700 text-zinc-300" : "bg-gray-100 text-gray-700"
        )}>
          Live
        </div>
      </div>
      
      <div className={cn("divide-y", 
        darkMode ? "divide-zinc-700" : "divide-gray-200"
      )}>
        {newsItems.map((item) => (
          <div key={item.id} className="p-3 hover:bg-opacity-80 cursor-pointer transition-colors">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-medium">{item.title}</h4>
              <ExternalLink className="w-3 h-3 flex-shrink-0 ml-2 mt-1" />
            </div>
            <div className="flex justify-between">
              <span className={cn("text-xs", 
                darkMode ? "text-gray-400" : "text-gray-500"
              )}>
                {item.source}
              </span>
              <div className="flex items-center">
                <span className={cn("text-xs mr-2", 
                  darkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  {item.time}
                </span>
                <span className={cn("w-2 h-2 rounded-full", {
                  "bg-green-500": item.sentiment === "positive",
                  "bg-red-500": item.sentiment === "negative",
                  "bg-gray-500": item.sentiment === "neutral"
                })}></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPanel;
