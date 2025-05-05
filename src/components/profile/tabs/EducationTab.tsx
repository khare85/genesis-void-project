import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { School, PlusCircle, Trash2 } from 'lucide-react';
import { formatDate } from './OverviewTab';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import AddItemModal from "../AddItemModal";
interface EducationTabProps {
  education: any[];
  isEditing: boolean;
  form?: any;
}
const EducationTab: React.FC<EducationTabProps> = ({
  education,
  isEditing,
  form
}) => {
  const {
    toast
  } = useToast();
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
  const handleAddEducation = data => {
    if (!form) return;
    const currentEducation = [...(form.getValues().education || [])];
    const newEducation = {
      id: uuidv4(),
      institution: data.institution,
      degree: data.degree,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description
    };
    form.setValue('education', [...currentEducation, newEducation]);
    toast({
      title: "Education entry added",
      description: "Your new education entry has been added to your profile."
    });
    return true; // Return true to close modal
  };
  const EducationForm = ({
    onSubmit,
    onCancel
  }) => {
    const newEducation = {
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    const handleSubmit = e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        institution: formData.get('institution'),
        degree: formData.get('degree'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        description: formData.get('description')
      };
      onSubmit(data);
    };
    return <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <FormLabel htmlFor="degree">Degree/Certificate</FormLabel>
            <Input id="degree" name="degree" placeholder="e.g. Bachelor of Science in Computer Science" required />
          </div>
          
          <div className="grid gap-2">
            <FormLabel htmlFor="institution">Institution</FormLabel>
            <Input id="institution" name="institution" placeholder="e.g. Stanford University" required />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <FormLabel htmlFor="startDate">Start Date</FormLabel>
              <Input id="startDate" name="startDate" type="month" required />
            </div>
            <div className="grid gap-2">
              <FormLabel htmlFor="endDate">End Date (or expected)</FormLabel>
              <Input id="endDate" name="endDate" type="month" placeholder="Leave empty if current" />
            </div>
          </div>
          
          <div className="grid gap-2">
            <FormLabel htmlFor="description">Description (optional)</FormLabel>
            <Textarea id="description" name="description" placeholder="Activities, achievements, or relevant information" />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Add Education</Button>
        </div>
      </form>;
  };
  return <>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-medium">Education</h3>
        {isEditing && <AddItemModal title="Add Education" description="Add details about your educational background" triggerText="Add Education">
            {({
          close
        }) => <EducationForm onSubmit={data => {
          if (handleAddEducation(data)) close();
        }} onCancel={close} />}
          </AddItemModal>}
      </div>
      
      <div className="space-y-6">
        {education && education.length > 0 ? education.map((edu, index) => <div key={edu.id || index} className="relative border-l pl-6 pb-6 ml-3 bg-blue-50 rounded-2xl">
              <div className="absolute -left-3 top-0 size-6 rounded-full bg-primary flex items-center justify-center">
                <School className="h-3 w-3 text-white" />
              </div>
              {isEditing ? <div className="space-y-3">
                  {form ? <>
                      <div className="flex justify-between items-start">
                        <FormField control={form.control} name={`education.${index}.degree`} render={({
                field
              }) => <FormItem className="flex-1">
                              <FormControl>
                                <Input {...field} className="font-medium text-base" defaultValue={edu.degree} placeholder="Degree" />
                              </FormControl>
                            </FormItem>} />
                        <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 -mt-1" onClick={() => handleDeleteEducation(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormField control={form.control} name={`education.${index}.institution`} render={({
              field
            }) => <FormItem>
                            <FormControl>
                              <Input {...field} defaultValue={edu.institution} placeholder="Institution" />
                            </FormControl>
                          </FormItem>} />
                      <div className="grid grid-cols-2 gap-3">
                        <FormField control={form.control} name={`education.${index}.startDate`} render={({
                field
              }) => <FormItem>
                              <FormControl>
                                <Input type="month" {...field} defaultValue={edu.startDate} placeholder="Start date" />
                              </FormControl>
                            </FormItem>} />
                        <FormField control={form.control} name={`education.${index}.endDate`} render={({
                field
              }) => <FormItem>
                              <FormControl>
                                <Input type="month" {...field} defaultValue={edu.endDate || ''} placeholder="End date (or leave empty for Present)" />
                              </FormControl>
                            </FormItem>} />
                      </div>
                      <FormField control={form.control} name={`education.${index}.description`} render={({
              field
            }) => <FormItem>
                            <FormControl>
                              <Textarea {...field} rows={3} defaultValue={edu.description} placeholder="Description" />
                            </FormControl>
                          </FormItem>} />
                    </> : <>
                      <Input defaultValue={edu.degree} className="font-medium text-base" />
                      <Input defaultValue={edu.institution} />
                      <div className="grid grid-cols-2 gap-3">
                        <Input type="month" defaultValue={edu.startDate} />
                        <Input type="month" defaultValue={edu.endDate} />
                      </div>
                      <Textarea defaultValue={edu.description} rows={3} />
                    </>}
                </div> : <>
                  <h4 className="text-base font-medium">{edu.degree || "Degree not specified"}</h4>
                  <p className="text-sm text-muted-foreground">{edu.institution || "Institution not specified"}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(edu.startDate) || "Start date not specified"} - {formatDate(edu.endDate) || "Present"}
                  </p>
                  <p className="mt-2 text-sm">{edu.description || "No description available"}</p>
                </>}
            </div>) : <div className="text-center p-8 border border-dashed rounded-md">
            <p className="text-muted-foreground">No education entries added yet</p>
            {isEditing && <AddItemModal title="Add Education" description="Add details about your educational background" triggerText="Add Education" className="mt-2 text-primary hover:text-primary-dark" buttonVariant="ghost">
                {({
            close
          }) => <EducationForm onSubmit={data => {
            if (handleAddEducation(data)) close();
          }} onCancel={close} />}
              </AddItemModal>}
          </div>}
      </div>
    </>;
};
export default EducationTab;