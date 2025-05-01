
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Folder } from './FolderGrid';
import { CandidateInfo } from "./table/CandidateInfo";
import { TableActions } from "./table/TableActions";
import { StatusBadge } from "./table/StatusBadge";
import { EmptyState } from "./table/EmptyState";
import { Badge } from "@/components/ui/badge";

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
  // Function to get folder name from folder ID
  const getFolderName = (folderId: string | null) => {
    if (!folderId) return "Uncategorized";
    const folder = folders.find(f => f.id === folderId);
    return folder ? folder.name : "Unknown Folder";
  };

  // Function to get folder color from folder ID
  const getFolderColor = (folderId: string | null) => {
    if (!folderId) return "#64748b"; // slate-500 for uncategorized
    const folder = folders.find(f => f.id === folderId);
    return folder?.color || "#64748b";
  };

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
            <TableHead>Folder</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.length === 0 ? (
            <EmptyState colSpan={9} />
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
                  <Badge 
                    className="whitespace-nowrap" 
                    style={{ 
                      backgroundColor: getFolderColor(candidate.folderId),
                      color: '#fff'
                    }}
                  >
                    {getFolderName(candidate.folderId)}
                  </Badge>
                </TableCell>
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
