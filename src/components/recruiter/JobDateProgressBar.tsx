
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { CalendarDays } from 'lucide-react';

interface JobDateProgressBarProps {
  publishedDate: string;
  closingDate?: string;
}

const JobDateProgressBar: React.FC<JobDateProgressBarProps> = ({ publishedDate, closingDate }) => {
  const calculateProgress = () => {
    if (!closingDate) return 100;
    
    const startDate = new Date(publishedDate).getTime();
    const endDate = new Date(closingDate).getTime();
    const currentDate = new Date().getTime();
    
    if (currentDate >= endDate) return 100;
    if (currentDate <= startDate) return 0;
    
    const totalDuration = endDate - startDate;
    const elapsedDuration = currentDate - startDate;
    
    return Math.floor((elapsedDuration / totalDuration) * 100);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const progress = calculateProgress();
  
  return (
    <div className="space-y-2 w-full max-w-[200px]">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarDays className="h-3.5 w-3.5" />
        <span>Job Timeline</span>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatDate(publishedDate)}</span>
        {closingDate && <span>{formatDate(closingDate)}</span>}
      </div>
    </div>
  );
};

export default JobDateProgressBar;
