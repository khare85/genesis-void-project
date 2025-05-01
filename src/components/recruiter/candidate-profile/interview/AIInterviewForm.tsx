
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Video } from "lucide-react";

interface ElevenLabsAgent {
  id: string;
  name: string;
  isConversational?: boolean;
}

interface AIInterviewFormProps {
  agents: ElevenLabsAgent[];
  selectedAgentId: string;
  setSelectedAgentId: (id: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
  isLoadingAgents: boolean;
}

export const AIInterviewForm: React.FC<AIInterviewFormProps> = ({
  agents,
  selectedAgentId,
  setSelectedAgentId,
  duration,
  setDuration,
  isLoadingAgents
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="agent" className="flex items-center">
          <Video className="mr-2 h-4 w-4" />
          AI Interview Agent
        </Label>
        <Select 
          value={selectedAgentId} 
          onValueChange={setSelectedAgentId}
          disabled={isLoadingAgents || agents.length === 0}
        >
          <SelectTrigger>
            {isLoadingAgents ? (
              <div className="flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary mr-2"></div>
                Loading agents...
              </div>
            ) : (
              <SelectValue placeholder="Select an agent" />
            )}
          </SelectTrigger>
          <SelectContent>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name} {agent.isConversational ? "(Conversational)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="45">45 minutes</SelectItem>
            <SelectItem value="60">60 minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="rounded-md bg-muted p-4">
        <div className="flex items-start mb-2">
          <Info className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
          <p className="text-sm">
            An AI interview allows the candidate to complete the interview at their convenience.
            They will receive a link to participate in an automated video interview with our AI agent.
          </p>
        </div>
        <p className="text-sm text-amber-600">
          Interview link will automatically expire in 3 days if not completed.
        </p>
      </div>
    </>
  );
};
