
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import DetailView from "@/components/DetailView";
import { addMarketDataItem } from "@/services/marketDataService";
import { MarketDataItem } from '@/types/marketData';

interface AddMarketDataFormProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (item: MarketDataItem) => void;
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  symbol: z.string().min(1, "Symbol is required"),
  type: z.string().min(1, "Type is required"),
  value: z.coerce.number().positive("Value must be positive"),
  change: z.coerce.number(),
  percentChange: z.coerce.number(),
  direction: z.enum(["up", "down"]),
  description: z.string().optional(),
  sector: z.string().optional(),
  marketCap: z.coerce.number().optional(),
  volume: z.coerce.number().optional()
});

type FormValues = z.infer<typeof formSchema>;

const AddMarketDataForm: React.FC<AddMarketDataFormProps> = ({
  darkMode,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      type: "Stock",
      value: 0,
      change: 0,
      percentChange: 0,
      direction: "up",
      description: "",
      sector: "Technology",
      marketCap: 0,
      volume: 0
    },
  });

  const handleSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const newItem = addMarketDataItem(values);
      
      toast({
        title: "Market Data Added",
        description: `${values.name} (${values.symbol}) has been added successfully`,
        duration: 3000,
      });
      
      if (onSuccess) {
        onSuccess(newItem);
      }
      
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add market data",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DetailView
      title="Add Market Data"
      isOpen={isOpen}
      onClose={onClose}
      darkMode={darkMode}
      footerContent={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Market Data"}
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Apple Inc" 
                      {...field} 
                      className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. AAPL" 
                      {...field} 
                      className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                        <SelectItem value="Stock">Stock</SelectItem>
                        <SelectItem value="Index">Index</SelectItem>
                        <SelectItem value="ETF">ETF</SelectItem>
                        <SelectItem value="Forex">Forex</SelectItem>
                        <SelectItem value="Crypto">Crypto</SelectItem>
                        <SelectItem value="Commodity">Commodity</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sector</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                      <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Financials">Financials</SelectItem>
                        <SelectItem value="Energy">Energy</SelectItem>
                        <SelectItem value="Consumer">Consumer</SelectItem>
                        <SelectItem value="Industrials">Industrials</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Materials">Materials</SelectItem>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                        <SelectItem value="Cryptocurrency">Cryptocurrency</SelectItem>
                        <SelectItem value="Multi-Sector">Multi-Sector</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="e.g. 150.25" 
                      {...field} 
                      className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="direction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Direction</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                      <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                        <SelectItem value="up">Up</SelectItem>
                        <SelectItem value="down">Down</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="change"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="e.g. 2.50" 
                      {...field} 
                      className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="percentChange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percent Change</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="e.g. 1.25" 
                      {...field} 
                      className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="marketCap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market Cap</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g. 2000000000" 
                      {...field} 
                      className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="volume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volume</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g. 5000000" 
                      {...field} 
                      className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Description of the market data" 
                    {...field} 
                    className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </DetailView>
  );
};

export default AddMarketDataForm;
