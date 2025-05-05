
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
    <div className="h-full flex flex-col">
      <label className="block text-sm font-bold text-gray-700 mb-3">{label}</label>
      <div className="space-y-4 flex-grow overflow-y-auto max-h-[400px] pr-1">
        {values.map((value: string, index: number) => (
          <div key={index} className="flex items-start gap-2 group">
            <div className="flex-grow">
              <Textarea
                {...register(`${fieldName}.${index}`)}
                placeholder={placeholder}
                className="w-full min-h-[120px] border-slate-200 focus:border-primary rounded-xl transition-all bg-slate-50/50 resize-none"
              />
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => handleRemoveItem(index)}
              className="h-8 w-8 p-0 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 mt-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {values.length === 0 && (
          <div className="text-center py-8 text-slate-400 bg-slate-50/80 rounded-lg border border-dashed border-slate-200">
            No items added yet
          </div>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={handleAddItem}
        className="mt-4 w-full border-dashed border-slate-300 text-primary hover:bg-primary/5 hover:text-primary hover:border-primary btn-hover-float"
      >
        <Plus className="h-4 w-4 mr-1" /> Add {label.toLowerCase()}
      </Button>
    </div>
  );
};
