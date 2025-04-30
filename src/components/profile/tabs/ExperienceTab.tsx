
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Briefcase, PlusCircle, Trash2 } from 'lucide-react';
import { formatDate } from './OverviewTab';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

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

  const handleAddExperience = () => {
    if (form) {
      const currentExperience = form.getValues('experience') || [];
      const newExperience = {
        id: uuidv4(),
        company: "",
        title: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        skills: []
      };
      
      form.setValue('experience', [...currentExperience, newExperience]);
      
      toast({
        title: "Experience added",
        description: "Please fill in the details for your new experience entry.",
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-medium">Work Experience</h3>
        {isEditing && (
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-1"
            onClick={handleAddExperience}
          >
            <PlusCircle className="h-4 w-4" /> Add Experience
          </Button>
        )}
      </div>
      
      <div className="space-y-6">
        {experience.map((job, index) => (
          <div key={job.id || index} className="relative border-l pl-6 pb-6 ml-3">
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
                                <Input {...field} className="font-medium text-base" defaultValue={job.title} placeholder="Job Title" />
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
                            <Input {...field} defaultValue={job.company} placeholder="Company Name" />
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
                              <Input type="month" {...field} defaultValue={job.startDate} placeholder="Start Date" />
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
                                placeholder="End Date (or leave empty if current)" 
                                disabled={job.current}
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
                            <Input {...field} defaultValue={job.location} placeholder="Location (e.g., Remote, New York, NY)" />
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
                            <Textarea {...field} rows={3} defaultValue={job.description} placeholder="Job Description" />
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
                <h4 className="text-base font-medium">{job.title || "Title not specified"}</h4>
                <p className="text-sm text-muted-foreground">
                  {job.company || "Company not specified"} • {job.location || "Location not specified"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(job.startDate) || "Start date not specified"} - {formatDate(job.endDate) || "Present"}
                </p>
                <p className="mt-2 text-sm">{job.description || "No description available"}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {job.skills && job.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}

        {experience.length === 0 && (
          <div className="text-center p-8 border border-dashed rounded-md">
            <p className="text-muted-foreground">No experience entries added yet</p>
            {isEditing && (
              <Button 
                onClick={handleAddExperience}
                variant="ghost" 
                size="sm" 
                className="mt-2 text-primary hover:text-primary-dark"
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Experience
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ExperienceTab;
