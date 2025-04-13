
import { FC, useState } from "react";
import { Newspaper, ExternalLink, Clock, Tag, ThumbsUp, BarChart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

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
    sentiment: "neutral",
    content: "Federal Reserve officials have signaled that interest rates will remain at current levels as they continue to monitor economic data. The central bank's latest meeting minutes revealed a cautious stance amid mixed signals on inflation and employment. Analysts expect this policy to continue through the next quarter unless significant changes occur in key economic indicators.",
    tags: ["Federal Reserve", "Interest Rates", "Monetary Policy"]
  },
  {
    id: 2,
    title: "Company XYZ beats earnings expectations",
    source: "Bloomberg",
    time: "32m ago",
    sentiment: "positive",
    content: "Company XYZ reported quarterly earnings that exceeded analyst expectations by 15%. Revenue reached $3.2 billion, up 22% year-over-year, driven by strong performance in its cloud services division. The company also raised its full-year guidance, projecting continued growth in emerging markets. Shares rose 7% in after-hours trading following the announcement.",
    tags: ["Earnings", "Technology", "Cloud Computing"]
  },
  {
    id: 3,
    title: "Tech sector faces regulatory challenges",
    source: "Reuters",
    time: "1h ago",
    sentiment: "negative",
    content: "Technology companies are bracing for new regulatory challenges as lawmakers propose stricter oversight of data privacy and market competition. The proposed legislation would introduce substantial compliance requirements and potentially limit merger activities. Industry representatives have expressed concerns about the impact on innovation, while consumer advocates welcome the increased protections for user data.",
    tags: ["Regulation", "Technology", "Privacy"]
  },
  {
    id: 4,
    title: "Market volatility expected ahead of economic data",
    source: "CNBC",
    time: "2h ago",
    sentiment: "neutral",
    content: "Analysts are predicting increased market volatility as investors await this week's economic data releases. Key reports on employment, inflation, and consumer spending could significantly impact market sentiment. Trading volumes have already increased, with the VIX volatility index rising 12% in anticipation of potential market movements. Strategists recommend cautious positioning until the data provides clearer direction.",
    tags: ["Market Volatility", "Economic Data", "Trading Strategy"]
  }
];

const NewsPanel: FC<NewsPanelProps> = ({ darkMode }) => {
  const [selectedNewsItem, setSelectedNewsItem] = useState<typeof newsItems[0] | null>(null);
  const [newsDetailsOpen, setNewsDetailsOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenNewsDetails = (item: typeof newsItems[0]) => {
    setSelectedNewsItem(item);
    setNewsDetailsOpen(true);
  };

  const handleShareNews = () => {
    if (selectedNewsItem) {
      toast({
        title: "News Shared",
        description: `"${selectedNewsItem.title}" has been shared`,
        duration: 2000,
      });
    }
  };

  return (
    <>
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
            <div 
              key={item.id} 
              className="p-3 hover:bg-opacity-80 cursor-pointer transition-colors"
              onClick={() => handleOpenNewsDetails(item)}
            >
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

      <Dialog open={newsDetailsOpen} onOpenChange={setNewsDetailsOpen}>
        <DialogContent className={cn(
          "sm:max-w-[600px]",
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white"
        )}>
          {selectedNewsItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedNewsItem.title}</DialogTitle>
                <DialogDescription className="flex items-center justify-between">
                  <span className="font-medium">{selectedNewsItem.source}</span>
                  <div className="flex items-center text-sm">
                    <Clock className="h-3.5 w-3.5 mr-1 opacity-70" />
                    {selectedNewsItem.time}
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <p className="mb-4">{selectedNewsItem.content}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {selectedNewsItem.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="cursor-pointer">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Tabs defaultValue="analysis">
                  <TabsList className="w-full">
                    <TabsTrigger value="analysis" className="flex-1">Analysis</TabsTrigger>
                    <TabsTrigger value="impact" className="flex-1">Market Impact</TabsTrigger>
                    <TabsTrigger value="related" className="flex-1">Related News</TabsTrigger>
                  </TabsList>
                  <TabsContent value="analysis" className={cn(
                    "p-4 rounded-lg mt-4",
                    darkMode ? "bg-zinc-700" : "bg-gray-50"
                  )}>
                    <div className="flex items-center mb-2">
                      <BarChart className="h-4 w-4 mr-2" />
                      <h4 className="font-medium">Sentiment Analysis</h4>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Bullish</span>
                          <span>
                            {selectedNewsItem.sentiment === "positive" ? "68%" : 
                             selectedNewsItem.sentiment === "negative" ? "32%" : "51%"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 h-1.5 rounded-full">
                          <div 
                            className={cn("h-full rounded-full", 
                              selectedNewsItem.sentiment === "positive" ? "bg-green-500" : 
                              selectedNewsItem.sentiment === "negative" ? "bg-red-500" : "bg-blue-500"
                            )}
                            style={{ 
                              width: selectedNewsItem.sentiment === "positive" ? "68%" : 
                                     selectedNewsItem.sentiment === "negative" ? "32%" : "51%" 
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Bearish</span>
                          <span>
                            {selectedNewsItem.sentiment === "positive" ? "32%" : 
                             selectedNewsItem.sentiment === "negative" ? "68%" : "49%"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 h-1.5 rounded-full">
                          <div 
                            className="h-full bg-red-500 rounded-full"
                            style={{ 
                              width: selectedNewsItem.sentiment === "positive" ? "32%" : 
                                     selectedNewsItem.sentiment === "negative" ? "68%" : "49%" 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="impact" className={cn(
                    "p-4 rounded-lg mt-4",
                    darkMode ? "bg-zinc-700" : "bg-gray-50"
                  )}>
                    <p className="text-sm">Potential market implications of this news:</p>
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                      <li>
                        {selectedNewsItem.sentiment === "positive" 
                          ? "May positively affect related stocks in the short term" 
                          : selectedNewsItem.sentiment === "negative"
                          ? "Could create downward pressure on affected sectors"
                          : "Limited immediate market impact expected"}
                      </li>
                      <li>Increased trading volume in {selectedNewsItem.tags[0]} sector</li>
                      <li>Analysts are adjusting their forecasts accordingly</li>
                    </ul>
                  </TabsContent>
                  <TabsContent value="related" className={cn(
                    "p-4 rounded-lg mt-4",
                    darkMode ? "bg-zinc-700" : "bg-gray-50"
                  )}>
                    <div className="space-y-2">
                      {newsItems
                        .filter(news => news.id !== selectedNewsItem.id)
                        .slice(0, 2)
                        .map(news => (
                          <div 
                            key={news.id} 
                            className={cn(
                              "p-2 rounded cursor-pointer border",
                              darkMode ? "border-zinc-600 hover:bg-zinc-600" : "border-gray-200 hover:bg-gray-100"
                            )}
                            onClick={() => {
                              setSelectedNewsItem(news);
                            }}
                          >
                            <div className="font-medium text-sm">{news.title}</div>
                            <div className="text-xs opacity-70 mt-1">{news.source} · {news.time}</div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <DialogFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Article saved",
                      description: "News article has been saved to your reading list",
                      duration: 2000,
                    });
                  }}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" /> Save
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareNews}
                  >
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Full Article",
                        description: "Opening original article in a new tab",
                        duration: 2000,
                      });
                      setNewsDetailsOpen(false);
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" /> Full Article
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewsPanel;
