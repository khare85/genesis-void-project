
import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Folder } from "@/components/recruiter/candidates/FolderGrid";

// Define TypeScript interface for candidate folders
interface CandidateFolder {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean | null;
  color: string | null;
  candidate_count: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface FolderManagementResult {
  folders: Folder[];
  loadingFolders: boolean;
  createFolder: (folderData: Omit<Folder, 'id' | 'count'>) => Promise<boolean>;
  updateFolder: (updatedFolder: Folder) => Promise<boolean>;
  deleteFolder: (folderToDelete: Folder) => Promise<boolean>;
  refreshFolders: () => void;
  defaultFolder: Folder | null;
}

export const useFolderManagement = (
  candidates: any[],
  refreshCandidates: () => void
): FolderManagementResult => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [foldersFetched, setFoldersFetched] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Refresh folders function
  const refreshFolders = () => {
    setFoldersFetched(false);
    setRefreshTrigger(prev => prev + 1);
  };

  // Fetch folders from Supabase
  useEffect(() => {
    const fetchFolders = async () => {
      // Only fetch folders once until explicitly refreshed
      if (foldersFetched) {
        return;
      }

      try {
        setLoadingFolders(true);
        const { data, error } = await supabase
          .from('candidate_folders')
          .select('*');

        if (error) throw error;

        if (data) {
          // Find the default folder if it exists
          const defaultFolder = data.find((folder: CandidateFolder) => folder.is_default === true);
          
          const foldersList: Folder[] = data.map((folder: CandidateFolder) => {
            // For the default folder, count all candidates without a folder
            let count = folder.candidate_count || 0;
            if (folder.is_default) {
              // Count candidates without a folder
              count = candidates.filter(c => !c.folderId).length;
            }
            
            return {
              id: folder.id,
              name: folder.name,
              description: folder.description || "",
              count: count,
              isDefault: folder.is_default || false,
              color: folder.color || "#3b82f6" // default blue
            };
          });
          
          setFolders(foldersList);
          setFoldersFetched(true);
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
  }, [candidates, foldersFetched, refreshTrigger]);

  // Update folder counts when candidates change
  useEffect(() => {
    if (!foldersFetched || candidates.length === 0) return;
    
    setFolders(prevFolders => 
      prevFolders.map(folder => {
        if (folder.isDefault) {
          // Update default folder count
          const unassignedCount = candidates.filter(c => !c.folderId).length;
          return { ...folder, count: unassignedCount };
        }
        // For other folders, count the candidates with this folderId
        const folderCount = candidates.filter(c => c.folderId === folder.id).length;
        return { ...folder, count: folderCount };
      })
    );
  }, [candidates, foldersFetched]);

  // Handle folder creation
  const createFolder = async (folderData: Omit<Folder, 'id' | 'count'>): Promise<boolean> => {
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
      
      // Force refetch folders to get updated data
      refreshFolders();
      return true;
    } catch (err) {
      console.error("Error creating folder:", err);
      toast({
        title: "Error creating folder",
        description: "Failed to create folder. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Handle folder editing
  const updateFolder = async (updatedFolder: Folder): Promise<boolean> => {
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
      
      toast({
        title: "Folder updated",
        description: `${updatedFolder.name} folder has been updated successfully.`,
      });
      
      // Force refetch folders to get updated data
      refreshFolders();
      return true;
    } catch (err) {
      console.error("Error updating folder:", err);
      toast({
        title: "Error updating folder",
        description: "Failed to update folder. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Handle folder deletion with moving candidates to default folder
  const deleteFolder = async (folderToDelete: Folder): Promise<boolean> => {
    try {
      // First, find the default folder to move candidates to
      const defaultFolder = folders.find(f => f.isDefault);
      
      if (!defaultFolder) {
        toast({
          title: "Error deleting folder",
          description: "Default folder not found. Please create a default folder first.",
          variant: "destructive"
        });
        return false;
      }
      
      // Move all candidates from the folder being deleted to the default folder
      const { error: moveError } = await supabase
        .from('applications')
        .update({ folder_id: defaultFolder.id })
        .eq('folder_id', folderToDelete.id);
      
      if (moveError) throw moveError;
      
      // Then delete the folder
      const { error } = await supabase
        .from('candidate_folders')
        .delete()
        .eq('id', folderToDelete.id);

      if (error) throw error;

      setFolders(prevFolders => 
        prevFolders.filter(folder => folder.id !== folderToDelete.id)
      );
      
      toast({
        title: "Folder deleted",
        description: `${folderToDelete.name} folder has been deleted and candidates moved to Default folder.`,
      });
      
      // Refresh candidates to update UI
      refreshCandidates();
      
      // Force refetch folders to get updated data
      refreshFolders();
      return true;
    } catch (err) {
      console.error("Error deleting folder:", err);
      toast({
        title: "Error deleting folder",
        description: "Failed to delete folder. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Find the default folder
  const defaultFolder = folders.find(f => f.isDefault) || null;

  return {
    folders,
    loadingFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    refreshFolders,
    defaultFolder
  };
};
