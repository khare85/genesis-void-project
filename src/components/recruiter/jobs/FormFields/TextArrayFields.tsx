
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { JobFormValues } from '../types';

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
            <FormControl>
              <Textarea
                value={arrayToText(field.value)}
                onChange={(e) => handleTextareaChange(e, 'responsibilities')}
                placeholder="Enter responsibilities (one per line)"
                className="h-32"
              />
            </FormControl>
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
            <FormControl>
              <Textarea
                value={arrayToText(field.value)}
                onChange={(e) => handleTextareaChange(e, 'requirements')}
                placeholder="Enter requirements (one per line)"
                className="h-32"
              />
            </FormControl>
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
            <FormControl>
              <Textarea
                value={arrayToText(field.value)}
                onChange={(e) => handleTextareaChange(e, 'benefits')}
                placeholder="Enter benefits (one per line)"
                className="h-32"
              />
            </FormControl>
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
