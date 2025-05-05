
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Folder } from "./FolderGrid";

interface TalentPoolTableProps {
  candidates: any[];
  selectedCandidates: string[];
  onSelectCandidate: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  currentFolder: string | null;
  folders: Folder[];
  onMoveToFolder?: (candidateId: string, folderId: string) => Promise<boolean>;
}

export const TalentPoolTable: React.FC<TalentPoolTableProps> = ({
  candidates,
  selectedCandidates,
  onSelectCandidate,
  onSelectAll,
  currentFolder,
  folders,
  onMoveToFolder
}) => {
  const areAllSelected = candidates.length > 0 && selectedCandidates.length === candidates.length;
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
      case 'shortlisted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'interview':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white border-gray-200">
      <div className="w-full overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-[40px] px-4 py-3 text-left">
                <Checkbox 
                  checked={areAllSelected}
                  onCheckedChange={(checked) => onSelectAll(checked === true)}
                  className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Skills</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Position</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date Applied</th>
              <th className="w-[60px] px-4 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr 
                key={candidate.id} 
                className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <Checkbox 
                    checked={selectedCandidates.includes(candidate.id)}
                    onCheckedChange={() => onSelectCandidate(candidate.id)}
                    className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-gray-200">
                      <AvatarImage src={candidate.avatar} alt={candidate.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">{candidate.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link 
                        to={`/recruiter/candidates/${candidate.id}`}
                        className="font-medium text-primary hover:text-primary/80 hover:underline"
                      >
                        {candidate.name}
                      </Link>
                      <div className="text-xs text-gray-500">{candidate.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills && candidate.skills.slice(0, 2).map((skill: string) => (
                      <Badge key={skill} variant="outline" className="bg-primary/5 text-primary border-primary/10 text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {candidate.skills && candidate.skills.length > 2 && (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-xs">
                        +{candidate.skills.length - 2}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{candidate.position}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={`text-xs px-2 py-0.5 capitalize ${getStatusBadgeVariant(candidate.status)}`}>
                    {candidate.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{candidate.applied_date || candidate.dateApplied}</td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white shadow-md border border-gray-200 rounded-md">
                      <DropdownMenuItem className="cursor-pointer text-sm hover:bg-primary/5">
                        <Link to={`/recruiter/candidates/${candidate.id}`} className="flex w-full items-center">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      {onMoveToFolder && (
                        <>
                          <DropdownMenuItem disabled={!currentFolder} className="cursor-pointer text-sm hover:bg-primary/5">
                            Remove from Folder
                          </DropdownMenuItem>
                          {folders
                            .filter(folder => folder.id !== currentFolder)
                            .map(folder => (
                              <DropdownMenuItem 
                                key={folder.id} 
                                className="cursor-pointer text-sm hover:bg-primary/5"
                                onClick={() => onMoveToFolder(candidate.id, folder.id)}
                              >
                                Move to {folder.name}
                              </DropdownMenuItem>
                            ))
                          }
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
