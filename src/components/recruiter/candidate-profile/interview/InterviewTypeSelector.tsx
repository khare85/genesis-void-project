
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Users, Video } from "lucide-react";

interface InterviewTypeSelectorProps {
  interviewType: "ai" | "face-to-face";
  setInterviewType: (type: "ai" | "face-to-face") => void;
}

export const InterviewTypeSelector: React.FC<InterviewTypeSelectorProps> = ({
  interviewType,
  setInterviewType
}) => {
  return (
    <RadioGroup 
      value={interviewType} 
      onValueChange={(value) => setInterviewType(value as "ai" | "face-to-face")}
      className="flex flex-col space-y-3"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="face-to-face" id="face-to-face" />
        <Label htmlFor="face-to-face" className="flex items-center cursor-pointer">
          <Users className="mr-2 h-4 w-4" /> 
          Face-to-Face (Teams)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="ai" id="ai" />
        <Label htmlFor="ai" className="flex items-center cursor-pointer">
          <Video className="mr-2 h-4 w-4" /> 
          AI Interview
        </Label>
      </div>
    </RadioGroup>
  );
};
