
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Folder } from './FolderGrid';
import { CandidateInfo } from "./table/CandidateInfo";
import { TableActions } from "./table/TableActions";
import { StatusBadge } from "./table/StatusBadge";
import { EmptyState } from "./table/EmptyState";

interface TalentPoolTableProps {
  candidates: any[];
  selectedCandidates: string[];
  onSelectCandidate: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  currentFolder: string | null;
  folders: Folder[];
  onMoveToFolder?: (candidateId: string, folderId: string) => void;
}

export const TalentPoolTable: React.FC<TalentPoolTableProps> = ({
  candidates,
  selectedCandidates,
  onSelectCandidate,
  onSelectAll,
  currentFolder,
  folders = [],
  onMoveToFolder,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={
                  candidates.length > 0 &&
                  selectedCandidates.length === candidates.length
                }
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead className="w-[40px]">SN</TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Recent Job & Stage</TableHead>
            <TableHead>Current Designation</TableHead>
            <TableHead>Current Company</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.length === 0 ? (
            <EmptyState colSpan={8} />
          ) : (
            candidates.map((candidate, index) => (
              <TableRow key={candidate.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedCandidates.includes(candidate.id.toString())}
                    onCheckedChange={() => onSelectCandidate(candidate.id.toString())}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">
                  <CandidateInfo 
                    id={candidate.id} 
                    name={candidate.name} 
                    profilePic={candidate.profilePic} 
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{candidate.position}</span>
                    <span className="text-sm text-muted-foreground">Applied</span>
                  </div>
                </TableCell>
                <TableCell>{candidate.position || "Not specified"}</TableCell>
                <TableCell>{candidate.company || "Not specified"}</TableCell>
                <TableCell>
                  {new Date(candidate.appliedDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <TableActions 
                    candidateId={candidate.id} 
                    currentFolder={currentFolder}
                    folders={folders}
                    onMoveToFolder={onMoveToFolder}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
