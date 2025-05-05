
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CompleteCandidateProfile } from '@/hooks/recruiter/useCompleteCandidateProfile';

interface ProfileSkillsTabProps {
  profile: CompleteCandidateProfile;
}

const ProfileSkillsTab: React.FC<ProfileSkillsTabProps> = ({ profile }) => {
  return (
    <div className="pt-4 space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Skills</h3>
        <p className="text-sm text-gray-600 mb-4">Professional skills and proficiency levels</p>
        
        {profile.skills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.skills.map(skill => (
              <div key={skill.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-gray-700">{skill.skill_name}</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className={`h-2 w-5 rounded-full ${i < skill.skill_level ? 'bg-blue-500' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-gray-500">No skills listed</p>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Languages</h3>
        <p className="text-sm text-gray-600 mb-4">Language proficiencies</p>
        
        {profile.languages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.languages.map(language => (
              <div key={language.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-gray-700">{language.language_name}</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {language.proficiency}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-gray-500">No languages listed</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSkillsTab;
