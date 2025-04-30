
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Trash2, PlusCircle, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useProfileData } from '@/hooks/profile';

interface SkillsSectionProps {
  profileData: {
    skills: Array<{
      name: string;
      level: number;
    }>;
  };
  isEditing: boolean;
  form?: any;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ profileData, isEditing, form }) => {
  const { toast } = useToast();
  const { isGeneratingSkills, generateSkills } = useProfileData();
  
  const handleDeleteSkill = (index: number) => {
    if (!form) return;
    
    const currentSkills = [...form.getValues().skills];
    currentSkills.splice(index, 1);
    
    form.setValue('skills', currentSkills);
    
    toast({
      title: "Skill removed",
      description: "The skill has been removed from your profile."
    });
  };
  
  const handleAddSkill = () => {
    if (!form) return;
    
    const newSkill = {
      name: "New Skill",
      level: 50
    };
    
    const currentSkills = [...form.getValues().skills];
    form.setValue('skills', [...currentSkills, newSkill]);
    
    toast({
      title: "Skill added",
      description: "A new skill has been added to your profile."
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md">Skills</CardTitle>
        {isEditing && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateSkills}
              disabled={isGeneratingSkills}
              className="flex items-center gap-1"
            >
              {isGeneratingSkills ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {isGeneratingSkills ? "Generating..." : "AI Generate"}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleAddSkill}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" /> Add
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {profileData.skills.map((skill, index) => (
          <div key={index}>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex justify-between gap-2">
                  <FormField
                    control={form.control}
                    name={`skills.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} placeholder="Skill name" defaultValue={skill.name} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`skills.${index}.level`}
                    render={({ field }) => (
                      <FormItem className="w-20">
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="1" 
                            max="100" 
                            defaultValue={skill.level}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteSkill(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between mb-1 text-sm">
                  <span>{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </>
            )}
          </div>
        ))}
        
        {profileData.skills.length === 0 && (
          <div className="text-center py-3 text-sm text-muted-foreground">
            {isEditing ? (
              <p>Add skills to your profile or use AI to generate them automatically</p>
            ) : (
              <p>No skills added yet</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsSection;
