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
  return <Tabs defaultValue="active">
      <TabsList className="mb-6 bg-gray-50 p-1 border border-gray-100 rounded-none">
        <TabsTrigger value="active" className="bg-white rounded-none">Active</TabsTrigger>
        <TabsTrigger value="completed" className="bg-white rounded-none">Completed</TabsTrigger>
      </TabsList>
      <TabsContent value="active" className="p-0 border-0">
        <ActiveApplicationsList applications={activeApplications} isLoading={isLoading} isDemoUser={isDemoUser} />
      </TabsContent>
      <TabsContent value="completed" className="p-0 border-0">
        <CompletedApplicationsList applications={completedApplications} isLoading={isLoading} isDemoUser={isDemoUser} />
      </TabsContent>
    </Tabs>;
};
export default ApplicationTabContent;