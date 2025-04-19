
import { Link } from "react-router-dom";
import { ChevronLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import { JobDetails } from "@/hooks/recruiter/useJobApplicants";

interface JobHeaderProps {
  job: JobDetails;
}

const JobHeader = ({ job }: JobHeaderProps) => {
  return (
    <PageHeader
      title={`Applicants: ${job.title}`}
      description={`${job.applicants} applicants for this position`}
      icon={<Users className="h-6 w-6" />}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/recruiter/jobs">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Jobs
            </Link>
          </Button>
          <Button>
            Email All
          </Button>
        </div>
      }
    />
  );
};

export default JobHeader;
