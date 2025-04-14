
import React, { useState } from 'react';
import PageHeader from "@/components/shared/PageHeader";
import { CreditCard, Download, Filter, Plus, TrendingUp, TrendingDown, MoreHorizontal, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AIGenerated from "@/components/shared/AIGenerated";

// Mock subscription data
const mockSubscriptions = [
  {
    id: 1,
    company: "TechnovateX",
    plan: "Enterprise",
    status: "active",
    amount: 1299,
    renewalDate: "2025-08-12",
    paymentMethod: "Credit Card",
    aiCredits: 1500,
    startDate: "2024-08-12"
  },
  {
    id: 2,
    company: "Global Finance Group",
    plan: "Enterprise",
    status: "active",
    amount: 1299,
    renewalDate: "2025-07-19",
    paymentMethod: "Credit Card",
    aiCredits: 3000,
    startDate: "2024-01-19"
  },
  {
    id: 3,
    company: "Healthcare Inc",
    plan: "Business",
    status: "active",
    amount: 599,
    renewalDate: "2025-04-30",
    paymentMethod: "ACH",
    aiCredits: 800,
    startDate: "2024-04-30"
  },
  {
    id: 4,
    company: "Education Plus",
    plan: "Business",
    status: "past_due",
    amount: 599,
    renewalDate: "2025-04-15",
    paymentMethod: "Credit Card",
    aiCredits: 0,
    startDate: "2024-04-15"
  },
  {
    id: 5,
    company: "Retail Now",
    plan: "Professional",
    status: "active",
    amount: 299,
    renewalDate: "2025-05-22",
    paymentMethod: "Credit Card", 
    aiCredits: 200,
    startDate: "2024-05-22"
  },
  {
    id: 6,
    company: "Legal Experts LLC",
    plan: "Business",
    status: "active",
    amount: 599,
    renewalDate: "2025-06-10",
    paymentMethod: "ACH",
    aiCredits: 750,
    startDate: "2024-06-10"
  },
  {
    id: 7,
    company: "Tech Innovators",
    plan: "Professional",
    status: "cancelled",
    amount: 299,
    renewalDate: "2025-05-05",
    paymentMethod: "Credit Card",
    aiCredits: 0,
    startDate: "2024-05-05"
  }
];

// Mock payment history data
const mockPayments = [
  {
    id: 'INV-2025-0042',
    company: 'TechnovateX',
    date: '2025-04-01',
    amount: 1299,
    status: 'paid',
    type: 'subscription'
  },
  {
    id: 'INV-2025-0041',
    company: 'Global Finance Group',
    date: '2025-04-01',
    amount: 1299,
    status: 'paid',
    type: 'subscription'
  },
  {
    id: 'INV-2025-0040',
    company: 'Healthcare Inc',
    date: '2025-03-30',
    amount: 599,
    status: 'paid',
    type: 'subscription'
  },
  {
    id: 'INV-2025-0039',
    company: 'TechnovateX',
    date: '2025-03-25',
    amount: 500,
    status: 'paid',
    type: 'credits'
  },
  {
    id: 'INV-2025-0038',
    company: 'Education Plus',
    date: '2025-03-15',
    amount: 599,
    status: 'failed',
    type: 'subscription'
  },
  {
    id: 'INV-2025-0037',
    company: 'Retail Now',
    date: '2025-03-10',
    amount: 299,
    status: 'paid',
    type: 'subscription'
  },
  {
    id: 'INV-2025-0036',
    company: 'Legal Experts LLC',
    date: '2025-03-05',
    amount: 599,
    status: 'paid',
    type: 'subscription'
  },
  {
    id: 'INV-2025-0035',
    company: 'Global Finance Group',
    date: '2025-03-01',
    amount: 1000,
    status: 'paid',
    type: 'credits'
  }
];

const AdminBilling = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Filter subscriptions based on search query and filters
  const filteredSubscriptions = mockSubscriptions.filter(sub => {
    const matchesSearch = !searchQuery || 
      sub.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPlan = !planFilter || sub.plan === planFilter;
    const matchesStatus = !statusFilter || sub.status === statusFilter;
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Format amount to currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get status badge component based on status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'past_due':
        return <Badge variant="destructive">Past Due</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Handle plan filter change
  const handlePlanFilterChange = (plan: string | null) => {
    setPlanFilter(plan === planFilter ? null : plan);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (status: string | null) => {
    setStatusFilter(status === statusFilter ? null : status);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions & Billing"
        description="Manage subscriptions and payment info across the platform"
        icon={<CreditCard className="h-6 w-6" />}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add Plan
            </Button>
          </>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total MRR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,293</div>
            <div className="flex items-center text-sm text-ats-accent-green">
              <TrendingUp className="h-3 w-3 mr-1" />
              +6.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <div className="flex items-center text-sm text-ats-accent-green">
              <TrendingUp className="h-3 w-3 mr-1" />
              +1 from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Credits Purchased
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6,250</div>
            <div className="flex items-center text-sm text-ats-accent-green">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.4% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Churn Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1%</div>
            <div className="flex items-center text-sm text-ats-accent-red">
              <TrendingDown className="h-3 w-3 mr-1" />
              +0.3% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="subscriptions">
            <TabsList className="mb-4">
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="payments">Payment History</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="subscriptions" className="p-0 border-0">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex-1 min-w-[280px]">
                    <Input
                      placeholder="Search by company name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-md"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <Filter className="h-4 w-4" />
                          Plan {planFilter && '(1)'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handlePlanFilterChange('Enterprise')}
                          className={planFilter === 'Enterprise' ? 'bg-muted' : ''}
                        >
                          Enterprise
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handlePlanFilterChange('Business')}
                          className={planFilter === 'Business' ? 'bg-muted' : ''}
                        >
                          Business
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handlePlanFilterChange('Professional')}
                          className={planFilter === 'Professional' ? 'bg-muted' : ''}
                        >
                          Professional
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <Filter className="h-4 w-4" />
                          Status {statusFilter && '(1)'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleStatusFilterChange('active')}
                          className={statusFilter === 'active' ? 'bg-muted' : ''}
                        >
                          Active
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusFilterChange('past_due')}
                          className={statusFilter === 'past_due' ? 'bg-muted' : ''}
                        >
                          Past Due
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusFilterChange('cancelled')}
                          className={statusFilter === 'cancelled' ? 'bg-muted' : ''}
                        >
                          Cancelled
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Next Renewal</TableHead>
                        <TableHead>AI Credits</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubscriptions.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell className="font-medium">{sub.company}</TableCell>
                          <TableCell>{sub.plan}</TableCell>
                          <TableCell>{formatCurrency(sub.amount)}/mo</TableCell>
                          <TableCell>{getStatusBadge(sub.status)}</TableCell>
                          <TableCell>{formatDate(sub.renewalDate)}</TableCell>
                          <TableCell>{sub.aiCredits}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Add Credits</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredSubscriptions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No subscriptions found matching your criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="p-0 border-0">
              <div className="flex flex-col gap-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>{payment.company}</TableCell>
                          <TableCell>{formatDate(payment.date)}</TableCell>
                          <TableCell>{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>
                            {payment.type === 'subscription' 
                              ? 'Subscription' 
                              : 'AI Credits'}
                          </TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="p-0 border-0">
              <Card className="bg-transparent shadow-none border-none">
                <CardContent className="p-0">
                  <AIGenerated>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Billing Insights</h3>
                      
                      <div className="space-y-2">
                        <p>Based on current trends and subscription data, here are key insights:</p>
                        
                        <div className="rounded-md bg-amber-50 p-3 text-amber-800 flex gap-2 my-3">
                          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">At-risk subscription</p>
                            <p className="text-sm">Education Plus has a past due payment and is at 78% risk of churning based on activity patterns.</p>
                          </div>
                        </div>
                        
                        <h4 className="font-medium mt-4">Recommendations:</h4>
                        <ul className="space-y-2 mt-2">
                          <li className="flex gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                            <span>Consider implementing an early-renewal discount program for annual commitments (projected 15% increase in LTV).</span>
                          </li>
                          <li className="flex gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                            <span>Current AI credit usage trends indicate Enterprise customers would benefit from a 20% higher allocation.</span>
                          </li>
                          <li className="flex gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                            <span>Professional tier shows highest growth potential - consider bundle promotions for this segment.</span>
                          </li>
                        </ul>

                        <div className="pt-4">
                          <p>Based on industry benchmarks, your platform's net revenue retention rate of 109% is above average for HR tech (industry avg: 104%).</p>
                        </div>
                      </div>
                    </div>
                  </AIGenerated>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBilling;
