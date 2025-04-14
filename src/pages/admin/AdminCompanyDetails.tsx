
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
  Users, 
  Briefcase, 
  Calendar, 
  CreditCard,
  Save,
  X,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Globe,
  BarChart,
  Clock,
  CheckCircle2,
  User,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Download
} from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

// Enhanced mock company data with more details
const companiesData = [
  {
    id: 1,
    name: 'TechnovateX',
    industry: 'Technology',
    employees: 350,
    hiringManagers: [
      {
        id: 1,
        name: 'David Wilson',
        email: 'd.wilson@technovatex.com',
        department: 'Engineering',
        activeJobs: 3,
        lastActive: '2025-04-08T14:25:30'
      },
      {
        id: 2,
        name: 'Michelle Lee',
        email: 'm.lee@technovatex.com',
        department: 'Product',
        activeJobs: 2,
        lastActive: '2025-04-09T09:15:45'
      },
      {
        id: 3,
        name: 'Thomas Rodriguez',
        email: 't.rodriguez@technovatex.com',
        department: 'Marketing',
        activeJobs: 2,
        lastActive: '2025-04-07T16:40:20'
      },
      {
        id: 4,
        name: 'Lisa Chang',
        email: 'l.chang@technovatex.com',
        department: 'HR',
        activeJobs: 1,
        lastActive: '2025-04-09T10:05:15'
      }
    ],
    activeJobs: 8,
    status: 'active',
    credits: 1500,
    subscriptionTier: 'Enterprise',
    renewalDate: '2025-08-12',
    address: '123 Tech Blvd, San Francisco, CA 94105',
    contactEmail: 'contact@technovatex.com',
    contactPhone: '(415) 555-1234',
    description: 'Leading technology innovation company specializing in AI and machine learning solutions.',
    website: 'https://technovatex.com',
    foundedYear: 2015,
    logo: '/placeholder.svg',
    primaryContact: {
      name: 'Sarah Johnson',
      role: 'VP of Talent Acquisition',
      email: 'sarah.j@technovatex.com',
      phone: '(415) 555-5678'
    },
    metrics: {
      timeToHire: 32, // days
      costPerHire: 4250, // USD
      jobsPosted: {
        current: 8,
        lastMonth: 5
      },
      interviews: {
        scheduled: 24,
        completed: 18
      },
      candidates: {
        screened: 86,
        shortlisted: 42,
        hired: 6
      },
      aiUsage: {
        current: 780,
        previousMonth: 620
      }
    },
    billingHistory: [
      {
        id: 'INV-2025-0042',
        date: '2025-04-01',
        amount: 1299,
        type: 'Subscription',
        status: 'paid'
      },
      {
        id: 'INV-2025-0039',
        date: '2025-03-25',
        amount: 500,
        type: 'AI Credits',
        status: 'paid'
      },
      {
        id: 'INV-2025-0033',
        date: '2025-03-01',
        amount: 1299,
        type: 'Subscription',
        status: 'paid'
      },
      {
        id: 'INV-2025-0027',
        date: '2025-02-01',
        amount: 1299,
        type: 'Subscription',
        status: 'paid'
      }
    ],
    activeJobListings: [
      {
        id: 101,
        title: 'Senior Software Engineer',
        department: 'Engineering',
        location: 'San Francisco, CA',
        type: 'Full-time',
        postedDate: '2025-03-20',
        applications: 24,
        hiringManager: 'David Wilson',
        status: 'active'
      },
      {
        id: 102,
        title: 'UX Designer',
        department: 'Product',
        location: 'San Francisco, CA',
        type: 'Full-time',
        postedDate: '2025-03-25',
        applications: 18,
        hiringManager: 'Michelle Lee',
        status: 'active'
      },
      {
        id: 103,
        title: 'DevOps Engineer',
        department: 'Engineering',
        location: 'Remote',
        type: 'Full-time',
        postedDate: '2025-03-28',
        applications: 12,
        hiringManager: 'David Wilson',
        status: 'active'
      },
      {
        id: 104,
        title: 'Marketing Manager',
        department: 'Marketing',
        location: 'San Francisco, CA',
        type: 'Full-time',
        postedDate: '2025-04-01',
        applications: 15,
        hiringManager: 'Thomas Rodriguez',
        status: 'active'
      },
      {
        id: 105,
        title: 'Product Manager',
        department: 'Product',
        location: 'Remote',
        type: 'Full-time',
        postedDate: '2025-04-03',
        applications: 9,
        hiringManager: 'Michelle Lee',
        status: 'active'
      },
      {
        id: 106,
        title: 'Frontend Developer',
        department: 'Engineering',
        location: 'San Francisco, CA',
        type: 'Full-time',
        postedDate: '2025-04-05',
        applications: 11,
        hiringManager: 'David Wilson',
        status: 'active'
      },
      {
        id: 107,
        title: 'Digital Marketing Specialist',
        department: 'Marketing',
        location: 'Remote',
        type: 'Full-time',
        postedDate: '2025-04-06',
        applications: 7,
        hiringManager: 'Thomas Rodriguez',
        status: 'active'
      },
      {
        id: 108,
        title: 'HR Coordinator',
        department: 'HR',
        location: 'San Francisco, CA',
        type: 'Full-time',
        postedDate: '2025-04-07',
        applications: 5,
        hiringManager: 'Lisa Chang',
        status: 'active'
      }
    ]
  },
  {
    id: 2,
    name: 'Global Finance Group',
    industry: 'Finance',
    employees: 820,
    hiringManagers: [
      {
        id: 5,
        name: 'John Smith',
        email: 'j.smith@globalfinance.com',
        department: 'Investment',
        activeJobs: 3,
        lastActive: '2025-04-08T11:25:30'
      },
      {
        id: 6,
        name: 'Emma Davis',
        email: 'e.davis@globalfinance.com',
        department: 'Risk Management',
        activeJobs: 4,
        lastActive: '2025-04-07T15:10:22'
      }
    ],
    activeJobs: 12,
    status: 'active',
    credits: 3000,
    subscriptionTier: 'Enterprise',
    renewalDate: '2025-07-19',
    address: '456 Wall St, New York, NY 10005',
    contactEmail: 'info@globalfinancegroup.com',
    contactPhone: '(212) 555-6789',
    description: 'International finance corporation providing wealth management and investment services.',
    website: 'https://globalfinancegroup.com',
    foundedYear: 2003,
    logo: '/placeholder.svg'
  },
  // Other companies data from the original mock data
];

