
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { JobFormValues } from '../types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TextArrayFieldsProps {
  form: UseFormReturn<JobFormValues>;
  fieldName: keyof Pick<JobFormValues, 'responsibilities' | 'requirements' | 'benefits'>;
  label: string;
  placeholder: string;
}

export const TextArrayFields: React.FC<TextArrayFieldsProps> = ({ 
  form, 
  fieldName, 
  label,
  placeholder
}) => {
  // Helper function to convert newline-separated text to array
  const textToArray = (text: string): string[] => {
    return text.split('\n').filter(item => item.trim() !== '');
  };

  // Helper function to convert array to newline-separated text
  const arrayToText = (arr: string[] | undefined): string => {
    return Array.isArray(arr) ? arr.join('\n') : '';
  };

  // Add function to handle new line insertion
  const handleAddNewLine = (
    currentValue: string
  ) => {
    const updatedValue = currentValue + '\n• ';
    const arrayValue = textToArray(updatedValue);
    
    form.setValue(fieldName, arrayValue, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  };

  // Direct update of the form values when textarea changes
  const handleTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputValue = e.target.value;
    // Convert text input with line breaks to array
    const arrayValue = textToArray(inputValue);
    console.log(`${fieldName} updated:`, arrayValue);
    
    // Update form values using setValue to ensure changes are properly registered
    form.setValue(fieldName, arrayValue, { 
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  };

  // Ensure form fields are properly initialized
  useEffect(() => {
    if (!form.getValues(fieldName)) {
      form.setValue(fieldName, []);
    }
    
    console.log(`TextArrayFields ${fieldName} initialized:`, form.getValues(fieldName));
  }, [form, fieldName]);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex gap-2">
            <FormControl className="flex-1">
              <Textarea
                value={arrayToText(field.value)}
                onChange={handleTextareaChange}
                placeholder={placeholder}
                className="h-32"
              />
            </FormControl>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10"
              onClick={() => handleAddNewLine(arrayToText(field.value))}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <FormDescription>
            Enter each item on a new line
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
