
import { useAuth } from '@/lib/auth';
import { Bell, Settings, LogOut, User, CreditCard, HelpCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import AIStatusIndicator from '../shared/AIStatusIndicator';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="flex items-center justify-end gap-4 md:gap-6 lg:gap-8 my-0 mx-[18px]">
      <AIStatusIndicator />
      
      <Button variant="ghost" size="icon" className="relative text-slate-500 hover:bg-slate-100 rounded-full h-9 w-9">
        <Bell className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary"></span>
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-slate-200 hover:border-primary transition-colors">
            <Avatar className="h-full w-full">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-64 bg-white rounded-xl shadow-xl" align="end" forceMount>
          <DropdownMenuLabel className="p-4 border-b border-slate-100">
            <div className="flex flex-col space-y-1">
              <p className="text-base font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              {user.companyName && <p className="text-xs text-muted-foreground">{user.companyName}</p>}
              <span className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-100">
                {user.role?.replace('_', ' ')}
              </span>
            </div>
          </DropdownMenuLabel>
          
          <div className="p-2">
            <DropdownMenuItem 
              onClick={() => navigate('/profile')} 
              className="rounded-md cursor-pointer flex items-center gap-2 py-2 px-2 hover:bg-slate-50"
            >
              <User className="h-4 w-4 text-slate-500" />
              <span>Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="rounded-md cursor-pointer flex items-center gap-2 py-2 px-2 hover:bg-slate-50"
            >
              <Settings className="h-4 w-4 text-slate-500" />
              <span>Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="rounded-md cursor-pointer flex items-center gap-2 py-2 px-2 hover:bg-slate-50"
            >
              <CreditCard className="h-4 w-4 text-slate-500" />
              <span>Billing</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="rounded-md cursor-pointer flex items-center gap-2 py-2 px-2 hover:bg-slate-50"
            >
              <HelpCircle className="h-4 w-4 text-slate-500" />
              <span>Help & Support</span>
            </DropdownMenuItem>
          </div>
          
          <DropdownMenuSeparator className="my-1" />
          
          <div className="p-2">
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="rounded-md cursor-pointer flex items-center gap-2 py-2 px-2 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
