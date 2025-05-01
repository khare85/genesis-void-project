
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface SkillsListProps {
  skills: string[];
}

const SkillsList: React.FC<SkillsListProps> = ({ skills }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2">
          {skills && skills.length > 0 ? (
            skills.map((skill, index) => (
              <span 
                key={index}
                className="bg-muted px-2.5 py-0.5 rounded-full text-sm"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-muted-foreground">No skills listed</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsList;
