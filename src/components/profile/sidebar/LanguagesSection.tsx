
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Languages, Trash2, PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LanguagesSectionProps {
  profileData: {
    languages: Array<{
      name: string;
      proficiency: string;
    }>;
  };
  isEditing: boolean;
  form?: any;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({ profileData, isEditing, form }) => {
  const { toast } = useToast();
  
  const handleDeleteLanguage = (index: number) => {
    if (!form) return;
    
    const currentLanguages = [...form.getValues().languages];
    currentLanguages.splice(index, 1);
    
    form.setValue('languages', currentLanguages);
    
    toast({
      title: "Language removed",
      description: "The language has been removed from your profile."
    });
  };
  
  const handleAddLanguage = () => {
    if (!form) return;
    
    const newLanguage = {
      name: "New Language",
      proficiency: "Basic"
    };
    
    const currentLanguages = [...form.getValues().languages];
    form.setValue('languages', [...currentLanguages, newLanguage]);
    
    toast({
      title: "Language added",
      description: "A new language has been added to your profile."
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md">Languages</CardTitle>
        {isEditing && (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleAddLanguage}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" /> Add
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {profileData.languages.map((language, index) => (
            <div key={index} className="flex justify-between items-center">
              {isEditing ? (
                <>
                  <FormField
                    control={form.control}
                    name={`languages.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="flex items-center gap-2">
                          <Languages className="h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input {...field} placeholder="Language" defaultValue={language.name} />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`languages.${index}.proficiency`}
                    render={({ field }) => (
                      <FormItem className="w-32 ml-2">
                        <FormControl>
                          <Input {...field} placeholder="Proficiency" defaultValue={language.proficiency} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-1"
                    onClick={() => handleDeleteLanguage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <span>{language.name}</span>
                  </div>
                  <Badge variant="secondary">{language.proficiency}</Badge>
                </>
              )}
            </div>
          ))}
          
          {profileData.languages.length === 0 && (
            <div className="text-center py-3 text-sm text-muted-foreground">
              {isEditing ? (
                <p>Add languages to your profile or use the AI Fill Profile button in the header</p>
              ) : (
                <p>No languages added yet</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguagesSection;
