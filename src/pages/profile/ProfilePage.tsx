
import React from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PageHeader from '@/components/shared/PageHeader';
import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, Building, BriefcaseBusiness } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
  const handleLogout = () => {
    logout();
    // No need to navigate here as the logout function will now handle it
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Your Profile"
        description="View and manage your account information"
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal and account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-24 w-24 border-2 border-muted">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="space-y-4 flex-1">
                <div>
                  <h3 className="font-medium text-lg">{user.name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.companyName && (
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Building className="h-4 w-4" />
                      <span>{user.companyName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <BriefcaseBusiness className="h-4 w-4 text-primary" />
                    <span className="capitalize">{user.role?.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Account Status</h4>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    <span>Active</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="justify-between flex-wrap gap-y-2">
            <div className="text-sm text-muted-foreground">
              Member since {new Date().toLocaleDateString()}
            </div>
            <Button variant="outline" onClick={() => navigate('/edit-profile')}>
              Edit Profile
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Security</h4>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/change-password')}>
                Change Password
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Preferences</h4>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/notifications')}>
                Notification Settings
              </Button>
            </div>
          </CardContent>
          <Separator />
          <CardFooter>
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
