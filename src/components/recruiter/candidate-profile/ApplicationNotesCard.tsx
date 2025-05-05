
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ApplicationNotesCardProps {
  screeningNotes?: string;
  position?: string;
}

const ApplicationNotesCard: React.FC<ApplicationNotesCardProps> = ({ screeningNotes, position }) => {
  if (!screeningNotes) return null;
  
  return (
    <Card className="shadow-md border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-800">Application Notes</CardTitle>
        {position && (
          <CardDescription className="text-gray-600">
            Position: {position}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm whitespace-pre-line text-gray-700">{screeningNotes}</p>
      </CardContent>
    </Card>
  );
};

export default ApplicationNotesCard;
