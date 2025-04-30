
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
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
import AddItemModal from "../AddItemModal";

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

  const handleAddLanguage = (data) => {
    if (!form) return false;
    
    try {
      // Ensure languages array exists
      const currentLanguages = form.getValues().languages || [];
      
      // Add new language
      form.setValue('languages', [...currentLanguages, {
        id: uuidv4(),
        name: data.name,
        proficiency: data.proficiency
      }]);
      
      toast({
        title: "Language added",
        description: "New language has been added to your profile"
      });
      
      console.log("Current form values after adding language:", form.getValues());
      return true;
    } catch (error) {
      console.error("Error adding language:", error);
      toast({
        title: "Error",
        description: "Failed to add language",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleDeleteLanguage = (index: number) => {
    if (!form) return;
    
    try {
      const currentLanguages = [...form.getValues().languages];
      currentLanguages.splice(index, 1);
      form.setValue('languages', currentLanguages);
      
      toast({
        title: "Language removed",
        description: "Language has been removed from your profile"
      });
    } catch (error) {
      console.error("Error removing language:", error);
      toast({
        title: "Error",
        description: "Failed to remove language",
        variant: "destructive"
      });
    }
  };
  
  const LanguageForm = ({ onSubmit, onCancel }) => {
    const [proficiency, setProficiency] = React.useState('Intermediate');
    
    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        name: formData.get('name'),
        proficiency: proficiency
      };
      
      onSubmit(data);
    };
    
    return (
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <FormLabel htmlFor="name">Language Name</FormLabel>
            <Input id="name" name="name" placeholder="e.g. English, Spanish, Mandarin" required />
          </div>
          
          <div className="grid gap-2">
            <FormLabel htmlFor="proficiency">Proficiency Level</FormLabel>
            <Select value={proficiency} onValueChange={setProficiency}>
              <SelectTrigger id="proficiency">
                <SelectValue placeholder="Select proficiency level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Fluent">Fluent</SelectItem>
                <SelectItem value="Native">Native</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Add Language</Button>
        </div>
      </form>
    );
  };

  // Ensure profileData.languages is an array
  const languages = Array.isArray(profileData?.languages) ? profileData.languages : [];

  return (
    <Card>
      <CardHeader className="py-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">Languages</CardTitle>
          {isEditing && (
            <AddItemModal
              title="Add Language"
              description="Add a language to your profile"
              triggerText="Add"
              buttonSize="sm"
              className="h-8 px-2 text-sm"
            >
              {({close}) => (
                <LanguageForm 
                  onSubmit={(data) => {
                    if (handleAddLanguage(data)) close();
                  }}
                  onCancel={close}
                />
              )}
            </AddItemModal>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {languages.length > 0 ? (
            languages.map((language: any, index: number) => (
              <div key={language.id || index}>
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
                              onValueChange={field.onChange}
                              defaultValue={field.value}
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
                  <div key={language.id || language.name || index} className="flex justify-between items-center mb-2">
                    <span className="text-sm">{language.name}</span>
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground mr-2">{language.proficiency}</span>
                      <div className={`size-3 rounded-full ${proficiencyColors[language.proficiency as keyof typeof proficiencyColors] || "bg-gray-400"}`}></div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No languages added yet</p>
              {isEditing && (
                <AddItemModal
                  title="Add Language"
                  description="Add a language to your profile"
                  triggerText="Add a language"
                  buttonVariant="ghost"
                  buttonSize="sm"
                  className="mt-2"
                >
                  {({close}) => (
                    <LanguageForm 
                      onSubmit={(data) => {
                        if (handleAddLanguage(data)) close();
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

export default LanguagesSection;
