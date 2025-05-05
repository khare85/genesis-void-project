
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Share } from 'lucide-react';

interface ProfileActionsProps {
  onDownloadResume: () => void;
  onShareProfile: () => void;
  onScheduleInterview: () => void;
  hasResume: boolean;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  onDownloadResume,
  onShareProfile,
  onScheduleInterview,
  hasResume
}) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={onDownloadResume}
          disabled={!hasResume}
        >
          <Download className="h-4 w-4" />
          Download Resume
        </Button>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={onShareProfile}
        >
          <Share className="h-4 w-4" />
          Share Profile
        </Button>
      </div>
      
      <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={onScheduleInterview}>
        <Calendar className="h-4 w-4" />
        Schedule Interview
      </Button>
    </div>
  );
};

export default ProfileActions;
