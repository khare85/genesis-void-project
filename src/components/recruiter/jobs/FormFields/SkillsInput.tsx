
import React, { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Tag, X } from 'lucide-react';

export interface SkillsInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SkillsInput: React.FC<SkillsInputProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const skills = value ? value.split(',').filter(Boolean).map(s => s.trim()) : [];

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (!trimmedSkill) return;
    
    const skillsArray = value ? value.split(',').filter(Boolean).map(s => s.trim()) : [];
    
    if (!skillsArray.includes(trimmedSkill)) {
      const newSkills = [...skillsArray, trimmedSkill].join(',');
      onChange(newSkills);
    }
    setInputValue('');
  };

  const removeSkill = (skillToRemove: string) => {
    const skillsArray = value.split(',').filter(Boolean).map(s => s.trim());
    const newSkills = skillsArray.filter(skill => skill !== skillToRemove).join(',');
    onChange(newSkills);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  return (
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
            className="flex items-center gap-1 bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-md"
          >
            <Tag className="h-3 w-3" />
            <span className="text-sm">{skill}</span>
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-primary text-opacity-50 hover:text-primary"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
