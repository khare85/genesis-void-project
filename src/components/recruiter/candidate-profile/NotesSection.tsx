
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface NotesSectionProps {
  notes: string | undefined;
}

const NotesSection: React.FC<NotesSectionProps> = ({ notes }) => {
  return (
    <Card>
      <CardContent className="p-6">
        {notes ? (
          <p className="whitespace-pre-wrap">{notes}</p>
        ) : (
          <p className="text-muted-foreground">No notes available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default NotesSection;
