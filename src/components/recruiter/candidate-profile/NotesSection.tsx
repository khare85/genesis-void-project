
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface NotesSectionProps {
  candidateId: string;
  notes?: string;
}

const NotesSection: React.FC<NotesSectionProps> = ({ candidateId, notes: initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes || '');
  const [isEditing, setIsEditing] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  
  const handleEdit = () => {
    setTempNotes(notes);
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleSave = () => {
    setNotes(tempNotes);
    setIsEditing(false);
    
    // In a real app, this would save to a database
    console.log(`Saving notes for candidate ${candidateId}: ${tempNotes}`);
    
    // Simulate API call to save the notes
    // await supabase.from('candidate_notes').upsert({ candidate_id: candidateId, notes: tempNotes });
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Notes</h3>
          {!isEditing && (
            <Button variant="ghost" size="sm" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </div>
        
        {isEditing ? (
          <div className="space-y-3">
            <Textarea 
              value={tempNotes} 
              onChange={(e) => setTempNotes(e.target.value)} 
              placeholder="Add notes about this candidate..."
              className="min-h-[120px]" 
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Notes
              </Button>
            </div>
          </div>
        ) : notes ? (
          <p className="whitespace-pre-wrap">{notes}</p>
        ) : (
          <div className="text-center py-6 border border-dashed rounded-md">
            <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground mb-3">No notes have been added yet</p>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Add Notes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotesSection;
