import React from 'react';
import { Badge } from "@/components/ui/badge";
interface CandidateSkillsProps {
  skills: string[];
}
export const CandidateSkills: React.FC<CandidateSkillsProps> = ({
  skills
}) => {
  return <div className="space-y-2">
      <h4 className="text-sm font-bold">Skills</h4>
      <div className="flex flex-wrap gap-2">
        {skills && skills.length > 0 ? skills.map((skill, index) => <Badge key={index} variant="outline" className="text-xs bg-orange-200">
              {skill}
            </Badge>) : <span className="text-sm text-muted-foreground">No skills listed</span>}
      </div>
    </div>;
};