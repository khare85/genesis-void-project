import { Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
const AIStatusIndicator = () => {
  return <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-sm text-primary rounded-full bg-transparent">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-white">AI active</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>AI services are running normally</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>;
};
export default AIStatusIndicator;