
import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useVoiceTrainer } from "@/contexts/VoiceTrainerContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { z } from 'zod';

interface FormField {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "select" | "date";
  placeholder?: string;
  options?: string[];
  required?: boolean;
  defaultValue?: string;
}

interface AddItemFormProps {
  itemType: string;
  fields: FormField[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  darkMode: boolean;
  validationSchema?: z.ZodSchema<any>;
  isLoading?: boolean;
}

const AddItemForm: React.FC<AddItemFormProps> = ({
  itemType,
  fields,
  onSubmit,
  onCancel,
  darkMode,
  validationSchema,
  isLoading = false
}) => {
  const { toast } = useToast();
  const { speak, announceAction } = useVoiceTrainer();
  const isMobile = useIsMobile();

  // Create default schema if none provided
  const defaultSchema = z.object(
    fields.reduce((acc, field) => {
      if (field.type === 'number') {
        acc[field.name] = field.required 
          ? z.number({ required_error: `${field.label} is required` }).positive(`${field.label} must be positive`)
          : z.number().positive(`${field.label} must be positive`).optional();
      } else {
        acc[field.name] = field.required 
          ? z.string().min(1, `${field.label} is required`)
          : z.string().optional();
      }
      return acc;
    }, {} as Record<string, z.ZodTypeAny>)
  );

  const schema = validationSchema || defaultSchema;
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || (field.type === 'number' ? 0 : "");
      return acc;
    }, {} as Record<string, any>)
  });

  const handleSubmit = async (data: any) => {
    try {
      // Convert string numbers to actual numbers
      const processedData = { ...data };
      fields.forEach(field => {
        if (field.type === 'number' && typeof processedData[field.name] === 'string') {
          processedData[field.name] = parseFloat(processedData[field.name]);
        }
      });

      await onSubmit(processedData);
      announceAction(`${itemType} saved successfully`);
      speak(`${itemType} has been saved with the provided information.`, 'medium');
      
      toast({
        title: `${itemType} Saved`,
        description: `${itemType} has been saved successfully`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: `Failed to save ${itemType.toLowerCase()}. Please try again.`,
        variant: "destructive",
        duration: 5000,
      });
      speak(`Error saving ${itemType.toLowerCase()}. Please check the form and try again.`, 'high');
    }
  };

  const handleFieldFocus = (fieldLabel: string, fieldType: string) => {
    let guidance = `${fieldLabel} field active.`;
    
    switch (fieldType) {
      case 'select':
        guidance += ' Use arrow keys to navigate options, or start typing to search.';
        break;
      case 'textarea':
        guidance += ' Multi-line text input. Use Enter for new lines.';
        break;
      case 'number':
        guidance += ' Numeric input only. Use arrow keys to increment or decrement.';
        break;
      case 'date':
        guidance += ' Date input. Use date picker or enter in format YYYY-MM-DD.';
        break;
      default:
        guidance += ' Text input field.';
    }
    
    speak(guidance, 'low');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {fields.map((field) => {
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
                  <FormLabel className="text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                  <FormControl>
                    {field.type === 'textarea' ? (
                      <Textarea 
                        placeholder={field.placeholder} 
                        {...formField} 
                        className={cn(
                          "min-h-[80px] resize-none",
                          darkMode ? "bg-zinc-700 border-zinc-600 text-white" : "bg-white border-gray-300"
                        )}
                        onFocus={() => handleFieldFocus(field.label, field.type)}
                        rows={isMobile ? 3 : 4}
                        disabled={isLoading}
                      />
                    ) : field.type === 'select' ? (
                      <Select 
                        onValueChange={(value) => {
                          formField.onChange(value);
                          speak(`Selected ${value}`, 'low');
                        }} 
                        value={formField.value || undefined}
                        onOpenChange={(open) => {
                          if (open) {
                            handleFieldFocus(field.label, field.type);
                          }
                        }}
                        disabled={isLoading}
                      >
                        <SelectTrigger className={cn(
                          darkMode ? "bg-zinc-700 border-zinc-600 text-white" : "bg-white border-gray-300"
                        )}>
                          <SelectValue placeholder={field.placeholder || "Select an option"} />
                        </SelectTrigger>
                        <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-300"}>
                          {validOptions.length > 0 ? (
                            validOptions.map((option, index) => (
                              <SelectItem 
                                key={`${field.name}-${option}-${index}`} 
                                value={option}
                                className={darkMode ? "text-white hover:bg-zinc-600" : "text-black hover:bg-gray-100"}
                              >
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
                        className={cn(
                          darkMode ? "bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400" : "bg-white border-gray-300"
                        )}
                        onFocus={() => handleFieldFocus(field.label, field.type)}
                        onChange={(e) => {
                          formField.onChange(e);
                          if (field.type === 'number' && e.target.value) {
                            speak(`Value: ${e.target.value}`, 'low');
                          }
                        }}
                        disabled={isLoading}
                      />
                    )}
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          );
        })}
        
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              onCancel();
              speak('Form cancelled', 'low');
            }}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="w-full sm:w-auto"
            onFocus={() => speak('Submit button active. Press Enter or Space to save the form.', 'low')}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : `Save ${itemType}`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddItemForm;
