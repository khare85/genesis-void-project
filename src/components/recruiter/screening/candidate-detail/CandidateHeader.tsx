
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScreeningCandidate } from "@/types/screening";

interface CandidateHeaderProps {
  candidate: ScreeningCandidate;
  displayedMatchCategory: string;
}

export const CandidateHeader: React.FC<CandidateHeaderProps> = ({ 
  candidate, 
  displayedMatchCategory 
}) => {
  const getMatchBadge = (category: string) => {
    switch(category) {
      case "High Match":
        return <Badge className="bg-green-500 hover:bg-green-600">High Match</Badge>;
      case "Medium Match":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Medium Match</Badge>;
      case "Low Match":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Low Match</Badge>;
      case "No Match":
        return <Badge className="bg-red-500 hover:bg-red-600">No Match</Badge>;
      default:
        return <Badge variant="outline">Unrated</Badge>;
    }
  };

  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-16 w-16 border">
        <AvatarImage src={candidate.avatar} alt={candidate.name} />
        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <h3 className="text-lg font-medium">{candidate.name}</h3>
        <p className="text-sm text-muted-foreground">{candidate.jobRole}</p>
        
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {candidate.position}
          </Badge>
          <Badge 
            variant={
              candidate.status === 'approved' ? "default" : 
              candidate.status === 'rejected' ? "destructive" : 
              "secondary"
            }
            className="text-xs"
          >
            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
          </Badge>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-1">
        {getMatchBadge(displayedMatchCategory)}
        <span className="text-xs text-muted-foreground mt-1">Match Rating</span>
      </div>
    </div>
  );
};
