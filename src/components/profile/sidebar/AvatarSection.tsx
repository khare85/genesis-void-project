
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Upload } from 'lucide-react';

interface AvatarSectionProps {
  profileData: {
    personal: {
      name: string;
      title: string;
      avatarUrl: string;
    }
  };
  isEditing: boolean;
  form?: any;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ profileData, isEditing, form }) => {
  return (
    <div className="flex flex-col items-center text-center mb-4">
      <div className="relative mb-3">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profileData.personal.avatarUrl} alt={profileData.personal.name} />
          <AvatarFallback>{profileData.personal.name.charAt(0)}</AvatarFallback>
        </Avatar>
        {isEditing && (
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute bottom-0 right-0 rounded-full border bg-background shadow"
          >
            <Upload className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-2 w-full">
          <FormField
            control={form.control}
            name="personal.name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Your Name" 
                    className="text-center font-medium"
                    defaultValue={profileData.personal.name}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="personal.title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Job Title" 
                    className="text-center text-sm"
                    defaultValue={profileData.personal.title}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold">{profileData.personal.name}</h2>
          <p className="text-muted-foreground">{profileData.personal.title}</p>
        </>
      )}
    </div>
  );
};

export default AvatarSection;
