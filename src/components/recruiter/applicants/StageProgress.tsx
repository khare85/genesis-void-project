
import { Progress } from "@/components/ui/progress";

interface StageProgressProps {
  stage: number;
}

const StageProgress: React.FC<StageProgressProps> = ({ stage }) => {
  const stages = ["Applied", "Screened", "Interview", "Decision"];
  const progress = (stage / (stages.length - 1)) * 100;
  
  return (
    <div className="w-full">
      <Progress value={progress} className="h-2 mb-1" />
      <div className="flex justify-between text-xs text-muted-foreground">
        {stages.map((stageName, index) => (
          <div 
            key={stageName} 
            className={`${index <= stage ? "text-primary font-medium" : ""}`}
          >
            {stageName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StageProgress;
