
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import AddItemModal from "../AddItemModal";

interface SkillsSectionProps {
  profileData: any;
  isEditing: boolean;
  form?: any;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ profileData, isEditing, form }) => {
  const { toast } = useToast();

  const handleAddSkill = (data) => {
    if (!form) return false;
    
    try {
      // Ensure skills array exists
      const currentSkills = form.getValues().skills || [];
      
      // Add new skill
      form.setValue('skills', [...currentSkills, {
        id: uuidv4(),
        name: data.name,
        level: parseInt(data.level)
      }]);
      
      toast({
        title: "Skill added",
        description: "New skill has been added to your profile"
      });
      
      console.log("Current form values after adding skill:", form.getValues());
      return true;
    } catch (error) {
      console.error("Error adding skill:", error);
      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleDeleteSkill = (index: number) => {
    if (!form) return;
    
    try {
      const currentSkills = [...form.getValues().skills];
      currentSkills.splice(index, 1);
      form.setValue('skills', currentSkills);
      
      toast({
        title: "Skill removed",
        description: "Skill has been removed from your profile"
      });
    } catch (error) {
      console.error("Error removing skill:", error);
      toast({
        title: "Error",
        description: "Failed to remove skill",
        variant: "destructive"
      });
    }
  };
  
  const SkillForm = ({ onSubmit, onCancel }) => {
    const [level, setLevel] = React.useState(50);
    
    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        name: formData.get('name'),
        level: level
      };
      
      onSubmit(data);
    };
    
    return (
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <FormLabel htmlFor="name">Skill Name</FormLabel>
            <Input id="name" name="name" placeholder="e.g. JavaScript, Project Management" required />
          </div>
          
          <div className="grid gap-2">
            <div className="flex justify-between">
              <FormLabel htmlFor="level">Proficiency Level: {level}%</FormLabel>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs">Beginner</span>
              <input
                id="level"
                name="level"
                type="range"
                min="1"
                max="100"
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs">Expert</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Add Skill</Button>
        </div>
      </form>
    );
  };

  // Ensure profileData.skills is an array
  const skills = Array.isArray(profileData?.skills) ? profileData.skills : [];

  return (
    <Card>
      <CardHeader className="py-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">Skills</CardTitle>
          {isEditing && (
            <AddItemModal
              title="Add Skill"
              description="Add a new skill to your profile"
              triggerText="Add"
              buttonSize="sm"
              className="h-8 px-2 text-sm"
            >
              {({close}) => (
                <SkillForm 
                  onSubmit={(data) => {
                    if (handleAddSkill(data)) close();
                  }}
                  onCancel={close}
                />
              )}
            </AddItemModal>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {skills.length > 0 ? (
            skills.map((skill: any, index: number) => (
              <div key={skill.id || index} className="space-y-2">
                {isEditing ? (
                  <div className="grid gap-2">
                    <div className="flex gap-2">
                      <FormField
                        control={form?.control}
                        name={`skills.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="Skill name" 
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSkill(index)}
                        className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormField
                      control={form?.control}
                      name={`skills.${index}.level`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel className="text-xs text-muted-foreground">Beginner</FormLabel>
                            <FormLabel className="text-xs text-muted-foreground">Expert</FormLabel>
                          </div>
                          <FormControl>
                            <input
                              type="range"
                              min={1}
                              max={100}
                              className="w-full"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <p className="text-sm">{skill.name}</p>
                      <span className="text-xs text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded">
                      <div 
                        className="h-full bg-primary rounded" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No skills added yet</p>
              {isEditing && (
                <AddItemModal
                  title="Add Skill"
                  description="Add a new skill to your profile"
                  triggerText="Add a skill"
                  buttonVariant="ghost"
                  buttonSize="sm"
                  className="mt-2"
                >
                  {({close}) => (
                    <SkillForm 
                      onSubmit={(data) => {
                        if (handleAddSkill(data)) close();
                      }}
                      onCancel={close}
                    />
                  )}
                </AddItemModal>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsSection;
