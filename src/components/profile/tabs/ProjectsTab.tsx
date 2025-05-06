import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { LinkIcon, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import AddItemModal from "../AddItemModal";
interface ProjectsTabProps {
  projects: any[];
  isEditing: boolean;
  form?: any;
}
const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects,
  isEditing,
  form
}) => {
  const {
    toast
  } = useToast();
  const handleDeleteProject = (index: number) => {
    if (!form) return;
    const currentProjects = [...form.getValues().projects];
    currentProjects.splice(index, 1);
    form.setValue('projects', currentProjects);
    toast({
      title: "Project deleted",
      description: "The project has been removed from your profile."
    });
  };
  const handleAddProject = data => {
    if (!form) return;
    const currentProjects = [...(form.getValues().projects || [])];
    const newProject = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      link: data.link,
      technologies: data.technologies.split(',').map(t => t.trim()).filter(t => t !== '')
    };
    form.setValue('projects', [...currentProjects, newProject]);
    toast({
      title: "Project added",
      description: "Your new project has been added to your profile."
    });
    return true;
  };
  const ProjectForm = ({
    onSubmit,
    onCancel
  }) => {
    const handleSubmit = e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        link: formData.get('link'),
        technologies: formData.get('technologies')
      };
      onSubmit(data);
    };
    return <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <FormLabel htmlFor="title">Project Title</FormLabel>
            <Input id="title" name="title" placeholder="e.g. E-commerce Website" required />
          </div>
          
          <div className="grid gap-2">
            <FormLabel htmlFor="description">Project Description</FormLabel>
            <Textarea id="description" name="description" rows={3} placeholder="Describe what the project does and your role in it..." required />
          </div>
          
          <div className="grid gap-2">
            <FormLabel htmlFor="link">Project URL (optional)</FormLabel>
            <Input id="link" name="link" placeholder="e.g. https://github.com/yourusername/project" />
          </div>
          
          <div className="grid gap-2">
            <FormLabel htmlFor="technologies">Technologies Used (comma separated)</FormLabel>
            <Input id="technologies" name="technologies" placeholder="e.g. React, Node.js, MongoDB" required />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Add Project</Button>
        </div>
      </form>;
  };
  return <>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-lg font-semibold text-black">Projects</h3>
          <p className="text-muted-foreground">Showcase your projects and technical achievements</p>
        </div>
        {isEditing && <AddItemModal title="Add Project" description="Add details about a project you've worked on" triggerText="Add Project">
            {({
          close
        }) => <ProjectForm onSubmit={data => {
          if (handleAddProject(data)) close();
        }} onCancel={close} />}
          </AddItemModal>}
      </div>
      
      <div className="grid gap-5">
        {projects && projects.length > 0 ? projects.map((project, index) => <Card key={project.id || index} className="overflow-hidden border rounded-lg shadow-sm">
              {isEditing ? <CardContent className="p-4 space-y-3">
                  {form ? <>
                      <div className="flex justify-between items-start">
                        <FormField control={form.control} name={`projects.${index}.title`} render={({
                field
              }) => <FormItem className="flex-1">
                              <FormControl>
                                <Input {...field} className="font-medium text-base" defaultValue={project.title} placeholder="Project Title" />
                              </FormControl>
                            </FormItem>} />
                        <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 -mt-1" onClick={() => handleDeleteProject(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormField control={form.control} name={`projects.${index}.description`} render={({
              field
            }) => <FormItem>
                            <FormControl>
                              <Textarea {...field} rows={3} defaultValue={project.description} placeholder="Project Description" />
                            </FormControl>
                          </FormItem>} />
                      <FormField control={form.control} name={`projects.${index}.link`} render={({
              field
            }) => <FormItem>
                            <FormControl>
                              <Input {...field} defaultValue={project.link} placeholder="Project URL" />
                            </FormControl>
                          </FormItem>} />
                      <FormField control={form.control} name={`projects.${index}.technologies`} render={({
              field
            }) => <FormItem>
                            <FormControl>
                              <Input {...field} value={Array.isArray(field.value) ? field.value.join(', ') : ''} placeholder="Technologies used (comma separated)" onChange={e => {
                  const techs = e.target.value.split(',').map(t => t.trim()).filter(t => t !== '');
                  field.onChange(techs);
                }} />
                            </FormControl>
                          </FormItem>} />
                    </> : <>
                      <Input defaultValue={project.title} className="font-medium text-base" />
                      <Textarea defaultValue={project.description} rows={3} />
                      <Input defaultValue={project.link} placeholder="Project URL" />
                      <Input defaultValue={project.technologies.join(', ')} placeholder="Technologies used (comma separated)" />
                    </>}
                </CardContent> : <>
                  <CardHeader className="pb-2">
                    <CardTitle>{project.title || "Untitled Project"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{project.description || "No description available"}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {project.technologies && project.technologies.map((tech: string, index: number) => <Badge key={index} variant="secondary">{tech}</Badge>)}
                    </div>
                  </CardContent>
                  {project.link && <CardFooter>
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                          <LinkIcon className="h-3.5 w-3.5" />
                          View Project
                        </a>
                      </Button>
                    </CardFooter>}
                </>}
            </Card>) : <div className="text-center p-8 border border-dashed rounded-md bg-white">
            <p className="text-muted-foreground">No projects added yet</p>
            {isEditing && <AddItemModal title="Add Project" description="Add details about a project you've worked on" triggerText="Add Project" buttonVariant="ghost" className="mt-2 text-primary hover:text-primary-dark">
                {({
            close
          }) => <ProjectForm onSubmit={data => {
            if (handleAddProject(data)) close();
          }} onCancel={close} />}
              </AddItemModal>}
          </div>}
      </div>
    </>;
};
export default ProjectsTab;