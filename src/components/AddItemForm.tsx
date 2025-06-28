
import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AddItemFormProps {
  itemType: string;
  fields: Array<{
    name: string;
    label: string;
    type: "text" | "number" | "textarea" | "select" | "date";
    placeholder?: string;
    options?: string[];
    required?: boolean;
  }>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  darkMode: boolean;
}

const AddItemForm: React.FC<AddItemFormProps> = ({
  itemType,
  fields,
  onSubmit,
  onCancel,
  darkMode
}) => {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {} as Record<string, string>)
  });

  const handleSubmit = (data: any) => {
    onSubmit(data);
    toast({
      title: `${itemType} Added`,
      description: `New ${itemType.toLowerCase()} has been created successfully`,
      duration: 3000,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {fields.map((field) => {
          // Get valid options for select fields, ensuring no empty strings
          const validOptions = field.type === 'select' && Array.isArray(field.options) 
            ? field.options.filter(option => 
                option !== null && 
                option !== undefined && 
                typeof option === 'string' && 
                option.trim() !== ""
              )
            : [];
          
          return (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    {field.type === 'textarea' ? (
                      <Textarea 
                        placeholder={field.placeholder} 
                        {...formField} 
                        className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
                      />
                    ) : field.type === 'select' ? (
                      <Select 
                        onValueChange={formField.onChange} 
                        value={formField.value || undefined}
                      >
                        <SelectTrigger className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                          <SelectValue placeholder={field.placeholder || "Select an option"} />
                        </SelectTrigger>
                        <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                          {validOptions.length > 0 ? (
                            validOptions.map((option, index) => (
                              <SelectItem key={`${field.name}-${option}-${index}`} value={option}>
                                {option}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-options-available" disabled>
                              No options available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        type={field.type} 
                        placeholder={field.placeholder} 
                        {...formField} 
                        className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Add {itemType}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddItemForm;
