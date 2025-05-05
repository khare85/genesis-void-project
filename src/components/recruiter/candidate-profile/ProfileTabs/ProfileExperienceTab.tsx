
import React from 'react';
import { Briefcase } from 'lucide-react';
import { CompleteCandidateProfile } from '@/hooks/recruiter/useCompleteCandidateProfile';

interface ProfileExperienceTabProps {
  profile: CompleteCandidateProfile;
}

const ProfileExperienceTab: React.FC<ProfileExperienceTabProps> = ({ profile }) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Work Experience</h3>
      <p className="text-sm text-gray-600 mb-4">Professional background and career history</p>
      
      {profile.experience.length > 0 ? (
        <div className="space-y-5">
          {profile.experience.map((exp) => (
            <div key={exp.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{exp.title}</h4>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1 text-gray-500" />
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    {exp.location && (
                      <>
                        <span className="mx-1 text-gray-400">•</span>
                        <p className="text-sm text-gray-600">{exp.location}</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1 md:mt-0 bg-white px-3 py-1 rounded-full text-xs">
                  {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  {' - '}
                  {exp.current 
                    ? 'Present' 
                    : exp.end_date 
                      ? new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                      : 'Present'
                  }
                </div>
              </div>
              {exp.description && (
                <p className="text-sm mt-2 text-gray-700 leading-relaxed">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-500">No experience listed</p>
        </div>
      )}
    </div>
  );
};

export default ProfileExperienceTab;
