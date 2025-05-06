
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import { FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from '@/components/profile/tabs/OverviewTab';

interface ExperienceSectionProps {
  profileData: any;
  isEditing: boolean;
  form?: any;
  onDeleteExperience?: (id: number) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ profileData, isEditing, form, onDeleteExperience }) => {
  const generateRandomId = () => Math.floor(Math.random() * 10000);
  
  const addNewExperience = () => {
    if (!form) return;
    const currentExperiences = [...form.getValues().experience];
    form.setValue('experience', [
      ...currentExperiences,
      {
        id: generateRandomId(),
        title: '',
        company: '',
        location: '',
        startDate: null,
        endDate: null,
        current: false,
        description: ''
      }
    ]);
  };

  return (
    <Card className="border border-gray-100 shadow-lg transform transition-all duration-300 hover:shadow-xl bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-black">Experience</h3>
          </div>
          {isEditing && (
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              onClick={addNewExperience}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {(isEditing ? form?.getValues().experience : profileData.experience).map((exp: any, index: number) => (
            <div key={exp.id} className="border-b pb-4 last:border-0 last:pb-0">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Position #{index + 1}</h4>
                    {onDeleteExperience && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 h-8 p-0"
                        onClick={() => onDeleteExperience(exp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form?.control}
                      name={`experience.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <Input placeholder="Title" {...field} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form?.control}
                      name={`experience.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <Input placeholder="Company" {...field} />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form?.control}
                      name={`experience.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem>
                          <Input 
                            type="date"
                            placeholder="Start Date" 
                            {...field} 
                            value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                          />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form?.control}
                      name={`experience.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem>
                          <Input 
                            type="date"
                            placeholder="End Date (leave empty if current)" 
                            disabled={form.getValues().experience[index].current}
                            {...field} 
                            value={field.value && !form.getValues().experience[index].current ? new Date(field.value).toISOString().split('T')[0] : ''}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                          />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form?.control}
                    name={`experience.${index}.current`}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={field.value} 
                          onChange={(e) => field.onChange(e.target.checked)}
                          id={`current-job-${index}`}
                        />
                        <label htmlFor={`current-job-${index}`} className="text-sm">Current position</label>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form?.control}
                    name={`experience.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <Textarea 
                          placeholder="Description" 
                          {...field}
                          className="h-24"
                        />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800">{exp.title}</h4>
                      <p className="text-gray-600">{exp.company}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.current && <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-200">Current</Badge>}
                  {exp.description && <p className="mt-2 text-gray-600">{exp.description}</p>}
                </div>
              )}
            </div>
          ))}
          
          {!isEditing && profileData.experience.length === 0 && (
            <p className="text-gray-500 italic">No experience added yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceSection;
