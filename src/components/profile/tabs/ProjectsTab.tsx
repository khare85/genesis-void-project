
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { LinkIcon, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ProjectsTabProps {
  projects: any[];
  isEditing: boolean;
  form?: any;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects, isEditing, form }) => {
  const { toast } = useToast();
  
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

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-medium">Projects</h3>
        {isEditing && (
          <Button size="sm" variant="outline" className="gap-1">
            <PlusCircle className="h-4 w-4" /> Add Project
          </Button>
        )}
      </div>
      
      <div className="grid gap-5">
        {projects.map((project, index) => (
          <Card key={project.id} className="overflow-hidden">
            {isEditing ? (
              <CardContent className="p-4 space-y-3">
                {form ? (
                  <>
                    <div className="flex justify-between items-start">
                      <FormField
                        control={form.control}
                        name={`projects.${index}.title`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} className="font-medium text-base" defaultValue={project.title} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 -mt-1"
                        onClick={() => handleDeleteProject(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`projects.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea {...field} rows={3} defaultValue={project.description} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`projects.${index}.link`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} defaultValue={project.link} placeholder="Project URL" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`projects.${index}.technologies`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              {...field} 
                              defaultValue={project.technologies.join(', ')} 
                              placeholder="Technologies used (comma separated)" 
                              onChange={(e) => {
                                const techs = e.target.value.split(',').map(t => t.trim());
                                field.onChange(techs);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <>
                    <Input defaultValue={project.title} className="font-medium text-base" />
                    <Textarea defaultValue={project.description} rows={3} />
                    <Input defaultValue={project.link} placeholder="Project URL" />
                    <Input 
                      defaultValue={project.technologies.join(', ')} 
                      placeholder="Technologies used (comma separated)" 
                    />
                  </>
                )}
              </CardContent>
            ) : (
              <>
                <CardHeader className="pb-2">
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.technologies.map((tech: string, index: number) => (
                      <Badge key={index} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      <LinkIcon className="h-3.5 w-3.5" />
                      View Project
                    </a>
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        ))}
      </div>
    </>
  );
};

export default ProjectsTab;
