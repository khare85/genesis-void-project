
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ProfileCompletionItem {
  name: string;
  completed: boolean;
  path: string;
  tabId?: string;
}

interface ProfileCompletionDialogProps {
  triggerButton?: React.ReactNode;
  completedItems: ProfileCompletionItem[];
}

const ProfileCompletionDialog: React.FC<ProfileCompletionDialogProps> = ({ 
  triggerButton,
  completedItems
}) => {
  const { toast } = useToast();
  const completionPercentage = Math.round(
    (completedItems.filter(item => item.completed).length / completedItems.length) * 100
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" className="w-full">
            Complete Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Add missing information to increase your profile strength and job match rate
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          
          <div className="mt-6 space-y-3">
            {completedItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={item.completed ? "line-through text-muted-foreground" : ""}>
                    {item.name}
                  </span>
                </div>
                {!item.completed && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild
                  >
                    <Link 
                      to={item.path}
                      onClick={() => {
                        if (item.tabId) {
                          localStorage.setItem('selectedProfileTab', item.tabId);
                        }
                        toast({
                          title: "Navigating to " + item.name,
                          description: "Complete this section to improve your profile"
                        });
                      }}
                    >
                      Complete
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Video className="mr-2 h-4 w-4" />
            Video introductions increase interview chances by 32%
          </div>
          <Button asChild>
            <Link to="/candidate/profile">View Full Profile</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCompletionDialog;
