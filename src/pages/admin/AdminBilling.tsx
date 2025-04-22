
import React from 'react';
import { Building2 } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { SubscriptionPlansList } from '@/components/admin/companies/plans/SubscriptionPlansList';

const AdminBilling = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Subscriptions"
        description="Manage subscription plans and billing settings"
        icon={<Building2 className="h-6 w-6" />}
      />
      
      <SubscriptionPlansList />
    </div>
  );
};

export default AdminBilling;