// Type definitions for company data
interface HiringManager {
  id: number;
  name: string;
  email: string;
  department: string;
  activeJobs: number;
  lastActive: string;
}

interface JobListing {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  postedDate: string;
  applications: number;
  hiringManager: string;
  status: string;
}

interface BillingRecord {
  id: string;
  date: string;
  amount: number;
  type: string;
  status: string;
}

interface Company {
  id: number;
  name: string;
  industry: string;
  employees: number;
  hiringManagers: HiringManager[];
  activeJobs: number;
  status: string;
  credits: number;
  subscriptionTier: string;
  renewalDate: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  description?: string;
  website?: string;
  foundedYear?: number;
  logo?: string;
  primaryContact?: {
    name: string;
    role: string;
    email: string;
    phone: string;
  };
  metrics?: {
    timeToHire: number;
    costPerHire: number;
    jobsPosted: {
      current: number;
      lastMonth: number;
    };
    interviews: {
      scheduled: number;
      completed: number;
    };
    candidates: {
      screened: number;
      shortlisted: number;
      hired: number;
    };
    aiUsage: {
      current: number;
      previousMonth: number;
    };
  };
  billingHistory?: BillingRecord[];
  activeJobListings?: JobListing[];
}

const AdminCompanyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const companyId = parseInt(id || '0');
  
  const [company, setCompany] = useState<Company | undefined>(companiesData.find(c => c.id === companyId));
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Company | undefined>(company);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showAddCreditsDialog, setShowAddCreditsDialog] = useState(false);
  const [creditsToAdd, setCreditsToAdd] = useState<number>(500);

  // If company not found, redirect to companies list
  useEffect(() => {
    if (!company) {
      toast.error("Company not found");
      navigate('/admin/companies');
    }
  }, [company, navigate]);

  if (!company || !formData) {
    return null;
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle save changes
  const handleSave = () => {
    // In a real app, this would call an API
    setCompany(formData);
    setEditMode(false);
    toast.success("Company details updated successfully");
  };

  // Handle deactivate company
  const handleDeactivate = () => {
    // In a real app, this would call an API
    const updatedCompany = { ...company, status: 'inactive' };
    setCompany(updatedCompany);
    setFormData(updatedCompany);
    setShowDeactivateDialog(false);
    toast.success("Company has been deactivated");
  };

  // Handle add credits
  const handleAddCredits = () => {
    if (creditsToAdd > 0) {
      // In a real app, this would call an API
      const updatedCompany = { 
        ...company, 
        credits: company.credits + creditsToAdd
      };
      setCompany(updatedCompany);
      setFormData(updatedCompany);
      setShowAddCreditsDialog(false);
      toast.success(`Added ${creditsToAdd} credits to ${company.name}`);
    }
  };

  // Get status badge color based on status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date string
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };
  
  // Format date with time
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={company.name}
        description={`${company.industry} • ${getStatusBadge(company.status)}`}
        icon={<Building2 className="h-6 w-6" />}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/admin/companies')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Button>
            {editMode ? (
              <>
                <Button variant="ghost" onClick={() => {
                  setEditMode(false);
                  setFormData(company);
                }}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setEditMode(true)}>
                  Edit Company
                </Button>
                
                <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" disabled={company.status === 'inactive'}>
                      Deactivate
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Deactivate Company</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to deactivate {company.name}? This will suspend all their 
                        active job listings and restrict access for their hiring managers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-md text-amber-800">
                      <AlertTriangle className="h-5 w-5" />
                      <p className="text-sm">This action can be reversed later by reactivating the company.</p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDeactivateDialog(false)}>Cancel</Button>
                      <Button variant="destructive" onClick={handleDeactivate}>Yes, Deactivate</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="managers">Hiring Managers</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Company Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    
                    <div className="grid gap-3">
                      <Label htmlFor="industry">Industry</Label>
                      <Select 
                        value={formData.industry}
                        onValueChange={(value) => handleSelectChange('industry', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Legal">Legal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-3">
                      <Label htmlFor="employees">Number of Employees</Label>
                      <Input 
                        id="employees" 
                        name="employees" 
                        type="number" 
                        value={formData.employees} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    
                    <div className="grid gap-3">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        name="description"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        value={formData.website || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="foundedYear">Founded Year</Label>
                      <Input
                        id="foundedYear"
                        name="foundedYear"
                        type="number"
                        value={formData.foundedYear || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Founded</p>
                        <p>{company.foundedYear || 'Unknown'}</p>
                      </div>
                      {company.website && (
                        <Button variant="outline" size="sm" className="gap-1.5" asChild>
                          <a href={company.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4" />
                            Visit Website
                          </a>
                        </Button>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p className="mt-1">{company.description || 'No description provided.'}</p>
                    </div>
                      
                    <div className="flex flex-col gap-6 pt-4">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{company.employees} Employees</p>
                          <p className="text-sm text-muted-foreground">Company size</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{company.activeJobs} Active Jobs</p>
                          <p className="text-sm text-muted-foreground">Currently listed</p>
                        </div>
                      </div>

                      {company.primaryContact && (
                        <div className="flex items-center">
                          <User className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{company.primaryContact.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {company.primaryContact.role} • {company.primaryContact.email}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        value={formData.address || ''} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    
                    <div className="grid gap-3">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input 
                        id="contactEmail" 
                        name="contactEmail" 
                        type="email" 
                        value={formData.contactEmail || ''} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    
                    <div className="grid gap-3">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input 
                        id="contactPhone" 
                        name="contactPhone" 
                        value={formData.contactPhone || ''} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Address</p>
                          <p>{company.address || 'No address provided.'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Email</p>
                          <p>{company.contactEmail || 'No email provided.'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Phone</p>
                          <p>{company.contactPhone || 'No phone provided.'}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{company.subscriptionTier}</p>
                      <p className="text-sm text-muted-foreground">Subscription tier</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{formatDate(company.renewalDate)}</p>
                      <p className="text-sm text-muted-foreground">Renewal date</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">AI Credits</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="font-medium">{company.credits} credits remaining</p>
                      <Dialog open={showAddCreditsDialog} onOpenChange={setShowAddCreditsDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Add Credits</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add AI Credits</DialogTitle>
                            <DialogDescription>
                              Add additional AI credits to {company.name}'s account.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-2">
                            <div className="grid gap-2">
                              <Label htmlFor="credits">Credits Amount</Label>
                              <Input
                                id="credits"
                                type="number"
                                value={creditsToAdd}
                                onChange={(e) => setCreditsToAdd(parseInt(e.target.value) || 0)}
                                min={100}
                                step={100}
                              />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Current balance: {company.credits} credits
                            </p>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowAddCreditsDialog(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAddCredits}>
                              Add Credits
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="jobs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Job Listings</CardTitle>
                <CardDescription>View and manage all active job listings for this company.</CardDescription>
              </div>
              <Button size="sm">
                <Briefcase className="mr-2 h-4 w-4" />
                Add Job
              </Button>
            </CardHeader>
            <CardContent>
              {company.activeJobListings && company.activeJobListings.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Posted Date</TableHead>
                        <TableHead>Applications</TableHead>
                        <TableHead>Hiring Manager</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {company.activeJobListings.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>{job.department}</TableCell>
                          <TableCell>{job.location}</TableCell>
                          <TableCell>{formatDate(job.postedDate)}</TableCell>
                          <TableCell>{job.applications}</TableCell>
                          <TableCell>{job.hiringManager}</TableCell>
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
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No job listings found for this company.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="managers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Hiring Managers</CardTitle>
                <CardDescription>Manage hiring manager accounts associated with this company.</CardDescription>
              </div>
              <Button size="sm">
                <Users className="mr-2 h-4 w-4" />
                Add Manager
              </Button>
            </CardHeader>
            <CardContent>
              {company.hiringManagers && company.hiringManagers.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Active Jobs</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {company.hiringManagers.map((manager) => (
                        <TableRow key={manager.id}>
                          <TableCell className="font-medium">{manager.name}</TableCell>
                          <TableCell>{manager.email}</TableCell>
                          <TableCell>{manager.department}</TableCell>
                          <TableCell>{manager.activeJobs}</TableCell>
                          <TableCell>{formatDateTime(manager.lastActive)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No hiring managers found for this company.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View billing history and manage payment methods.</CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {company.billingHistory && company.billingHistory.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {company.billingHistory.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{formatDate(invoice.date)}</TableCell>
                          <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                          <TableCell>{invoice.type}</TableCell>
                          <TableCell>
                            <Badge className={invoice.status === 'paid' ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}>
                              {invoice.status === 'paid' ? 'Paid' : 'Failed'}
                            </Badge>
                          </TableCell>
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
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No billing history found for this company.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Recruiting Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {company.metrics ? (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Time to Hire</p>
                        <p className="font-medium">{company.metrics.timeToHire} days</p>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-muted">
                        <div className="h-full w-3/5 rounded-full bg-primary"></div>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">vs. industry avg: 40 days</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Cost per Hire</p>
                        <p className="font-medium">{formatCurrency(company.metrics.costPerHire)}</p>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-muted">
                        <div className="h-full w-4/5 rounded-full bg-primary"></div>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">vs. industry avg: $4,700</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Job Postings</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{company.metrics.jobsPosted.current}</p>
                          <Badge className="bg-green-500">
                            +{company.metrics.jobsPosted.current - company.metrics.jobsPosted.lastMonth}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No recruiting metrics available.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Candidate Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                {company.metrics && company.metrics.candidates ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold">{company.metrics.candidates.screened}</p>
                        <p className="text-sm text-muted-foreground">Candidates Screened</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                    </div>

                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Shortlisted</p>
                        <p className="text-xl font-semibold">{company.metrics.candidates.shortlisted}</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(company.metrics.candidates.shortlisted / company.metrics.candidates.screened * 100)}% of screened
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Hired</p>
                        <p className="text-xl font-semibold">{company.metrics.candidates.hired}</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(company.metrics.candidates.hired / company.metrics.candidates.shortlisted * 100)}% conversion
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No candidate pipeline data available.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">AI Usage Trends</CardTitle>
              </CardHeader>
              <CardContent>
                {company.metrics && company.metrics.aiUsage ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold">{company.metrics.aiUsage.current}</p>
                        <p className="text-sm text-muted-foreground">Credits Used This Month</p>
                      </div>
                      <div className="flex items-center">
                        <Badge variant={company.metrics.aiUsage.current > company.metrics.aiUsage.previousMonth ? "default" : "secondary"}>
                          {company.metrics.aiUsage.current > company.metrics.aiUsage.previousMonth ? (
                            <TrendingUp className="h-3.5 w-3.5 mr-1" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5 mr-1" />
                          )}
                          {Math.round((company.metrics.aiUsage.current - company.metrics.aiUsage.previousMonth) / company.metrics.aiUsage.previousMonth * 100)}%
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Usage Breakdown</p>
                      <div className="mt-2 space-y-2">
                        <div>
                          <div className="flex justify-between text-xs">
                            <span>Resume Parsing</span>
                            <span>42%</span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-muted">
                            <div className="h-full w-[42%] rounded-full bg-primary"></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs">
                            <span>Job Descriptions</span>
                            <span>28%</span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-muted">
                            <div className="h-full w-[28%] rounded-full bg-blue-500"></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs">
                            <span>Candidate Screening</span>
                            <span>18%</span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-muted">
                            <div className="h-full w-[18%] rounded-full bg-amber-500"></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs">
                            <span>Other</span>
                            <span>12%</span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-muted">
                            <div className="h-full w-[12%] rounded-full bg-green-500"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No AI usage data available.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>Recent activity for this company</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[
                    { id: 1, type: 'job_posted', title: 'HR Coordinator', date: '2025-04-07T14:22:30' },
                    { id: 2, type: 'candidate_hired', title: 'Senior Software Engineer', date: '2025-04-05T09:15:45' },
                    { id: 3, type: 'credits_added', amount: 500, date: '2025-03-25T16:30:00' },
                    { id: 4, type: 'manager_added', name: 'Lisa Chang', date: '2025-03-20T11:45:22' },
                    { id: 5, type: 'job_posted', title: 'Frontend Developer', date: '2025-03-19T13:10:55' }
                  ].map(activity => (
                    <div key={activity.id} className="flex gap-4">
                      <div className="relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          {activity.type === 'job_posted' && <Briefcase className="h-5 w-5 text-primary" />}
                          {activity.type === 'candidate_hired' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                          {activity.type === 'credits_added' && <CreditCard className="h-5 w-5 text-primary" />}
                          {activity.type === 'manager_added' && <User className="h-5 w-5 text-primary" />}
                        </div>
                        <div className="absolute top-10 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-muted"></div>
                      </div>
                      <div className="flex flex-col pb-8">
                        <p className="font-medium">
                          {activity.type === 'job_posted' && `New job posted: ${activity.title}`}
                          {activity.type === 'candidate_hired' && `Candidate hired for ${activity.title}`}
                          {activity.type === 'credits_added' && `${activity.amount} AI credits added`}
                          {activity.type === 'manager_added' && `New hiring manager added: ${activity.name}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(activity.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCompanyDetails;
