
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { School, PlusCircle, Trash2 } from 'lucide-react';
import { formatDate } from './OverviewTab';
import { useToast } from "@/hooks/use-toast";

interface EducationTabProps {
  education: any[];
  isEditing: boolean;
  form?: any;
}

const EducationTab: React.FC<EducationTabProps> = ({ education, isEditing, form }) => {
  const { toast } = useToast();
  
  const handleDeleteEducation = (index: number) => {
    if (!form) return;
    
    const currentEducation = [...form.getValues().education];
    currentEducation.splice(index, 1);
    
    form.setValue('education', currentEducation);
    
    toast({
      title: "Education entry deleted",
      description: "The education entry has been removed from your profile."
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-medium">Education</h3>
        {isEditing && (
          <Button size="sm" variant="outline" className="gap-1">
            <PlusCircle className="h-4 w-4" /> Add Education
          </Button>
        )}
      </div>
      
      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={edu.id} className="relative border-l pl-6 pb-6 ml-3">
            <div className="absolute -left-3 top-0 size-6 rounded-full bg-primary flex items-center justify-center">
              <School className="h-3 w-3 text-white" />
            </div>
            {isEditing ? (
              <div className="space-y-3">
                {form ? (
                  <>
                    <div className="flex justify-between items-start">
                      <FormField
                        control={form.control}
                        name={`education.${index}.degree`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} className="font-medium text-base" defaultValue={edu.degree} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 -mt-1"
                        onClick={() => handleDeleteEducation(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`education.${index}.institution`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} defaultValue={edu.institution} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name={`education.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="month" {...field} defaultValue={edu.startDate} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`education.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="month" {...field} defaultValue={edu.endDate || ''} placeholder="Present" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`education.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea {...field} rows={3} defaultValue={edu.description} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <>
                    <Input defaultValue={edu.degree} className="font-medium text-base" />
                    <Input defaultValue={edu.institution} />
                    <div className="grid grid-cols-2 gap-3">
                      <Input type="month" defaultValue={edu.startDate} />
                      <Input type="month" defaultValue={edu.endDate} />
                    </div>
                    <Textarea defaultValue={edu.description} rows={3} />
                  </>
                )}
              </div>
            ) : (
              <>
                <h4 className="text-base font-medium">{edu.degree}</h4>
                <p className="text-sm text-muted-foreground">{edu.institution}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </p>
                <p className="mt-2 text-sm">{edu.description}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default EducationTab;
