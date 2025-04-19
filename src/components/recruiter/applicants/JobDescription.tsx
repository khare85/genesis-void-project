
import { Link } from "react-router-dom";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JobDetails } from "@/hooks/recruiter/useJobApplicants";

interface JobDescriptionProps {
  job: JobDetails;
}

const JobDescription = ({ job }: JobDescriptionProps) => {
  return (
    <>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>All Applicants</CardTitle>
            <CardDescription>
              {job.title} - {job.department} - {job.location}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/recruiter/jobs/${job.id}/edit`}>Edit Job</Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Job Description</h3>
          <p className="text-muted-foreground">{job.description}</p>
        </div>
      </CardContent>
    </>
  );
};

export default JobDescription;
