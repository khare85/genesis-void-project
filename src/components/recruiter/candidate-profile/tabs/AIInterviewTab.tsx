
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Clock, Calendar, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ScheduleInterviewModal } from '../ScheduleInterviewModal';
import AIInterviewSession from '@/components/application/AIInterviewSession';

interface AIInterviewTabProps {
  candidateId: string;
  name: string;
}

interface Interview {
  id: string;
  type: 'ai' | 'face-to-face';
  scheduledDate?: Date;
  dateCreated: Date;
  expiryDate?: Date;
  status: 'scheduled' | 'completed' | 'expired' | 'cancelled';
  notes?: string;
  agentId?: string;
  jobTitle?: string;
}

export const AIInterviewTab: React.FC<AIInterviewTabProps> = ({ candidateId, name }) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  // Mock data fetching - in a real app this would come from a database
  useEffect(() => {
    // Simulating API call to get interviews for the candidate
    setTimeout(() => {
      const mockInterviews: Interview[] = [
        {
          id: '1',
          type: 'ai',
          dateCreated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // expires in 1 day
          status: 'scheduled',
          agentId: 'EVQJtCNSo0L6uHQnImQu',
          jobTitle: 'Senior React Developer'
        },
        {
          id: '2',
          type: 'face-to-face',
          scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          dateCreated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          status: 'scheduled',
          jobTitle: 'Frontend Engineer'
        }
      ];
      setInterviews(mockInterviews);
      setLoading(false);
    }, 500);
  }, [candidateId]);

  const handleStartAIInterview = (interview: Interview) => {
    setSelectedInterview(interview);
    setIsSessionActive(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">Interviews</h2>
        <Button 
          size="sm" 
          onClick={() => setIsScheduleModalOpen(true)}
        >
          <Video className="h-4 w-4 mr-2" />
          Schedule New Interview
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : interviews.length === 0 ? (
        <Card className="p-8 text-center">
          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No interviews scheduled</h3>
          <p className="text-muted-foreground mb-4">Schedule an interview to assess this candidate.</p>
          <Button onClick={() => setIsScheduleModalOpen(true)}>Schedule Interview</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <Card key={interview.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Video className="h-4 w-4 text-primary" />
                    <span className="font-medium">
                      {interview.type === 'ai' ? 'AI Interview' : 'Face-to-Face Interview'}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                      interview.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm mb-1">
                    {interview.jobTitle || 'Interview'}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm text-muted-foreground">
                    {interview.scheduledDate && (
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {interview.scheduledDate.toLocaleDateString()}
                        <Clock className="h-3.5 w-3.5 mx-1 ml-2" />
                        {interview.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                    {interview.type === 'ai' && interview.expiryDate && (
                      <div className="mt-1 sm:mt-0 flex items-center">
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        Expires: {formatDistanceToNow(interview.expiryDate, { addSuffix: true })}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  {interview.type === 'ai' && interview.status === 'scheduled' ? (
                    <Button 
                      size="sm"
                      onClick={() => handleStartAIInterview(interview)}
                    >
                      Join Interview
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ScheduleInterviewModal 
        isOpen={isScheduleModalOpen} 
        onClose={() => setIsScheduleModalOpen(false)}
        candidateId={candidateId}
        candidateName={name}
        candidateEmail=""
      />

      {selectedInterview && (
        <AIInterviewSession
          open={isSessionActive}
          onClose={() => setIsSessionActive(false)}
          agentId={selectedInterview.agentId}
          candidateName={name}
          jobTitle={selectedInterview.jobTitle}
        />
      )}
    </div>
  );
};
