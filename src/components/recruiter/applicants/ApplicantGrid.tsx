
import React from "react";
import { ScreeningCandidate } from "@/types/screening";
import { ApplicantCard } from "./ApplicantCard";

interface ApplicantGridProps {
  applicants: ScreeningCandidate[];
}

export const ApplicantGrid: React.FC<ApplicantGridProps> = ({ applicants }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {applicants.map((applicant) => (
        <ApplicantCard key={applicant.id} applicant={applicant} />
      ))}
      
      {applicants.length === 0 && (
        <div className="col-span-full flex h-24 items-center justify-center text-center">
          No applicants found.
        </div>
      )}
    </div>
  );
};
