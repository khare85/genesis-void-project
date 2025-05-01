
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, Filter, ChevronDown, ChevronLeft, ChevronRight, FolderPlus } from "lucide-react";
import { TalentPoolTable } from "@/components/recruiter/candidates/TalentPoolTable";
import { FolderGrid, Folder } from "@/components/recruiter/candidates/FolderGrid";
import { AIScreeningButton } from "@/components/recruiter/candidates/AIScreeningButton";
import { FolderManagementDialog } from "@/components/recruiter/candidates/FolderManagementDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCandidatesData } from "@/hooks/recruiter/useCandidatesData";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

const RecruiterCandidates: React.FC = () => {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>("default"); // Default folder selected initially
  const [showFilterSidebar, setShowFilterSidebar] = useState(true);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folders, setFolders] = useState<Folder[]>([
    {
      id: "default",
      name: "Default Folder",
      description: "Default folder contains the list of all the candidates from the organization, and cannot be deleted",
      count: 32982,
      isDefault: true
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
  ]);
  
  const { 
    candidates,
    isLoading,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    totalCount
  } = useCandidatesData();

  // Handle folder selection to display candidates in that folder
  const handleFolderSelect = (folderId: string | null) => {
    setCurrentFolder(folderId);
    console.log(`Selected folder: ${folderId}`);
  };
  
  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedCandidates(checked ? candidates.map(c => c.id) : []);
  };

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

  const handleDeleteFolder = (folderToDelete: Folder) => {
    setFolders(prevFolders => 
      prevFolders.filter(folder => folder.id !== folderToDelete.id)
    );
    
    // If the deleted folder was selected, switch to default folder
    if (currentFolder === folderToDelete.id) {
      setCurrentFolder("default");
    }
    
    toast({
      title: "Folder deleted",
      description: `${folderToDelete.name} folder has been deleted successfully.`,
      variant: "destructive",
    });
  };

  const handleMoveToFolder = (candidateId: string, folderId: string) => {
    // This would typically involve an API call to update the candidate's folder
    console.log(`Moving candidate ${candidateId} to folder ${folderId}`);
    
    // For now, we'll just update the folder counts to simulate the change
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

  const openCreateFolderDialog = () => {
    setEditingFolder(null);
    setCreateFolderDialogOpen(true);
  };

  const openEditFolderDialog = (folder: Folder) => {
    setEditingFolder(folder);
    setCreateFolderDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Pool"
        description="Manage and review potential candidates"
        icon={<Users className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <AIScreeningButton
              selectedCount={selectedCandidates.length}
              onScreen={() => {
                console.log("Starting AI screening for:", selectedCandidates);
                // Implement AI screening logic here
              }}
            />
            <Button asChild>
              <Link to="/recruiter/candidates/add">Add Candidates</Link>
            </Button>
            <Button variant="outline" className="ml-2" onClick={() => setShowFilterSidebar(!showFilterSidebar)}>
              <Filter className="h-4 w-4 mr-2" />
              {showFilterSidebar ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        }
      />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Folders</h2>
        <Button onClick={openCreateFolderDialog}>
          <FolderPlus className="h-4 w-4 mr-2" />
          Create New Folder
        </Button>
      </div>
      
      <div className="mb-6">
        <FolderGrid 
          currentFolder={currentFolder}
          onFolderSelect={handleFolderSelect}
          folders={folders}
          onEditFolder={openEditFolderDialog}
          onDeleteFolder={handleDeleteFolder}
        />
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {showFilterSidebar && (
          <div className="col-span-3">
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center space-between">
                <CardTitle className="text-base">Filter</CardTitle>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setShowFilterSidebar(false)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
                      Keywords
                      <ChevronDown className="h-4 w-4" />
                    </h3>
                    <Input 
                      placeholder="Search keywords in profile" 
                      className="w-full" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
                      Notice Period
                      <ChevronDown className="h-4 w-4" />
                    </h3>
                    <div className="flex items-center space-x-2">
                      <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
                        <option>Min</option>
                        {[7, 15, 30, 60, 90].map(days => (
                          <option key={days} value={days}>{days} days</option>
                        ))}
                      </select>
                      <span>-</span>
                      <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
                        <option>Max</option>
                        {[15, 30, 60, 90, 180].map(days => (
                          <option key={days} value={days}>{days} days</option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-2 flex items-center">
                      <input type="checkbox" id="noNotice" className="mr-2" />
                      <label htmlFor="noNotice" className="text-sm">Include candidates with no notice period</label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
                      Current Location
                      <ChevronDown className="h-4 w-4" />
                    </h3>
                    <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
                      <option value="">Select Location</option>
                      <option value="remote">Remote</option>
                      <option value="us">United States</option>
                      <option value="europe">Europe</option>
                      <option value="asia">Asia</option>
                    </select>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
                      Experience
                      <ChevronDown className="h-4 w-4" />
                    </h3>
                    <div className="flex items-center space-x-2">
                      <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
                        <option>Min</option>
                        {[0, 1, 2, 3, 5, 7].map(years => (
                          <option key={years} value={years}>{years} years</option>
                        ))}
                      </select>
                      <span>-</span>
                      <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
                        <option>Max</option>
                        {[1, 3, 5, 8, 10, 15].map(years => (
                          <option key={years} value={years}>{years} years</option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-2 flex items-center">
                      <input type="checkbox" id="includeFreshers" className="mr-2" />
                      <label htmlFor="includeFreshers" className="text-sm">Include freshers</label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
                      Created Date Range
                      <ChevronDown className="h-4 w-4" />
                    </h3>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
                      Education
                      <ChevronDown className="h-4 w-4" />
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className={`${showFilterSidebar ? 'col-span-9' : 'col-span-12'}`}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>All Candidates ({totalCount})</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/recruiter/candidates/export">Export</Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search candidates..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Status: {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuCheckboxItem 
                        checked={filter === "all"} 
                        onCheckedChange={() => setFilter("all")}
                      >
                        All
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem 
                        checked={filter === "new"} 
                        onCheckedChange={() => setFilter("new")}
                      >
                        New
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem 
                        checked={filter === "pending"} 
                        onCheckedChange={() => setFilter("pending")}
                      >
                        Pending
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem 
                        checked={filter === "approved"} 
                        onCheckedChange={() => setFilter("approved")}
                      >
                        Approved
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem 
                        checked={filter === "rejected"} 
                        onCheckedChange={() => setFilter("rejected")}
                      >
                        Rejected
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 text-sm">
                <div>1-20 of {totalCount} Candidates</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : (
                <TalentPoolTable
                  candidates={candidates}
                  selectedCandidates={selectedCandidates}
                  onSelectCandidate={handleSelectCandidate}
                  onSelectAll={handleSelectAll}
                  currentFolder={currentFolder}
                  folders={folders}
                  onMoveToFolder={handleMoveToFolder}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

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
