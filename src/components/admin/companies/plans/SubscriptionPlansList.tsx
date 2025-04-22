
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddPlanDialog } from "./AddPlanDialog";
import { SubscriptionPlan } from "@/types/subscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function SubscriptionPlansList() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [addPlanDialogOpen, setAddPlanDialogOpen] = useState(false);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price');

      if (error) throw error;
      setPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>Manage subscription plans available to companies</CardDescription>
        </div>
        <Button onClick={() => setAddPlanDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-6">Loading plans...</div>
        ) : plans.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No subscription plans found. Add your first plan using the button above.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden md:table-cell">Max Jobs</TableHead>
                  <TableHead className="hidden md:table-cell">Max Users</TableHead>
                  <TableHead className="hidden lg:table-cell">AI Credits</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{formatCurrency(plan.price)}</TableCell>
                    <TableCell className="hidden md:table-cell">{plan.max_jobs}</TableCell>
                    <TableCell className="hidden md:table-cell">{plan.max_users}</TableCell>
                    <TableCell className="hidden lg:table-cell">{plan.ai_credits}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {plan.is_active ? (
                          <Badge className="bg-green-500">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                        {plan.is_enterprise && (
                          <Badge variant="outline">Enterprise</Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <AddPlanDialog 
        open={addPlanDialogOpen}
        onOpenChange={setAddPlanDialogOpen}
        onPlanAdded={fetchPlans}
      />
    </Card>
  );
}
