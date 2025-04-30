
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

interface SkillsSectionProps {
  profileData: any;
  isEditing: boolean;
  form?: any;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ profileData, isEditing, form }) => {
  const { toast } = useToast();

  const handleAddSkill = () => {
    if (!form) return;
    
    const currentSkills = [...form.getValues().skills];
    form.setValue('skills', [...currentSkills, {
      name: "",
      level: 50
    }]);
    
    toast({
      title: "Skill added",
      description: "New skill has been added to your profile"
    });
  };

  const handleDeleteSkill = (index: number) => {
    if (!form) return;
    
    const currentSkills = [...form.getValues().skills];
    currentSkills.splice(index, 1);
    form.setValue('skills', currentSkills);
    
    toast({
      title: "Skill removed",
      description: "Skill has been removed from your profile"
    });
  };

  return (
    <Card>
      <CardHeader className="py-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">Skills</CardTitle>
          {isEditing && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleAddSkill}
              className="h-8 px-2 text-sm"
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {profileData.skills.map((skill: any, index: number) => (
            <div key={skill.name || index} className="space-y-2">
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
                              defaultValue={skill.name} 
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
                            defaultValue={skill.level}
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
          ))}
          
          {(!profileData.skills || profileData.skills.length === 0) && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No skills added yet</p>
              {isEditing && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleAddSkill}
                  className="mt-2"
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Add a skill
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsSection;
