
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActiveApplicationsList from './ActiveApplicationsList';
import CompletedApplicationsList from './CompletedApplicationsList';

interface ApplicationTabContentProps {
  activeApplications: any[];
  completedApplications: any[];
  isLoading: boolean;
  isDemoUser: boolean;
}

const ApplicationTabContent: React.FC<ApplicationTabContentProps> = ({
  activeApplications,
  completedApplications,
  isLoading,
  isDemoUser
}) => {
  return (
    <Tabs defaultValue="active">
      <TabsList className="mb-4">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      <TabsContent value="active" className="p-0 border-0">
        <ActiveApplicationsList 
          applications={activeApplications} 
          isLoading={isLoading} 
          isDemoUser={isDemoUser} 
        />
      </TabsContent>
      <TabsContent value="completed" className="p-0 border-0">
        <CompletedApplicationsList 
          applications={completedApplications} 
          isLoading={isLoading} 
          isDemoUser={isDemoUser} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default ApplicationTabContent;
