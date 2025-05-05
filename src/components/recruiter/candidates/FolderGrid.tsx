import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical, Folder as FolderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface FolderGridProps {
  currentFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
  folders: Folder[];
  onCreateFolder?: () => void;
  onEditFolder?: (folder: Folder) => void;
  onDeleteFolder?: (folder: Folder) => void;
}

export interface Folder {
  id: string;
  name: string;
  description: string;
  count: number;
  isDefault?: boolean;
  color?: string;
}

// Sample folder data
const defaultFolders = [
  {
    id: "default",
    name: "Default Folder",
    description: "Default folder contains the list of all the candidates from the organization, and cannot be deleted",
    count: 32982,
    isDefault: true,
    color: "#3b82f6" // blue
  },
  {
    id: "employee-referral",
    name: "Employee Referral",
    description: "Employee Referral contains the list of all the candidates referred through email",
    count: 0,
    isDefault: false
  },
  {
    id: "sap-basis",
    name: "SAP Basis",
    description: "Contains list of SAP Basis candidates",
    count: 0,
    isDefault: false
  },
  {
    id: "cloud-networking",
    name: "Cloud Networking",
    description: "Contains the list of candidates with Cloud Networking Experience.",
    count: 0,
    isDefault: false
  },
  {
    id: "linux-admin",
    name: "Linux Administrator",
    description: "Contains the list of candidates with Linux admin Experience. (Suse/Redhat)",
    count: 0,
    isDefault: false
  },
  {
    id: "azure-cloud",
    name: "Azure Cloud Engineer",
    description: "Contains the list of candidates with Azure Cloud Experience.",
    count: 0,
    isDefault: false
  },
  {
    id: "gcp-cloud",
    name: "GCP Cloud Engineer",
    description: "Contains the list of candidates with Google Cloud Experience.",
    count: 0,
    isDefault: false
  },
  {
    id: "aws-cloud",
    name: "AWS Cloud Engineer",
    description: "Contains the list of candidates with AWS Cloud Experience.",
    count: 0,
    isDefault: false
  },
  {
    id: "servicenow",
    name: "ServiceNow Developer",
    description: "Contains the list of candidates with ServiceNow Development Experience.",
    count: 2,
    isDefault: false
  }
];

export const FolderGrid: React.FC<FolderGridProps> = ({
  currentFolder,
  onFolderSelect,
  folders = defaultFolders,
  onEditFolder,
  onDeleteFolder,
  onCreateFolder
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {folders.map(folder => (
        <Card 
          key={folder.id} 
          className={`cursor-pointer hover:shadow-md transition-all border border-gray-100 ${
            currentFolder === folder.id ? "ring-1 ring-primary" : ""
          }`} 
          onClick={() => onFolderSelect(folder.id)}
        >
          <CardContent className="p-4 bg-white rounded-lg">
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center">
                <div 
                  className="w-6 h-6 rounded-full mr-2 flex items-center justify-center" 
                  style={{
                    backgroundColor: folder.color || "#3b82f6"
                  }}
                >
                  <FolderIcon className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">{folder.name}</h3>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`rounded-full hover:bg-gray-100 ${folder.isDefault ? "invisible" : ""}`}
                  >
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-gray-100 shadow-md">
                  <DropdownMenuItem 
                    onClick={e => {
                      e.stopPropagation();
                      onEditFolder?.(folder);
                    }}
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Edit Folder
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50" 
                    onClick={e => {
                      e.stopPropagation();
                      onDeleteFolder?.(folder);
                    }}
                  >
                    Delete Folder
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-gray-500 mb-4">{folder.description}</p>
            <div className="text-sm font-medium text-gray-700">{folder.count} Candidates</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
