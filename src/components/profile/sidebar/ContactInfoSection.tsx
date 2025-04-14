
import React from 'react';
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPin, Mail, Phone } from 'lucide-react';

interface ContactInfoSectionProps {
  profileData: {
    personal: {
      location: string;
      email: string;
      phone: string;
    }
  };
  isEditing: boolean;
  form?: any;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ profileData, isEditing, form }) => {
  return (
    <div className="space-y-3 pt-2">
      {isEditing ? (
        <>
          <FormField
            control={form.control}
            name="personal.location"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Location" 
                    defaultValue={profileData.personal.location}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="personal.email"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <FormControl>
                  <Input 
                    {...field} 
                    type="email"
                    placeholder="Email" 
                    defaultValue={profileData.personal.email}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="personal.phone"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <FormControl>
                  <Input 
                    {...field} 
                    type="tel"
                    placeholder="Phone" 
                    defaultValue={profileData.personal.phone}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{profileData.personal.location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{profileData.personal.email}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{profileData.personal.phone}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default ContactInfoSection;
