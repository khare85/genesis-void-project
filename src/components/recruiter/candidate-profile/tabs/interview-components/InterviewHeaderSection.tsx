
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface InterviewHeaderSectionProps {
  openScheduleModal: () => void;
}

export const InterviewHeaderSection: React.FC<InterviewHeaderSectionProps> = ({ 
  openScheduleModal 
}) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">AI Interviews</h3>
      <Button 
        variant="default"
        size="sm" 
        onClick={openScheduleModal}
        className="gap-1.5"
      >
        <Calendar className="h-4 w-4" />
        Schedule AI Interview
      </Button>
    </div>
  );
};
