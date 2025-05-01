
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ApplicantTable } from "./ApplicantTable";
import { ApplicantGrid } from "./ApplicantGrid";
import { ScreeningCandidate } from "@/types/screening";

interface ApplicantViewSwitcherProps {
  applicants: ScreeningCandidate[];
}

export const ApplicantViewSwitcher: React.FC<ApplicantViewSwitcherProps> = ({ applicants }) => {
  return (
    <Tabs defaultValue="table" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="table">Table View</TabsTrigger>
        <TabsTrigger value="grid">Card View</TabsTrigger>
      </TabsList>
      
      <TabsContent value="table" className="space-y-4">
        <ApplicantTable applicants={applicants} />
      </TabsContent>
      
      <TabsContent value="grid">
        <ApplicantGrid applicants={applicants} />
      </TabsContent>
    </Tabs>
  );
};
