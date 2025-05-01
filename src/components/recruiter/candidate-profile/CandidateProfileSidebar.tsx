
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScreeningCandidate } from '@/types/screening';

interface CandidateProfileSidebarProps {
  candidate: ScreeningCandidate;
}

const CandidateProfileSidebar: React.FC<CandidateProfileSidebarProps> = ({ candidate }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={candidate.avatar} alt={candidate.name} />
            <AvatarFallback>{candidate.name?.charAt(0) || 'C'}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{candidate.name}</h2>
          <p className="text-muted-foreground">{candidate.position}</p>
          <div className="flex items-center justify-center mt-2">
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              {candidate.matchScore}% Match
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p>{candidate.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
            <p>{candidate.phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
            <p>{candidate.location}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Experience</h3>
            <p>{candidate.experience} years</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Salary Expectation</h3>
            <p>{candidate.salary}</p>
          </div>
        </div>

        <div className="mt-6">
          <Button className="w-full">Contact Candidate</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateProfileSidebar;
