
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { ScreeningCandidate } from "@/types/screening";
import { ScreeningTableHeader } from "./table/ScreeningTableHeader";
import { CandidateRow } from "./table/CandidateRow";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";

interface ScreeningTableProps {
  candidates: ScreeningCandidate[];
  sortField: keyof ScreeningCandidate | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof ScreeningCandidate) => void;
  onSelectCandidate: (candidate: ScreeningCandidate) => void;
  onStatusChange: (candidate: ScreeningCandidate, status: "approved" | "rejected") => void;
  isLoading: boolean;
  selectedCandidates: string[];
  onSelectCandidateForScreening: (candidateId: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
}

export const ScreeningTable: React.FC<ScreeningTableProps> = ({
  candidates,
  sortField,
  sortDirection,
  onSort,
  onSelectCandidate,
  onStatusChange,
  isLoading,
  selectedCandidates,
  onSelectCandidateForScreening,
  onSelectAll
}) => {
  if (isLoading) {
    return (
      <div className="rounded-md">
        <Table>
          <ScreeningTableHeader 
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          />
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td className="py-2 px-4"><Skeleton className="h-10 w-10 rounded-full" /></td>
                <td>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </td>
                <td><Skeleton className="h-4 w-24" /></td>
                <td><Skeleton className="h-4 w-20" /></td>
                <td><Skeleton className="h-6 w-16" /></td>
                <td><div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div></td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="rounded-md p-8 text-center bg-white/50 shadow-inner">
        <p className="text-muted-foreground">No candidates found.</p>
      </div>
    );
  }

  const areAllSelected = candidates.length > 0 && candidates.every(candidate => 
    selectedCandidates.includes(String(candidate.id))
  );

  return (
    <div className="rounded-md bg-white/70 overflow-hidden">
      <Table>
        <ScreeningTableHeader 
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
          showSelection={true}
          allSelected={areAllSelected}
          onSelectAll={onSelectAll}
        />
        <TableBody>
          {candidates.map(candidate => (
            <CandidateRow
              key={candidate.id}
              candidate={candidate}
              onSelectCandidate={onSelectCandidate}
              onStatusChange={onStatusChange}
              isSelected={selectedCandidates.includes(String(candidate.id))}
              onSelect={(isSelected) => onSelectCandidateForScreening(String(candidate.id), isSelected)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
