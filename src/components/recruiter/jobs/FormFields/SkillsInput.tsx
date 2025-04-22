
import React, { useState, KeyboardEvent } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Tag, X } from 'lucide-react';
import { JobFormValues } from '../types';

interface SkillsInputProps {
  form: UseFormReturn<JobFormValues>;
}

export const SkillsInput: React.FC<SkillsInputProps> = ({ form }) => {
  const [inputValue, setInputValue] = useState('');
  const skills = form.watch('skills') ? form.watch('skills').split(',').filter(Boolean) : [];

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (!trimmedSkill) return;
    
    const currentSkills = form.getValues('skills');
    const skillsArray = currentSkills ? currentSkills.split(',').filter(Boolean) : [];
    
    if (!skillsArray.includes(trimmedSkill)) {
      const newSkills = [...skillsArray, trimmedSkill].join(',');
      form.setValue('skills', newSkills, { shouldValidate: true });
    }
    setInputValue('');
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues('skills');
    const skillsArray = currentSkills.split(',').filter(Boolean);
    const newSkills = skillsArray.filter(skill => skill !== skillToRemove).join(',');
    form.setValue('skills', newSkills, { shouldValidate: true });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  return (
    <FormField
      control={form.control}
      name="skills"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Required Skills</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <Input
                placeholder="Type a skill and press Enter"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (inputValue) {
                    addSkill(inputValue);
                  }
                }}
              />
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md"
                  >
                    <Tag className="h-3 w-3" />
                    <span className="text-sm">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-primary/50 hover:text-primary"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
