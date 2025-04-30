
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ApplicationTabContent from './ApplicationTabContent';

interface DashboardApplicationsListProps {
  activeApplications: any[];
  completedApplications: any[];
  isLoading: boolean;
  isDemoUser: boolean;
}

const DashboardApplicationsList: React.FC<DashboardApplicationsListProps> = ({
  activeApplications,
  completedApplications,
  isLoading,
  isDemoUser
}) => {
  return (
    <Card className="col-span-2">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium">Your Applications</h3>
          <Button variant="outline" size="sm" asChild>
            <Link to="/candidate/applications">View All</Link>
          </Button>
        </div>
        
        <ApplicationTabContent 
          activeApplications={activeApplications}
          completedApplications={completedApplications}
          isLoading={isLoading}
          isDemoUser={isDemoUser}
        />
      </div>
    </Card>
  );
};

export default DashboardApplicationsList;
