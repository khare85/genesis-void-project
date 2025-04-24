import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { JobFormValues } from '../types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TextArrayFieldsProps {
  form: UseFormReturn<JobFormValues>;
}

export const TextArrayFields: React.FC<TextArrayFieldsProps> = ({ form }) => {
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
    fieldName: keyof Pick<JobFormValues, 'responsibilities' | 'requirements' | 'benefits'>,
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
    e: React.ChangeEvent<HTMLTextAreaElement>,
    fieldName: keyof Pick<JobFormValues, 'responsibilities' | 'requirements' | 'benefits'>
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
    const fields = ['responsibilities', 'requirements', 'benefits'] as const;
    
    // Initialize empty arrays for any undefined fields
    fields.forEach(field => {
      if (!form.getValues(field)) {
        form.setValue(field, []);
      }
    });
    
    console.log('TextArrayFields initialized:', form.getValues());
  }, [form]);

  return (
    <>
      <FormField
        control={form.control}
        name="responsibilities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Responsibilities</FormLabel>
            <div className="flex gap-2">
              <FormControl className="flex-1">
                <Textarea
                  value={arrayToText(field.value)}
                  onChange={(e) => handleTextareaChange(e, 'responsibilities')}
                  placeholder="Enter responsibilities (one per line)"
                  className="h-32"
                />
              </FormControl>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10"
                onClick={() => handleAddNewLine('responsibilities', arrayToText(field.value))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <FormDescription>
              Enter each responsibility on a new line
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="requirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Requirements</FormLabel>
            <div className="flex gap-2">
              <FormControl className="flex-1">
                <Textarea
                  value={arrayToText(field.value)}
                  onChange={(e) => handleTextareaChange(e, 'requirements')}
                  placeholder="Enter requirements (one per line)"
                  className="h-32"
                />
              </FormControl>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10"
                onClick={() => handleAddNewLine('requirements', arrayToText(field.value))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <FormDescription>
              Enter each requirement on a new line
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="benefits"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Benefits</FormLabel>
            <div className="flex gap-2">
              <FormControl className="flex-1">
                <Textarea
                  value={arrayToText(field.value)}
                  onChange={(e) => handleTextareaChange(e, 'benefits')}
                  placeholder="Enter benefits (one per line)"
                  className="h-32"
                />
              </FormControl>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10"
                onClick={() => handleAddNewLine('benefits', arrayToText(field.value))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <FormDescription>
              Enter each benefit on a new line
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
