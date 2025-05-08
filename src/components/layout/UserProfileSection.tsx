
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UserProfileSectionProps {
  collapsed: boolean;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ collapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
  // Function to handle logout
  const handleLogout = () => {
    logout();
    // No need to navigate here as the logout function will now handle it
    toast.success('Logged out successfully');
  };
  
  return (
    <div className="px-3 pb-4 mt-auto">
      <div className={cn(
        "flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors",
        collapsed && "flex-col"
      )}>
        <Link to="/profile" className="flex-shrink-0">
          <Avatar className={cn("border bg-primary/10", collapsed ? "h-12 w-12" : "h-9 w-9")}>
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Link>
        
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <Link to="/profile" className="block">
              <p className="font-medium text-sm truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </Link>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          title="Logout"
          className={cn(
            "flex-shrink-0 h-8 w-8",
            collapsed && "mt-2"
          )}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserProfileSection;
