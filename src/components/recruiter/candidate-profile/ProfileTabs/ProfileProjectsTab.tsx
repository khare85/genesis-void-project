
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import { CompleteCandidateProfile } from '@/hooks/recruiter/useCompleteCandidateProfile';

interface ProfileProjectsTabProps {
  profile: CompleteCandidateProfile;
}

const ProfileProjectsTab: React.FC<ProfileProjectsTabProps> = ({ profile }) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Projects</h3>
      <p className="text-sm text-gray-600 mb-4">Personal and professional projects</p>
      
      {profile.projects.length > 0 ? (
        <div className="space-y-5">
          {profile.projects.map((project) => (
            <div key={project.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{project.title}</h4>
                {project.link && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 mt-1 md:mt-0 bg-white"
                    onClick={() => window.open(project.link, '_blank')}
                  >
                    <Globe className="mr-1 h-3 w-3" />
                    View Project
                  </Button>
                )}
              </div>
              {project.description && (
                <p className="text-sm mt-2 text-gray-700 leading-relaxed">{project.description}</p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.technologies.map((tech, i) => (
                    <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{tech}</Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-500">No projects listed</p>
        </div>
      )}
    </div>
  );
};

export default ProfileProjectsTab;
