
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface CandidateInfoProps {
  id: string;
  name: string;
  profilePic: string;
}

export const CandidateInfo: React.FC<CandidateInfoProps> = ({ id, name, profilePic }) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={profilePic} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <Link
        to={`/recruiter/candidates/${id}`}
        className="hover:text-primary hover:underline"
      >
        {name}
      </Link>
    </div>
  );
};
