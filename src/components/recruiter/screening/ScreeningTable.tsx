
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { ScreeningCandidate } from "@/types/screening";
import { ScreeningTableHeader } from "./table/ScreeningTableHeader";
import { CandidateRow } from "./table/CandidateRow";

interface ScreeningTableProps {
  candidates: ScreeningCandidate[];
  sortField: keyof ScreeningCandidate | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof ScreeningCandidate) => void;
  onSelectCandidate: (candidate: ScreeningCandidate) => void;
  onStatusChange: (candidate: ScreeningCandidate, status: "approved" | "rejected") => void;
}

export const ScreeningTable: React.FC<ScreeningTableProps> = ({
  candidates,
  sortField,
  sortDirection,
  onSort,
  onSelectCandidate,
  onStatusChange
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <ScreeningTableHeader 
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
        />
        <TableBody>
          {candidates.length === 0 ? (
            <tr>
              <td colSpan={7} className="h-24 text-center">
                No candidates found.
              </td>
            </tr>
          ) : (
            candidates.map((candidate) => (
              <CandidateRow
                key={candidate.id}
                candidate={candidate}
                onSelectCandidate={onSelectCandidate}
                onStatusChange={onStatusChange}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
