
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Briefcase, ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import JobForm from '@/components/recruiter/jobs/JobForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GenerateDetailsButton } from '@/components/recruiter/jobs/components/GenerateDetailsButton';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { FormattedJobData } from '@/components/recruiter/jobs/types';
import { Skeleton } from '@/components/ui/skeleton';

const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [jobData, setJobData] = useState<FormattedJobData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [showMissingFieldsAlert, setShowMissingFieldsAlert] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);

  // Fetch job data
  useEffect(() => {
    const fetchJobData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        if (data) {
          setJobData(data);
        }
      } catch (err) {
        console.error('Error fetching job data:', err);
        toast({
          title: "Error",
          description: "Failed to load job data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobData();
  }, [id]);

  // Handle job update submission
  const handleSubmit = async (data: FormattedJobData) => {
    try {
      if (!id) return;
      
      const { error } = await supabase
        .from('jobs')
        .update({
          title: data.title,
          department: data.department,
          company: data.company,
          location: data.location,
          type: data.type,
          status: data.status,
          salary_range: data.salary_range,
          description: data.description,
          category: data.category,
          level: data.level,
          responsibilities: data.responsibilities,
          requirements: data.requirements,
          benefits: data.benefits,
          featured: data.featured,
          closingdate: data.closingDate,
          skills: data.skills,
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Job "${data.title}" has been updated`
      });
      
      navigate('/recruiter/jobs');
    } catch (err) {
      console.error('Error updating job:', err);
      toast({
        title: "Error",
        description: "Failed to update job",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="bg-white border rounded-lg p-6 space-y-6">
          <Skeleton className="h-10 w-1/2 mb-4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="flex justify-end gap-4 mt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Job"
        description="Update job details and requirements"
        icon={<Briefcase className="h-6 w-6" />}
        actions={
          <>
            <Button 
              variant="outline"
              onClick={() => navigate('/recruiter/jobs')}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
            <GenerateDetailsButton
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              setMissingFields={setMissingFields}
              setShowMissingFieldsAlert={setShowMissingFieldsAlert}
              setGeneratedData={setGeneratedData}
            />
          </>
        }
      />
      
      {showMissingFieldsAlert && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            Please fill in the following required fields before generating job details:
            <ul className="list-disc pl-5 mt-2">
              {missingFields.map((field, index) => (
                <li key={index}>{field}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {jobData && (
        <div className="bg-white border rounded-lg p-6">
          <JobForm 
            id="job-edit-form"
            initialData={jobData}
            onSubmit={handleSubmit} 
            onGenerateDetails={() => {}}
            isGenerating={isGenerating}
            isEditing={true}
            generatedData={generatedData}
          />
        </div>
      )}
    </div>
  );
};

export default EditJob;
