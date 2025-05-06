
import React from 'react';
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, Github, Linkedin, Twitter, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface SocialLinksSectionProps {
  profileData: {
    personal: {
      links: {
        portfolio?: string;
        github?: string;
        linkedin?: string;
        twitter?: string;
      }
    }
  };
  isEditing: boolean;
  form?: any;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ profileData, isEditing, form }) => {
  const { toast } = useToast();
  
  const handleDeleteLink = (linkType: string) => {
    if (!form) return;
    
    form.setValue(`personal.links.${linkType}`, '');
    
    toast({
      title: "Link removed",
      description: `Your ${linkType} link has been removed from your profile.`
    });
  };
  
  return (
    <div className="mt-5">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Social Links</h4>
      {isEditing ? (
        <div className="flex flex-col space-y-3">
          <FormField
            control={form.control}
            name="personal.links.portfolio"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <Globe className="h-4 w-4 flex-shrink-0 text-gray-600" />
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Portfolio URL"
                    defaultValue={profileData.personal.links.portfolio || ""}
                  />
                </FormControl>
                {field.value && (
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteLink('portfolio')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="personal.links.github"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <Github className="h-4 w-4 flex-shrink-0 text-gray-600" />
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="GitHub URL"
                    defaultValue={profileData.personal.links.github || ""}
                  />
                </FormControl>
                {field.value && (
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteLink('github')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="personal.links.linkedin"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 flex-shrink-0 text-gray-600" />
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="LinkedIn URL"
                    defaultValue={profileData.personal.links.linkedin || ""}
                  />
                </FormControl>
                {field.value && (
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteLink('linkedin')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="personal.links.twitter"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <Twitter className="h-4 w-4 flex-shrink-0 text-gray-600" />
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Twitter URL"
                    defaultValue={profileData.personal.links.twitter || ""}
                  />
                </FormControl>
                {field.value && (
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteLink('twitter')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </FormItem>
            )}
          />
        </div>
      ) : (
        <div className="flex justify-start space-x-3 mt-3">
          {profileData.personal.links.portfolio && (
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" asChild>
              <a href={profileData.personal.links.portfolio} target="_blank" rel="noopener noreferrer">
                <Globe className="h-5 w-5" />
              </a>
            </Button>
          )}
          
          {profileData.personal.links.github && (
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" asChild>
              <a href={profileData.personal.links.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>
          )}
          
          {profileData.personal.links.linkedin && (
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" asChild>
              <a href={profileData.personal.links.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
          )}
          
          {profileData.personal.links.twitter && (
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" asChild>
              <a href={profileData.personal.links.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialLinksSection;
