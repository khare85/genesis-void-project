import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  Building2,
  CreditCard,
  Download,
  MoreHorizontal,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  UserPlus,
  FilePlus,
} from "lucide-react";
import { AddCompanyDialog } from "@/components/admin/AddCompanyDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIGenerated from "@/components/shared/AIGenerated";
import PlatformActivityChart from "@/components/admin/PlatformActivityChart";
import AddUserForm from "@/components/admin/AddUserForm";
import AddPlanForm from "@/components/admin/AddPlanForm";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"usage" | "companies" | "revenue">("usage");
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [addPlanDialogOpen, setAddPlanDialogOpen] = useState(false);
  const [addCompanyDialogOpen, setAddCompanyDialogOpen] = useState(false);

  // Recent activity mock data
  const recentActivities = [
    { 
      id: 1, 
      type: 'company_added', 
      title: 'New company onboarded',
      description: 'Innovation Tech Solutions has joined the platform',
      timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
      icon: <Building2 className="h-5 w-5" />
    },
    { 
      id: 2, 
      type: 'user_upgrade', 
      title: 'User subscription upgraded',
      description: 'Global Finance Group upgraded to Enterprise plan',
      timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
      icon: <Users className="h-5 w-5" />
    },
    { 
      id: 3, 
      type: 'ai_credits', 
      title: 'AI credits allocated',
      description: 'TechnovateX purchased 10,000 additional AI credits',
      timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
      icon: <Sparkles className="h-5 w-5" />
    },
    { 
      id: 4, 
      type: 'plan_created', 
      title: 'New subscription plan created',
      description: 'Pro Plus plan added to the platform',
      timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
      icon: <CreditCard className="h-5 w-5" />
    },
    { 
      id: 5, 
      type: 'company_added', 
      title: 'New company onboarded',
      description: 'Healthcare Solutions Inc has joined the platform',
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
      icon: <Building2 className="h-5 w-5" />
    },
  ];

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0]}`}
        description="Here's what's happening across your platform"
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" />
              Reports
            </Button>
            <Button size="sm" className="gap-1.5">
              <Sparkles className="h-4 w-4" />
              AI Insights
            </Button>
          </>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-muted-foreground">Total Companies</div>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-semibold">24</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +4 this month
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-muted-foreground">Active Users</div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-semibold">2,841</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +16% from last month
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-muted-foreground">AI Usage</div>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-semibold">458K</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +32% from last month
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-muted-foreground">Revenue</div>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-semibold">$58,492</div>
              <div className="flex items-center text-xs text-red-500">
                <TrendingDown className="h-3 w-3 mr-1" />
                -4% from last month
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium">Platform Activity</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View All</DropdownMenuItem>
                  <DropdownMenuItem>Download CSV</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Tabs defaultValue="usage" value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
              <TabsList className="mb-4">
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="companies">Companies</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
              </TabsList>
              <TabsContent value="usage" className="p-0 border-0">
                <PlatformActivityChart type="usage" />
              </TabsContent>
              <TabsContent value="companies" className="p-0 border-0">
                <PlatformActivityChart type="companies" />
              </TabsContent>
              <TabsContent value="revenue" className="p-0 border-0">
                <PlatformActivityChart type="revenue" />
              </TabsContent>
            </Tabs>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium">AI Usage Insights</h3>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            
            <AIGenerated>
              <div className="space-y-4">
                <p className="text-sm">
                  Based on current trends, we predict a <span className="font-medium">38% increase</span> in 
                  AI usage across the platform in the next month. Focus areas:
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span>Resume parsing (42% of usage)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-300"></div>
                    <span>Job description generation (28% of usage)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                    <span>Video interviews (18% of usage)</span>
                  </li>
                </ul>
                <div className="text-sm font-medium pt-2">
                  Recommendation: Increase AI credit allocations for Enterprise customers by 20%.
                </div>
              </div>
            </AIGenerated>
          </div>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium">Recent Activities</h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/50 transition-colors">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatRelativeTime(activity.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium">Admin Actions</h3>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={() => setAddUserDialogOpen(true)} 
                className="w-full justify-start" 
                variant="outline"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
              
              <Button 
                onClick={() => setAddPlanDialogOpen(true)} 
                className="w-full justify-start" 
                variant="outline"
              >
                <FilePlus className="mr-2 h-4 w-4" />
                Create Subscription Plan
              </Button>
              
              <Button 
                onClick={() => setAddCompanyDialogOpen(true)}
                className="w-full justify-start" 
                variant="outline"
              >
                <Building2 className="mr-2 h-4 w-4" />
                Add Company
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Generate Monthly Report
              </Button>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Pending Tasks</h4>
              <div className="space-y-2">
                <div className="p-3 rounded-md bg-muted/50 border-l-4 border-primary">
                  <div className="text-sm font-medium">Review new enterprise plan</div>
                  <div className="text-xs text-muted-foreground">Due tomorrow</div>
                </div>
                <div className="p-3 rounded-md bg-muted/50 border-l-4 border-orange-400">
                  <div className="text-sm font-medium">Schedule demo with TechGiant Inc.</div>
                  <div className="text-xs text-muted-foreground">Due in 3 days</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* User Add Dialog */}
      <AddUserForm open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen} />
      
      {/* Plan Add Dialog */}
      <AddPlanForm open={addPlanDialogOpen} onOpenChange={setAddPlanDialogOpen} />

      {/* Company Add Dialog */}
      <AddCompanyDialog
        open={addCompanyDialogOpen}
        onOpenChange={setAddCompanyDialogOpen}
        onCompanyAdded={() => {
          // Refresh companies data if needed
          setAddCompanyDialogOpen(false);
        }}
      />
    </div>
  );
};

export default AdminDashboard;
