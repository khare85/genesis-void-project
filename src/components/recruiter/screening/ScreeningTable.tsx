
import React, { useMemo } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { ScreeningCandidate } from "@/types/screening";
import { ScreeningTableHeader } from "./table/ScreeningTableHeader";
import { CandidateRow } from "./table/CandidateRow";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ScreeningTableProps {
  candidates: ScreeningCandidate[];
  sortField: keyof ScreeningCandidate | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof ScreeningCandidate) => void;
  onSelectCandidate: (candidate: ScreeningCandidate) => void;
  onStatusChange: (candidate: ScreeningCandidate, status: "approved" | "rejected") => void;
  isLoading: boolean;
}

export const ScreeningTable: React.FC<ScreeningTableProps> = ({
  candidates,
  sortField,
  sortDirection,
  onSort,
  onSelectCandidate,
  onStatusChange,
  isLoading
}) => {
  // Group candidates by job role
  const candidatesByJob = useMemo(() => {
    const grouped = candidates.reduce<Record<string, ScreeningCandidate[]>>((acc, candidate) => {
      const jobRole = candidate.jobRole || 'Unknown Role';
      if (!acc[jobRole]) {
        acc[jobRole] = [];
      }
      acc[jobRole].push(candidate);
      return acc;
    }, {});
    
    // Sort job roles alphabetically
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([jobRole, candidates]) => ({
        jobRole,
        candidates
      }));
  }, [candidates]);

  if (isLoading) {
    return (
      <div className="rounded-md border">
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
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No candidates found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion 
        type="multiple" 
        defaultValue={candidatesByJob.map(group => group.jobRole)}
        className="space-y-4"
      >
        {candidatesByJob.map(group => (
          <AccordionItem key={group.jobRole} value={group.jobRole} className="border rounded-md">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center">
                <span className="font-medium">{group.jobRole}</span>
                <span className="ml-2 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                  {group.candidates.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-0">
              <div className="rounded-b-md">
                <Table>
                  <ScreeningTableHeader 
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={onSort}
                  />
                  <TableBody>
                    {group.candidates.map(candidate => (
                      <CandidateRow
                        key={candidate.id}
                        candidate={candidate}
                        onSelectCandidate={onSelectCandidate}
                        onStatusChange={onStatusChange}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
