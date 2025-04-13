
import React from "react";
import { useForm } from "react-hook-form";
import { useUI } from "@/contexts/UIContext";
import DetailView from "@/components/DetailView";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddMarketDataFormProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  symbol: string;
  type: string;
  value: string;
  change: string;
  percentChange: string;
  direction: "up" | "down";
}

const AddMarketDataForm: React.FC<AddMarketDataFormProps> = ({
  darkMode,
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      symbol: "",
      type: "Index",
      value: "",
      change: "",
      percentChange: "",
      direction: "up",
    },
  });

  const onSubmit = (data: FormValues) => {
    // In a real app, this would save to the database
    toast({
      title: "Market Data Added",
      description: `${data.name} (${data.symbol}) has been added successfully`,
      duration: 3000,
    });
    onClose();
  };

  return (
    <DetailView
      title="Add New Market Data"
      isOpen={isOpen}
      onClose={onClose}
      darkMode={darkMode}
      footerContent={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)}>
            Add Market Data
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., S&P 500"
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
                      placeholder="e.g., SPX"
                      {...field}
                      className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                      <SelectItem value="Index">Index</SelectItem>
                      <SelectItem value="Stock">Stock</SelectItem>
                      <SelectItem value="ETF">ETF</SelectItem>
                      <SelectItem value="Crypto">Cryptocurrency</SelectItem>
                      <SelectItem value="Forex">Forex</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 4850.25"
                      {...field}
                      className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="change"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 12.50"
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
                      placeholder="e.g., 0.25"
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                      <SelectItem value="up">Up</SelectItem>
                      <SelectItem value="down">Down</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </DetailView>
  );
};

export default AddMarketDataForm;
