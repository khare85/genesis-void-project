
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BioCardProps {
  bio: string | null | undefined;
}

const BioCard: React.FC<BioCardProps> = ({ bio }) => {
  if (!bio) return null;
  
  return (
    <Card className="shadow-md border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-800">About</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm leading-relaxed text-gray-700">{bio}</p>
      </CardContent>
    </Card>
  );
};

export default BioCard;
