
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

interface BioSectionProps {
  profileData: any;
  isEditing: boolean;
  form?: any;
}

const BioSection: React.FC<BioSectionProps> = ({ profileData, isEditing, form }) => {
  return (
    <Card className="border border-gray-100 shadow-lg transform transition-all duration-300 hover:shadow-xl bg-white">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-black mb-4">About Me</h3>
        {isEditing ? (
          <FormField
            control={form?.control}
            name="personal.bio"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className="w-full"
                    rows={4}
                    placeholder="Tell us about yourself"
                    {...field}
                    defaultValue={profileData.personal.bio}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ) : (
          <p className="text-gray-600">{profileData.personal.bio}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default BioSection;
