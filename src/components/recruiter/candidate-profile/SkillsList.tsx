
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SkillsListProps {
  skills: string[];
}

const SkillsList: React.FC<SkillsListProps> = ({ skills }) => {
  if (!skills || skills.length === 0) {
    return <p className="text-muted-foreground">No skills listed</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <Badge key={index} variant="secondary">
          {skill}
        </Badge>
      ))}
    </div>
  );
};

export default SkillsList;
