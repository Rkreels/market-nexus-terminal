
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

  // Enhanced validation function for select options
  const getValidOptions = (options: string[] = []) => {
    if (!Array.isArray(options)) {
      console.warn(`AddItemForm: Options is not an array for field:`, options);
      return [];
    }

    const validOptions = options
      .filter(option => {
        // Ensure option is a string, not null/undefined, and not empty after trimming
        const isValid = option !== null && 
                        option !== undefined && 
                        typeof option === 'string' && 
                        option.trim() !== "" &&
                        option.trim().length > 0;
        console.log(`AddItemForm: Option "${option}" is valid:`, isValid);
        return isValid;
      })
      .map(option => option.trim())
      .filter(option => option.length > 0); // Double check after trimming
    
    console.log(`AddItemForm: Processed valid options:`, validOptions);
    return validOptions;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {fields.map((field) => {
          const validOptions = field.type === 'select' ? getValidOptions(field.options) : [];
          
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
                        defaultValue={formField.value || undefined}
                      >
                        <SelectTrigger className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                          <SelectValue placeholder={field.placeholder || "Select an option"} />
                        </SelectTrigger>
                        <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                          {validOptions.length > 0 ? (
                            validOptions.map((option, index) => {
                              // Ensure each option has a unique, non-empty value
                              const safeValue = option || `option-${index}`;
                              console.log(`AddItemForm: Rendering select option "${option}" with safe value "${safeValue}"`);
                              return (
                                <SelectItem key={`${field.name}-${safeValue}-${index}`} value={safeValue}>
                                  {option}
                                </SelectItem>
                              );
                            })
                          ) : (
                            <SelectItem value="no-options" disabled>
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
