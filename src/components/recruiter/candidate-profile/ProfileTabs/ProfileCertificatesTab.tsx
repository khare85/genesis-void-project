
import React from 'react';
import { Award } from 'lucide-react';
import { CompleteCandidateProfile } from '@/hooks/recruiter/useCompleteCandidateProfile';

interface ProfileCertificatesTabProps {
  profile: CompleteCandidateProfile;
}

const ProfileCertificatesTab: React.FC<ProfileCertificatesTabProps> = ({ profile }) => {
  return (
    <div className="p-6 bg-white">
      <h3 className="text-lg font-medium text-black mb-2">Certificates</h3>
      <p className="text-sm text-gray-600 mb-4">Professional certifications and qualifications</p>
      
      {profile.certificates.length > 0 ? (
        <div className="space-y-5">
          {profile.certificates.map((cert) => (
            <div key={cert.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <div className="flex gap-3 items-center">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1 md:mt-0 bg-white px-3 py-1 rounded-full text-xs">
                  {cert.issue_date && new Date(cert.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  {cert.expiry_date && ` - ${new Date(cert.expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
                </div>
              </div>
              {cert.credential_id && (
                <p className="text-sm mt-1 text-gray-600">Credential ID: {cert.credential_id}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-500">No certificates listed</p>
        </div>
      )}
    </div>
  );
};

export default ProfileCertificatesTab;
