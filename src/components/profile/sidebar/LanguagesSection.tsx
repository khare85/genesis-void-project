
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

interface LanguagesSectionProps {
  profileData: any;
  isEditing: boolean;
  form?: any;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({ profileData, isEditing, form }) => {
  const { toast } = useToast();

  const proficiencyColors = {
    Basic: "bg-orange-500",
    Intermediate: "bg-yellow-500",
    Advanced: "bg-green-500",
    Fluent: "bg-blue-500",
    Native: "bg-violet-500"
  };
  
  const proficiencyOrder = {
    Basic: 1,
    Intermediate: 2, 
    Advanced: 3,
    Fluent: 4,
    Native: 5
  };

  const handleAddLanguage = () => {
    if (!form) return;
    
    const currentLanguages = [...form.getValues().languages];
    form.setValue('languages', [...currentLanguages, {
      name: "",
      proficiency: "Intermediate"
    }]);
    
    toast({
      title: "Language added",
      description: "New language has been added to your profile"
    });
  };

  const handleDeleteLanguage = (index: number) => {
    if (!form) return;
    
    const currentLanguages = [...form.getValues().languages];
    currentLanguages.splice(index, 1);
    form.setValue('languages', currentLanguages);
    
    toast({
      title: "Language removed",
      description: "Language has been removed from your profile"
    });
  };

  return (
    <Card>
      <CardHeader className="py-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">Languages</CardTitle>
          {isEditing && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleAddLanguage}
              className="h-8 px-2 text-sm"
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {profileData.languages.map((language: any, index: number) => (
            <div key={language.name || index}>
              {isEditing ? (
                <div className="flex items-center gap-2 mb-3">
                  <FormField
                    control={form?.control}
                    name={`languages.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input 
                            placeholder="Language" 
                            defaultValue={language.name} 
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form?.control}
                    name={`languages.${index}.proficiency`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Select 
                            defaultValue={language.proficiency} 
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Proficiency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Basic">Basic</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                              <SelectItem value="Fluent">Fluent</SelectItem>
                              <SelectItem value="Native">Native</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteLanguage(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div key={language.name} className="flex justify-between items-center mb-2">
                  <span className="text-sm">{language.name}</span>
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground mr-2">{language.proficiency}</span>
                    <div className={`size-3 rounded-full ${proficiencyColors[language.proficiency as keyof typeof proficiencyColors] || "bg-gray-400"}`}></div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {(!profileData.languages || profileData.languages.length === 0) && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No languages added yet</p>
              {isEditing && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleAddLanguage}
                  className="mt-2"
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Add a language
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguagesSection;
