
import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useVoiceTrainer } from "@/contexts/VoiceTrainerContext";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { speak, announceAction } = useVoiceTrainer();
  const isMobile = useIsMobile();
  
  const form = useForm({
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {} as Record<string, string>)
  });

  const handleSubmit = (data: any) => {
    onSubmit(data);
    announceAction(`${itemType} created successfully`);
    speak(`New ${itemType.toLowerCase()} has been added with the provided information. You can now view it in the main list.`, 'medium');
    toast({
      title: `${itemType} Added`,
      description: `New ${itemType.toLowerCase()} has been created successfully`,
      duration: 3000,
    });
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3 sm:space-y-4">
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
                  <FormLabel className="text-sm sm:text-base">{field.label}</FormLabel>
                  <FormControl>
                    {field.type === 'textarea' ? (
                      <Textarea 
                        placeholder={field.placeholder} 
                        {...formField} 
                        className={cn(
                          "min-h-[80px] text-sm sm:text-base",
                          darkMode ? "bg-zinc-700 border-zinc-600" : ""
                        )}
                        onFocus={() => handleFieldFocus(field.label, field.type)}
                        rows={isMobile ? 3 : 4}
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
                      >
                        <SelectTrigger className={cn(
                          "text-sm sm:text-base",
                          darkMode ? "bg-zinc-700 border-zinc-600" : ""
                        )}>
                          <SelectValue placeholder={field.placeholder || "Select an option"} />
                        </SelectTrigger>
                        <SelectContent className={darkMode ? "bg-zinc-700 border-zinc-600" : ""}>
                          {validOptions.length > 0 ? (
                            validOptions.map((option, index) => (
                              <SelectItem 
                                key={`${field.name}-${option}-${index}`} 
                                value={option}
                                className="text-sm sm:text-base"
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
                          "text-sm sm:text-base",
                          darkMode ? "bg-zinc-700 border-zinc-600" : ""
                        )}
                        onFocus={() => handleFieldFocus(field.label, field.type)}
                        onChange={(e) => {
                          formField.onChange(e);
                          if (field.type === 'number' && e.target.value) {
                            speak(`Value: ${e.target.value}`, 'low');
                          }
                        }}
                      />
                    )}
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          );
        })}
        
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              onCancel();
              speak('Form cancelled', 'low');
            }}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="w-full sm:w-auto text-sm sm:text-base"
            onFocus={() => speak('Submit button active. Press Enter or Space to save the form.', 'low')}
          >
            Add {itemType}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddItemForm;
