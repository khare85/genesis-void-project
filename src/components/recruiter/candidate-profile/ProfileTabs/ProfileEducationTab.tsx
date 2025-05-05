
import React from 'react';
import { GraduationCap } from 'lucide-react';
import { CompleteCandidateProfile } from '@/hooks/recruiter/useCompleteCandidateProfile';

interface ProfileEducationTabProps {
  profile: CompleteCandidateProfile;
}

const ProfileEducationTab: React.FC<ProfileEducationTabProps> = ({ profile }) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Education</h3>
      <p className="text-sm text-gray-600 mb-4">Academic background and qualifications</p>
      
      {profile.education.length > 0 ? (
        <div className="space-y-5">
          {profile.education.map((edu) => (
            <div key={edu.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-1 text-gray-500" />
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1 md:mt-0 bg-white px-3 py-1 rounded-full text-xs">
                  {new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  {' - '}
                  {edu.end_date 
                    ? new Date(edu.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                    : 'Present'
                  }
                </div>
              </div>
              {edu.description && (
                <p className="text-sm mt-2 text-gray-700 leading-relaxed">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-500">No education listed</p>
        </div>
      )}
    </div>
  );
};

export default ProfileEducationTab;
