
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Maximize, Share, Mail, Phone, MapPin, FileCheck, Globe } from 'lucide-react';
import { CompleteCandidateProfile } from '@/hooks/recruiter/useCompleteCandidateProfile';
import { toast } from 'sonner';

interface ProfileHeaderProps {
  profile: CompleteCandidateProfile;
  currentApplication: any;
  onShareProfile: () => void;
  onVideoClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  profile, 
  currentApplication, 
  onShareProfile, 
  onVideoClick 
}) => {
  const [showVideo, setShowVideo] = useState(false);

  const handleShareProfile = async () => {
    try {
      const shareableUrl = `${window.location.origin}/candidate-profile/${profile.id}`;
      await navigator.clipboard.writeText(shareableUrl);
      toast.success('Profile link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing profile:', error);
      toast.error('Failed to share profile');
    }
  };

  return (
    <Card className="shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 relative"
              onMouseEnter={() => setShowVideo(true)}
              onMouseLeave={() => setShowVideo(false)}
          >
            <Avatar className={`h-24 w-24 border-2 border-gray-200 shadow-sm transition-opacity duration-300 ${showVideo && currentApplication?.videoIntro ? 'opacity-0' : 'opacity-100'}`}>
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            {showVideo && currentApplication?.videoIntro && (
              <div className="absolute inset-0 z-10">
                <video 
                  src={currentApplication.videoIntro} 
                  className="h-24 w-24 object-cover rounded-full cursor-pointer border-2 border-blue-500"
                  autoPlay 
                  muted 
                  onClick={(e) => {
                    e.stopPropagation();
                    onVideoClick();
                  }}
                />
                <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 shadow-md">
                  <Maximize className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-grow space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
                <p className="text-gray-600 font-medium">{profile.title}</p>
              </div>
              
              {currentApplication && (
                <div className="flex items-center gap-2">
                  <Badge variant={
                    currentApplication.status === 'approved' ? 'default' : 
                    currentApplication.status === 'rejected' ? 'destructive' : 
                    'secondary'
                  } className="capitalize text-xs px-3 py-1 rounded-full">
                    {currentApplication.status === 'rejected' ? 'Not Selected' : currentApplication.status}
                  </Badge>
                  
                  {currentApplication.matchScore > 0 && (
                    <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 rounded-full">
                      Match: {currentApplication.matchScore}%
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 pt-1">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.location}</span>
              </div>
              {currentApplication && (
                <div className="flex items-center gap-2 text-gray-700">
                  <FileCheck className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Applied: {currentApplication.dateApplied}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {Object.entries(profile.links).map(([key, value]) => {
                if (!value) return null;
                return (
                  <Button 
                    key={key} 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs bg-gray-50 hover:bg-gray-100"
                    onClick={() => window.open(value, '_blank')}
                  >
                    <Globe className="mr-1 h-3 w-3" />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
