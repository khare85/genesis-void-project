
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
  onSelectCandidateChange: (id: string, selected: boolean) => void;
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
  onSelectCandidateChange
}) => {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <ScreeningTableHeader 
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
            showSelectionColumn={true}
          />
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td className="py-2 px-4"><Skeleton className="h-4 w-4" /></td>
                <td className="py-2 px-4"><Skeleton className="h-10 w-10 rounded-full" /></td>
                <td>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </td>
                <td><Skeleton className="h-4 w-24" /></td>
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
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No candidates found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <ScreeningTableHeader 
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
          showSelectionColumn={true}
        />
        <TableBody>
          {candidates.map(candidate => (
            <CandidateRow
              key={candidate.id}
              candidate={candidate}
              onSelectCandidate={onSelectCandidate}
              onStatusChange={onStatusChange}
              isSelected={selectedCandidates.includes(candidate.id.toString())}
              onSelectChange={onSelectCandidateChange}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
