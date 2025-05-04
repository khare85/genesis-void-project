
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

export interface TextArrayFieldsProps {
  fieldName: string;
  label: string;
  placeholder: string;
}

export const TextArrayFields: React.FC<TextArrayFieldsProps> = ({ fieldName, label, placeholder }) => {
  const { register, watch, setValue } = useFormContext();
  
  const values = watch(fieldName) || [];
  
  const handleAddItem = () => {
    const newValue = '';
    setValue(fieldName, [...values, newValue]);
  };
  
  const handleRemoveItem = (index: number) => {
    setValue(fieldName, values.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="space-y-2">
        {values.map((value: string, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-grow">
              <Input
                {...register(`${fieldName}.${index}`)}
                placeholder={placeholder}
                className="w-full"
              />
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => handleRemoveItem(index)}
              className="h-8 w-8 p-0 flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddItem}
          className="w-full"
        >
          Add {label.toLowerCase()}
        </Button>
      </div>
    </div>
  );
};
