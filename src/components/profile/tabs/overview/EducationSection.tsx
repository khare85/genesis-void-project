
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from '@/components/profile/tabs/OverviewTab';

interface EducationSectionProps {
  profileData: any;
  isEditing: boolean;
  form?: any;
  onDeleteEducation?: (id: number) => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({ profileData, isEditing, form, onDeleteEducation }) => {
  const generateRandomId = () => Math.floor(Math.random() * 10000);
  
  const addNewEducation = () => {
    if (!form) return;
    const currentEducation = [...form.getValues().education];
    form.setValue('education', [
      ...currentEducation,
      {
        id: generateRandomId(),
        institution: '',
        degree: '',
        startDate: null,
        endDate: null,
        description: ''
      }
    ]);
  };

  return (
    <Card className="border border-gray-100 shadow-lg transform transition-all duration-300 hover:shadow-xl bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-black">Education</h3>
          </div>
          {isEditing && (
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              onClick={addNewEducation}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {(isEditing ? form?.getValues().education : profileData.education).map((edu: any, index: number) => (
            <div key={edu.id} className="border-b pb-4 last:border-0 last:pb-0">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Education #{index + 1}</h4>
                    {onDeleteEducation && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 h-8 p-0"
                        onClick={() => onDeleteEducation(edu.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form?.control}
                      name={`education.${index}.institution`}
                      render={({ field }) => (
                        <FormItem>
                          <Input placeholder="Institution" {...field} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form?.control}
                      name={`education.${index}.degree`}
                      render={({ field }) => (
                        <FormItem>
                          <Input placeholder="Degree" {...field} />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form?.control}
                      name={`education.${index}.startDate`}
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
                      name={`education.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem>
                          <Input 
                            type="date"
                            placeholder="End Date" 
                            {...field} 
                            value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                          />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form?.control}
                    name={`education.${index}.description`}
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
                      <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                      <p className="text-gray-600">{edu.institution}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </div>
                  </div>
                  {edu.description && <p className="mt-2 text-gray-600">{edu.description}</p>}
                </div>
              )}
            </div>
          ))}
          
          {!isEditing && profileData.education.length === 0 && (
            <p className="text-gray-500 italic">No education added yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationSection;
