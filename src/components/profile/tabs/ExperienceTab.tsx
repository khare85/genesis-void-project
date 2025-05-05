
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FormField, FormItem, FormControl, FormLabel, Form } from "@/components/ui/form";
import { Briefcase, PlusCircle, Trash2 } from 'lucide-react';
import { formatDate } from './OverviewTab';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import AddItemModal from "../AddItemModal";
import { Checkbox } from "@/components/ui/checkbox";

interface ExperienceTabProps {
  experience: any[];
  isEditing: boolean;
  form?: any;
}

const ExperienceTab: React.FC<ExperienceTabProps> = ({
  experience,
  isEditing,
  form
}) => {
  const { toast } = useToast();
  
  const handleDeleteExperience = (index: number) => {
    if (form) {
      const currentExperience = form.getValues('experience') || [];
      const updatedExperience = [...currentExperience];
      updatedExperience.splice(index, 1);
      form.setValue('experience', updatedExperience);
      toast({
        title: "Experience deleted",
        description: "The experience entry has been removed from your profile."
      });
    }
  };
  
  const handleAddExperience = data => {
    if (form) {
      const currentExperience = form.getValues('experience') || [];
      const newExperience = {
        id: uuidv4(),
        company: data.company,
        title: data.title,
        location: data.location,
        startDate: data.startDate,
        endDate: data.current ? null : data.endDate,
        current: data.current,
        description: data.description,
        skills: data.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      form.setValue('experience', [...currentExperience, newExperience]);
      toast({
        title: "Experience added",
        description: "Your new experience has been added to your profile."
      });
      return true;
    }
    return false;
  };
  
  const ExperienceForm = ({ onSubmit, onCancel }) => {
    const [isCurrent, setIsCurrent] = React.useState(false);
    
    const handleSubmit = e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        company: formData.get('company'),
        title: formData.get('title'),
        location: formData.get('location'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        current: isCurrent,
        description: formData.get('description'),
        skills: formData.get('skills')
      };
      onSubmit(data);
    };
    
    return (
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <FormLabel htmlFor="title">Job Title</FormLabel>
            <Input id="title" name="title" placeholder="e.g. Senior Software Engineer" required />
          </div>
          
          <div className="grid gap-2">
            <FormLabel htmlFor="company">Company</FormLabel>
            <Input id="company" name="company" placeholder="e.g. Acme Corporation" required />
          </div>
          
          <div className="grid gap-2">
            <FormLabel htmlFor="location">Location</FormLabel>
            <Input id="location" name="location" placeholder="e.g. Remote, San Francisco, CA" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <FormLabel htmlFor="startDate">Start Date</FormLabel>
              <Input id="startDate" name="startDate" type="month" required />
            </div>
            <div className="grid gap-2">
              <FormLabel htmlFor="endDate">End Date</FormLabel>
              <Input id="endDate" name="endDate" type="month" disabled={isCurrent} required={!isCurrent} />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="current" checked={isCurrent} onCheckedChange={checked => setIsCurrent(checked === true)} />
            <label htmlFor="current" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              This is my current position
            </label>
          </div>
          
          <div className="grid gap-2">
            <FormLabel htmlFor="description">Job Description</FormLabel>
            <Textarea id="description" name="description" rows={4} placeholder="Describe your responsibilities and achievements..." />
          </div>
          
          <div className="grid gap-2">
            <FormLabel htmlFor="skills">Skills (comma separated)</FormLabel>
            <Input id="skills" name="skills" placeholder="e.g. JavaScript, React, Node.js" />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Add Experience</Button>
        </div>
      </form>
    );
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-lg font-medium">Work Experience</h3>
          <p className="text-muted-foreground">Your professional work history</p>
        </div>
        {isEditing && (
          <AddItemModal 
            title="Add Work Experience" 
            description="Add details about your professional experience" 
            triggerText="Add Experience"
          >
            {({ close }) => (
              <ExperienceForm 
                onSubmit={data => {
                  if (handleAddExperience(data)) close();
                }} 
                onCancel={close} 
              />
            )}
          </AddItemModal>
        )}
      </div>
      
      <div className="space-y-6">
        {experience && experience.length > 0 ? (
          experience.map((job, index) => (
            <div key={job.id || index} className="relative border rounded-lg p-6 bg-white shadow-sm">
              <div className="absolute -left-3 top-6 size-6 rounded-full bg-primary flex items-center justify-center">
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
                                  <Input 
                                    {...field} 
                                    className="font-medium text-base" 
                                    defaultValue={job.title} 
                                    placeholder="Job Title" 
                                  />
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
                              <Input 
                                {...field} 
                                defaultValue={job.company} 
                                placeholder="Company Name" 
                              />
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
                                <Input 
                                  type="month" 
                                  {...field} 
                                  defaultValue={job.startDate} 
                                  placeholder="Start Date" 
                                />
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
                        name={`experience.${index}.current`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                This is my current position
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`experience.${index}.location`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                {...field} 
                                defaultValue={job.location} 
                                placeholder="Location (e.g., Remote, New York, NY)" 
                              />
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
                              <Textarea 
                                {...field} 
                                rows={3} 
                                defaultValue={job.description} 
                                placeholder="Job Description" 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`experience.${index}.skills`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skills (comma separated)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                value={Array.isArray(field.value) ? field.value.join(', ') : ''} 
                                onChange={e => {
                                  const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                                  field.onChange(skills);
                                }} 
                                placeholder="Skills used in this role" 
                              />
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
                  <h4 className="text-black text-base font-semibold">{job.title || "Title not specified"}</h4>
                  <p className="text-sm text-muted-foreground">
                    {job.company || "Company not specified"} • {job.location || "Location not specified"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(job.startDate) || "Start date not specified"} - {formatDate(job.endDate) || "Present"}
                  </p>
                  <p className="mt-2 text-sm text-black">{job.description || "No description available"}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {job.skills && job.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="text-center p-8 border border-dashed rounded-md bg-white">
            <p className="text-muted-foreground">No experience entries added yet</p>
            {isEditing && (
              <AddItemModal 
                title="Add Work Experience" 
                description="Add details about your professional experience" 
                triggerText="Add Experience" 
                buttonVariant="ghost" 
                className="mt-2 text-primary hover:text-primary-dark"
              >
                {({ close }) => (
                  <ExperienceForm 
                    onSubmit={data => {
                      if (handleAddExperience(data)) close();
                    }} 
                    onCancel={close} 
                  />
                )}
              </AddItemModal>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ExperienceTab;
