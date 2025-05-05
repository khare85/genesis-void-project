import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import AvatarSection from './sidebar/AvatarSection';
import ContactInfoSection from './sidebar/ContactInfoSection';
import SocialLinksSection from './sidebar/SocialLinksSection';
import SkillsSection from './sidebar/SkillsSection';
import LanguagesSection from './sidebar/LanguagesSection';
interface ProfileData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    avatarUrl: string;
    links: {
      portfolio?: string;
      github?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
  skills: Array<{
    name: string;
    level: number;
  }>;
  languages: Array<{
    name: string;
    proficiency: string;
  }>;
}
interface ProfileSidebarProps {
  profileData: ProfileData;
  isEditing?: boolean;
  form?: any;
}
const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  profileData,
  isEditing = false,
  form
}) => {
  return <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 rounded-2xl bg-white">
          <AvatarSection profileData={profileData} isEditing={isEditing} form={form} />
          
          <ContactInfoSection profileData={profileData} isEditing={isEditing} form={form} />
          
          <SocialLinksSection profileData={profileData} isEditing={isEditing} form={form} />
        </CardContent>
      </Card>

      <SkillsSection profileData={profileData} isEditing={isEditing} form={form} />

      <LanguagesSection profileData={profileData} isEditing={isEditing} form={form} />
    </div>;
};
export default ProfileSidebar;