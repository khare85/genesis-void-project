
import React from 'react';
import { X, Check, FileText, MapPin, Briefcase, Calendar, Phone, Mail } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AIGenerated from "@/components/shared/AIGenerated";
import { ScreeningCandidate } from "@/types/screening";
import { getScreeningExplanation } from '@/utils/matchCategoryUtils';

interface CandidateDetailProps {
  candidate: ScreeningCandidate;
  onClose: () => void;
  onStatusChange: (candidate: ScreeningCandidate, status: "approved" | "rejected") => void;
}

export const CandidateDetail: React.FC<CandidateDetailProps> = ({
  candidate,
  onClose,
  onStatusChange
}) => {
  // Extract match category from screeningNotes if it exists
  const extractMatchCategory = (notes: string): string | null => {
    if (!notes) return null;
    const match = notes.match(/Match Category: (High Match|Medium Match|Low Match|No Match)/i);
    return match ? match[1] : null;
  };

  const notesMatchCategory = extractMatchCategory(candidate.screeningNotes);
  // Use the extracted match category if available, otherwise use the original matchCategory
  const displayedMatchCategory = notesMatchCategory || candidate.matchCategory;
  
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
  
  // Combine AI summary with screening notes
  const getCombinedAISummary = () => {
    const aiSummary = candidate.aiSummary || "No AI summary available.";
    const screeningExplanation = getScreeningExplanation(candidate.screeningNotes);
    
    if (screeningExplanation === "No screening notes available.") {
      return aiSummary;
    } else {
      return `${aiSummary}\n\nScreening Notes: ${screeningExplanation}`;
    }
  };

  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Candidate Details</SheetTitle>
          <SheetDescription>
            Review candidate information and screening results
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 py-4">
          {/* Candidate Header */}
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
          
          {/* Contact Information */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Contact Information</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.location}</span>
              </div>
            </div>
          </div>
          
          {/* Application Details */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Application Details</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.experience} experience</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.education}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Applied on {candidate.dateApplied}</span>
              </div>
            </div>
          </div>
          
          {/* Skills */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.skills && candidate.skills.length > 0 ? (
                candidate.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No skills listed</span>
              )}
            </div>
          </div>
          
          {/* Video Introduction */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Video Introduction</h4>
            <div className="aspect-video bg-muted rounded-md overflow-hidden">
              <video 
                src={candidate.videoIntro} 
                controls 
                poster={candidate.avatar}
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          
          {/* AI Summary with Screening Notes incorporated */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">AI Screening Summary</h4>
            <AIGenerated>
              <p className="text-sm whitespace-pre-line">{getCombinedAISummary()}</p>
            </AIGenerated>
          </div>
        </div>
        
        <SheetFooter className="flex justify-between sm:justify-between pt-4">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
              onClick={() => onStatusChange(candidate, "rejected")}
              disabled={candidate.status === 'rejected'}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-green-500 hover:text-green-600 hover:bg-green-50"
              onClick={() => onStatusChange(candidate, "approved")}
              disabled={candidate.status === 'approved'}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
          
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
