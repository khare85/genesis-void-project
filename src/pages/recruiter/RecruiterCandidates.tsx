import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import { Users, Filter } from "lucide-react";
import { FolderGrid, Folder } from "@/components/recruiter/candidates/FolderGrid";
import { FolderManagementDialog } from "@/components/recruiter/candidates/FolderManagementDialog";
import { useCandidatesData } from "@/hooks/recruiter/useCandidatesData";
import { toast } from "@/hooks/use-toast";
import { FolderHeader } from "@/components/recruiter/candidates/FolderHeader";
import { CandidateView } from "@/components/recruiter/candidates/CandidateView";

const RecruiterCandidates: React.FC = () => {
  // State for candidates selection and folder management
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [showFilterSidebar, setShowFilterSidebar] = useState(true);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  
  // Get candidates data from hook
  const { 
    candidates,
    isLoading,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    totalCount
  } = useCandidatesData();

  // Initialize folders
  const [folders, setFolders] = useState<Folder[]>([
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
      isDefault: false,
      color: "#ef4444" // red
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
  ]);
  
  // Handle folder selection
  const handleFolderSelect = (folderId: string | null) => {
    setCurrentFolder(folderId);
    console.log(`Selected folder: ${folderId}`);
    
    // If a folder is selected, show the filter sidebar
    if (folderId) {
      setShowFilterSidebar(true);
    }
  };
  
  // Handle candidate selection
  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  // Handle select all candidates
  const handleSelectAll = (checked: boolean) => {
    setSelectedCandidates(checked ? candidates.map(c => c.id) : []);
  };

  // Handle folder creation
  const handleCreateFolder = (folderData: Omit<Folder, 'id' | 'count'>) => {
    const newFolder: Folder = {
      ...folderData,
      id: `folder-${Date.now()}`,
      count: 0
    };
    
    setFolders(prevFolders => [...prevFolders, newFolder]);
    toast({
      title: "Folder created",
      description: `${folderData.name} folder has been created successfully.`,
    });
  };

  // Handle folder editing
  const handleEditFolder = (updatedFolder: Folder) => {
    setFolders(prevFolders => 
      prevFolders.map(folder => 
        folder.id === updatedFolder.id ? updatedFolder : folder
      )
    );
    setEditingFolder(null);
    toast({
      title: "Folder updated",
      description: `${updatedFolder.name} folder has been updated successfully.`,
    });
  };

  // Handle folder deletion
  const handleDeleteFolder = (folderToDelete: Folder) => {
    setFolders(prevFolders => 
      prevFolders.filter(folder => folder.id !== folderToDelete.id)
    );
    
    // If the deleted folder was selected, clear current folder
    if (currentFolder === folderToDelete.id) {
      setCurrentFolder(null);
    }
    
    toast({
      title: "Folder deleted",
      description: `${folderToDelete.name} folder has been deleted successfully.`,
      variant: "destructive",
    });
  };

  // Handle moving candidate to folder
  const handleMoveToFolder = (candidateId: string, folderId: string) => {
    console.log(`Moving candidate ${candidateId} to folder ${folderId}`);
    
    // Update folder counts
    setFolders(prevFolders => 
      prevFolders.map(folder => {
        if (folder.id === folderId) {
          return { ...folder, count: folder.count + 1 };
        }
        if (folder.id === currentFolder && folder.id !== folderId) {
          return { ...folder, count: Math.max(0, folder.count - 1) };
        }
        return folder;
      })
    );
  };

  // Open create folder dialog
  const openCreateFolderDialog = () => {
    setEditingFolder(null);
    setCreateFolderDialogOpen(true);
  };

  // Open edit folder dialog
  const openEditFolderDialog = (folder: Folder) => {
    setEditingFolder(folder);
    setCreateFolderDialogOpen(true);
  };

  // Go back to folders view
  const backToFolders = () => {
    setCurrentFolder(null);
    setSelectedCandidates([]);
  };

  // Determine if we're in folder view or candidate view
  const showFolderView = !currentFolder;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Pool"
        description="Manage and review potential candidates"
        icon={<Users className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/recruiter/candidates/add">Add Candidates</Link>
            </Button>
          </div>
        }
      />
      
      <FolderHeader 
        showFolderView={showFolderView}
        currentFolder={currentFolder}
        folders={folders}
        onCreateFolder={openCreateFolderDialog}
        onBackToFolders={backToFolders}
      />
      
      {showFolderView ? (
        <div className="mb-6">
          <FolderGrid 
            currentFolder={currentFolder}
            onFolderSelect={handleFolderSelect}
            folders={folders}
            onEditFolder={openEditFolderDialog}
            onDeleteFolder={handleDeleteFolder}
          />
        </div>
      ) : (
        <CandidateView 
          currentFolder={currentFolder}
          folders={folders}
          candidates={candidates}
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
          totalCount={totalCount}
          selectedCandidates={selectedCandidates}
          onSelectCandidate={handleSelectCandidate}
          onSelectAll={handleSelectAll}
          onMoveToFolder={handleMoveToFolder}
          showFilterSidebar={showFilterSidebar}
          setShowFilterSidebar={setShowFilterSidebar}
        />
      )}

      <FolderManagementDialog
        open={createFolderDialogOpen}
        onOpenChange={setCreateFolderDialogOpen}
        onCreateFolder={handleCreateFolder}
        editingFolder={editingFolder}
        onEditFolder={handleEditFolder}
      />
    </div>
  );
};

export default RecruiterCandidates;
