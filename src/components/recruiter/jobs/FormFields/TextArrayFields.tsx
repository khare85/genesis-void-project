
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

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
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <div className="space-y-3">
        {values.map((value: string, index: number) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-grow">
              <Textarea
                {...register(`${fieldName}.${index}`)}
                placeholder={placeholder}
                className="w-full min-h-[120px] border-blue-100/60 focus:border-blue-200"
              />
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => handleRemoveItem(index)}
              className="h-8 w-8 p-0 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 mt-1"
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
          className="w-full border-dashed border-blue-200 text-blue-600 hover:bg-blue-50/50 hover:text-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" /> Add {label.toLowerCase()}
        </Button>
      </div>
    </div>
  );
};
