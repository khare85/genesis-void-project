
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Briefcase, PlusCircle, Trash2 } from 'lucide-react';
import { formatDate } from './OverviewTab';
import { useToast } from "@/hooks/use-toast";

interface ExperienceTabProps {
  experience: any[];
  isEditing: boolean;
  form?: any;
}

const ExperienceTab: React.FC<ExperienceTabProps> = ({ experience, isEditing, form }) => {
  const { toast } = useToast();
  
  const handleDeleteExperience = (index: number) => {
    if (form) {
      const currentExperience = form.getValues('experience') || [];
      const updatedExperience = [...currentExperience];
      updatedExperience.splice(index, 1);
      form.setValue('experience', updatedExperience);
      
      toast({
        title: "Experience deleted",
        description: "The experience entry has been removed from your profile.",
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-medium">Work Experience</h3>
        {isEditing && (
          <Button size="sm" variant="outline" className="gap-1">
            <PlusCircle className="h-4 w-4" /> Add Experience
          </Button>
        )}
      </div>
      
      <div className="space-y-6">
        {experience.map((job, index) => (
          <div key={job.id} className="relative border-l pl-6 pb-6 ml-3">
            <div className="absolute -left-3 top-0 size-6 rounded-full bg-primary flex items-center justify-center">
              <Briefcase className="h-3 w-3 text-white" />
            </div>
            {isEditing ? (
              <div className="space-y-3">
                {form ? (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-grow">
                        <FormField
                          control={form.control}
                          name={`experience.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} className="font-medium text-base" defaultValue={job.title} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 -mt-1"
                        onClick={() => handleDeleteExperience(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`experience.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} defaultValue={job.company} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name={`experience.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="month" {...field} defaultValue={job.startDate} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`experience.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                type="month" 
                                {...field} 
                                defaultValue={job.endDate || ''} 
                                placeholder="Present" 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`experience.${index}.location`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} defaultValue={job.location} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experience.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea {...field} rows={3} defaultValue={job.description} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <Input defaultValue={job.title} className="font-medium text-base" />
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input defaultValue={job.company} />
                    <div className="grid grid-cols-2 gap-3">
                      <Input type="month" defaultValue={job.startDate} />
                      <Input type="month" defaultValue={job.endDate || ''} placeholder="Present" />
                    </div>
                    <Input defaultValue={job.location} />
                    <Textarea defaultValue={job.description} rows={3} />
                  </>
                )}
              </div>
            ) : (
              <>
                <h4 className="text-base font-medium">{job.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {job.company} • {job.location}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(job.startDate)} - {formatDate(job.endDate)}
                </p>
                <p className="mt-2 text-sm">{job.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {job.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ExperienceTab;
