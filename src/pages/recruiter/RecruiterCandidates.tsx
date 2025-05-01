
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import { Users } from "lucide-react";
import { FolderGrid, Folder } from "@/components/recruiter/candidates/FolderGrid";
import { FolderManagementDialog } from "@/components/recruiter/candidates/FolderManagementDialog";
import { useCandidatesData } from "@/hooks/recruiter/useCandidatesData";
import { toast } from "@/hooks/use-toast";
import { FolderHeader } from "@/components/recruiter/candidates/FolderHeader";
import { CandidateView } from "@/components/recruiter/candidates/CandidateView";
import { supabase } from '@/integrations/supabase/client';

const RecruiterCandidates: React.FC = () => {
  // State for candidates selection and folder management
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [showFilterSidebar, setShowFilterSidebar] = useState(true);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(true);
  
  // Get candidates data from hook
  const { 
    candidates,
    isLoading,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    totalCount,
    updateCandidateFolder,
    refreshCandidates
  } = useCandidatesData();

  // Fetch folders from Supabase
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoadingFolders(true);
        const { data, error } = await supabase
          .from('candidate_folders')
          .select('*');

        if (error) throw error;

        if (data) {
          const foldersList: Folder[] = data.map(folder => ({
            id: folder.id,
            name: folder.name,
            description: folder.description || "",
            count: folder.candidate_count || 0,
            isDefault: folder.is_default || false,
            color: folder.color || "#3b82f6" // default blue
          }));
          
          setFolders(foldersList);
        }
      } catch (err) {
        console.error("Error fetching folders:", err);
        toast({
          title: "Error loading folders",
          description: "Failed to load folder data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoadingFolders(false);
      }
    };

    fetchFolders();
  }, []);
  
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
  const handleCreateFolder = async (folderData: Omit<Folder, 'id' | 'count'>) => {
    try {
      const { data, error } = await supabase
        .from('candidate_folders')
        .insert({
          name: folderData.name,
          description: folderData.description,
          is_default: folderData.isDefault || false,
          color: folderData.color || "#3b82f6"
        })
        .select('id')
        .single();

      if (error) throw error;

      const newFolder: Folder = {
        ...folderData,
        id: data.id,
        count: 0
      };
      
      setFolders(prevFolders => [...prevFolders, newFolder]);
      toast({
        title: "Folder created",
        description: `${folderData.name} folder has been created successfully.`,
      });
    } catch (err) {
      console.error("Error creating folder:", err);
      toast({
        title: "Error creating folder",
        description: "Failed to create folder. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle folder editing
  const handleEditFolder = async (updatedFolder: Folder) => {
    try {
      const { error } = await supabase
        .from('candidate_folders')
        .update({
          name: updatedFolder.name,
          description: updatedFolder.description,
          is_default: updatedFolder.isDefault,
          color: updatedFolder.color
        })
        .eq('id', updatedFolder.id);

      if (error) throw error;

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
    } catch (err) {
      console.error("Error updating folder:", err);
      toast({
        title: "Error updating folder",
        description: "Failed to update folder. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle folder deletion
  const handleDeleteFolder = async (folderToDelete: Folder) => {
    try {
      const { error } = await supabase
        .from('candidate_folders')
        .delete()
        .eq('id', folderToDelete.id);

      if (error) throw error;

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
      });
    } catch (err) {
      console.error("Error deleting folder:", err);
      toast({
        title: "Error deleting folder",
        description: "Failed to delete folder. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle moving candidate to folder
  const handleMoveToFolder = async (candidateId: string, folderId: string) => {
    console.log(`Moving candidate ${candidateId} to folder ${folderId}`);
    
    const success = await updateCandidateFolder(candidateId, folderId);
    
    if (success) {
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
      
      // Refresh candidates to update UI
      refreshCandidates();
    }
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
          {loadingFolders ? (
            <div className="flex justify-center p-8">
              <div className="animate-pulse">Loading folders...</div>
            </div>
          ) : (
            <FolderGrid 
              currentFolder={currentFolder}
              onFolderSelect={handleFolderSelect}
              folders={folders}
              onEditFolder={openEditFolderDialog}
              onDeleteFolder={handleDeleteFolder}
            />
          )}
        </div>
      ) : (
        <CandidateView 
          currentFolder={currentFolder}
          folders={folders}
          candidates={candidates.filter(c => 
            currentFolder === 'default' 
              ? !c.folderId 
              : c.folderId === currentFolder
          )}
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
          totalCount={candidates.filter(c => 
            currentFolder === 'default' 
              ? !c.folderId 
              : c.folderId === currentFolder
          ).length}
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
