
import React, { useState, useRef } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

interface ImportCandidatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface CsvCandidate {
  name: string;
  email: string;
  phone?: string;
  position?: string;
  company?: string;
  status?: string;
}

export const ImportCandidatesDialog: React.FC<ImportCandidatesDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<CsvCandidate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const resetState = () => {
    setFile(null);
    setPreviewData([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    
    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
      setError("Please upload a valid CSV file");
      return;
    }

    setFile(selectedFile);
    parseCSV(selectedFile);
  };

  const parseCSV = (csvFile: File) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      
      // Extract header
      const header = lines[0].split(',').map(h => h.trim());
      
      // Validate required columns
      const requiredColumns = ['name', 'email'];
      const missingColumns = requiredColumns.filter(col => !header.map(h => h.toLowerCase()).includes(col.toLowerCase()));
      
      if (missingColumns.length > 0) {
        setError(`CSV is missing required columns: ${missingColumns.join(', ')}`);
        return;
      }

      // Parse candidates from rows
      const candidates: CsvCandidate[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',').map(v => v.trim());
        const candidate: CsvCandidate = {} as CsvCandidate;
        
        header.forEach((column, index) => {
          const col = column.toLowerCase();
          const value = values[index] || '';
          
          if (col === 'name') candidate.name = value;
          else if (col === 'email') candidate.email = value;
          else if (col === 'phone') candidate.phone = value;
          else if (col === 'position') candidate.position = value;
          else if (col === 'company') candidate.company = value;
          else if (col === 'status') candidate.status = value;
        });
        
        if (candidate.name && candidate.email) {
          candidates.push(candidate);
        }
      }
      
      if (candidates.length === 0) {
        setError("No valid candidates found in the CSV");
        return;
      }
      
      setPreviewData(candidates.slice(0, 5)); // Preview first 5
    };
    
    reader.onerror = () => {
      setError("Error reading the CSV file");
    };
    
    reader.readAsText(csvFile);
  };

  const handleImport = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        const header = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const nameIndex = header.indexOf('name');
        const emailIndex = header.indexOf('email');
        const phoneIndex = header.indexOf('phone');
        const positionIndex = header.indexOf('position');
        const companyIndex = header.indexOf('company');
        const statusIndex = header.indexOf('status');
        
        const candidates: CsvCandidate[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',').map(v => v.trim());
          
          if (values.length >= 2) {
            const candidate: CsvCandidate = {
              name: values[nameIndex] || '',
              email: values[emailIndex] || '',
              phone: phoneIndex >= 0 ? values[phoneIndex] : undefined,
              position: positionIndex >= 0 ? values[positionIndex] : undefined,
              company: companyIndex >= 0 ? values[companyIndex] : undefined,
              status: statusIndex >= 0 ? values[statusIndex] : undefined
            };
            
            if (candidate.name && candidate.email) {
              candidates.push(candidate);
            }
          }
        }
        
        if (candidates.length === 0) {
          throw new Error("No valid candidates found in the CSV");
        }
        
        // Process candidates in batches to avoid overloading
        const batchSize = 10;
        let successCount = 0;
        let failureCount = 0;
        
        for (let i = 0; i < candidates.length; i += batchSize) {
          const batch = candidates.slice(i, i + batchSize);
          
          for (const candidate of batch) {
            try {
              const [firstName, ...lastNameParts] = candidate.name.split(' ');
              const lastName = lastNameParts.join(' ');
              
              // Create candidate profile
              const { data: userData, error: userError } = await supabase.rpc('handle_new_candidate_signup', {
                email_param: candidate.email,
                first_name_param: firstName,
                last_name_param: lastName || '',
                phone_param: candidate.phone || ''
              });
              
              if (userError) throw userError;
              
              // Create application entry
              const { error: appError } = await supabase.from('applications').insert({
                candidate_id: userData,
                status: candidate.status || 'new',
                job_id: null,
                match_score: Math.floor(Math.random() * 100),
                created_at: new Date().toISOString()
              });
              
              if (appError) throw appError;
              
              successCount++;
            } catch (error) {
              console.error("Error importing candidate:", candidate.email, error);
              failureCount++;
            }
          }
        }
        
        toast({
          title: "Import completed",
          description: `Successfully imported ${successCount} candidates. ${failureCount > 0 ? `${failureCount} failed.` : ''}`,
          variant: failureCount > 0 ? "default" : "success",
        });
        
        resetState();
        onSuccess();
        onOpenChange(false);
      };
      
      reader.onerror = () => {
        throw new Error("Error reading the CSV file");
      };
      
      reader.readAsText(file);
      
    } catch (error: any) {
      console.error("Import error:", error);
      setError(error.message || "Failed to import candidates");
      toast({
        title: "Import failed",
        description: error.message || "Failed to import candidates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    resetState();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Candidates</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple candidates at once. 
            The CSV must have 'name' and 'email' columns, and can optionally include 'phone', 'position', 'company', and 'status' columns.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="flex-1"
              disabled={isUploading}
            />
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Browse
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {previewData.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Preview (First 5 candidates):</h3>
              <div className="bg-muted p-4 rounded-md overflow-auto max-h-[200px]">
                {previewData.map((candidate, index) => (
                  <Card key={index} className="p-3 mb-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-semibold">Name:</span> {candidate.name}
                      </div>
                      <div>
                        <span className="font-semibold">Email:</span> {candidate.email}
                      </div>
                      {candidate.phone && (
                        <div>
                          <span className="font-semibold">Phone:</span> {candidate.phone}
                        </div>
                      )}
                      {candidate.position && (
                        <div>
                          <span className="font-semibold">Position:</span> {candidate.position}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Total candidates to import: <span className="font-medium">{file ? 'Calculating...' : '0'}</span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!file || isUploading || previewData.length === 0}
            isLoading={isUploading}
          >
            {isUploading ? "Importing..." : "Import Candidates"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
