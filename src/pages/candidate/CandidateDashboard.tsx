
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import { ArrowUpRight, Briefcase, CheckCircle2, Clock, FileText, Search, Sparkles, Video, XCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIGenerated from "@/components/shared/AIGenerated";

const CandidateDashboard = () => {
  const { user } = useAuth();
  
  return <div className="space-y-6">
      <PageHeader title={`Welcome back, ${user?.name.split(" ")[0]}`} description="Track your job applications and upcoming interviews" actions={<Button size="sm" asChild>
            <Link to="/candidate/jobs" className="gap-1.5">
              <Search className="h-4 w-4" />
              Browse Jobs
            </Link>
          </Button>} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-muted-foreground">Active Applications</div>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-semibold">4</div>
            <Link to="/candidate/applications" className="text-xs text-primary flex items-center">
              View all <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-muted-foreground">Upcoming Interviews</div>
            <Video className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-semibold">2</div>
            <Link to="/candidate/interviews" className="text-xs text-primary flex items-center">
              View all <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-muted-foreground">Completed Interviews</div>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-semibold">3</div>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Last 30 days
            </Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-muted-foreground">Profile Completion</div>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-semibold">85%</div>
            <Badge className="bg-amber-500 border-none text-white text-xs">Update</Badge>
          </div>
          <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{
            width: '85%'
          }}></div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium">Your Applications</h3>
              <Button variant="outline" size="sm" asChild>
                <Link to="/candidate/applications">View All</Link>
              </Button>
            </div>
            
            <Tabs defaultValue="active">
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="p-0 border-0">
                <div className="space-y-4">
                  {[{
                  title: 'Senior React Developer',
                  company: 'TechCorp Inc.',
                  status: 'Interview Scheduled',
                  date: '2 days ago',
                  statusColor: 'bg-blue-500'
                }, {
                  title: 'Frontend Developer',
                  company: 'WebSolutions Ltd',
                  status: 'Application Under Review',
                  date: '1 week ago',
                  statusColor: 'bg-amber-500'
                }, {
                  title: 'Full Stack Engineer',
                  company: 'InnoTech Systems',
                  status: 'Technical Assessment',
                  date: '5 days ago',
                  statusColor: 'bg-purple-500'
                }, {
                  title: 'UI/UX Developer',
                  company: 'DesignPro Agency',
                  status: 'Application Submitted',
                  date: '2 weeks ago',
                  statusColor: 'bg-gray-500'
                }].map((job, i) => <div key={i} className="flex items-center justify-between p-4 rounded-md border hover:border-primary hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-md ${job.statusColor} flex items-center justify-center text-white font-bold`}>
                          {job.company.substring(0, 1)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{job.title}</div>
                          <div className="text-xs text-muted-foreground">{job.company} • Applied {job.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-4">
                          {job.status}
                        </Badge>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>)}
                </div>
              </TabsContent>
              <TabsContent value="completed" className="p-0 border-0">
                <div className="space-y-4">
                  {[{
                  title: 'JavaScript Developer',
                  company: 'SoftDev Inc.',
                  status: 'Offer Accepted',
                  date: '2 months ago',
                  statusColor: 'bg-green-500',
                  icon: <CheckCircle2 className="h-4 w-4" />
                }, {
                  title: 'Frontend Engineer',
                  company: 'TechStart',
                  status: 'Rejected',
                  date: '3 months ago',
                  statusColor: 'bg-red-500',
                  icon: <XCircle className="h-4 w-4" />
                }, {
                  title: 'Web Developer',
                  company: 'DigitalWorks',
                  status: 'Withdrawn',
                  date: '1 month ago',
                  statusColor: 'bg-gray-500',
                  icon: <XCircle className="h-4 w-4" />
                }].map((job, i) => <div key={i} className="flex items-center justify-between p-4 rounded-md border hover:border-primary hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-md ${job.statusColor} flex items-center justify-center text-white font-bold`}>
                          {job.company.substring(0, 1)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{job.title}</div>
                          <div className="text-xs text-muted-foreground">{job.company} • {job.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge variant={job.status === 'Offer Accepted' ? 'default' : 'destructive'} className="gap-1">
                          {job.icon}
                          {job.status}
                        </Badge>
                      </div>
                    </div>)}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium">Upcoming Interviews</h3>
              <Video className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-md border-l-4 border-primary bg-primary/5">
                <div className="font-medium mb-1">AI Video Interview</div>
                <div className="text-sm text-muted-foreground">Senior React Developer @ TechCorp Inc.</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Tomorrow, 10:00 AM</span>
                  </div>
                  <Button size="sm">Join </Button>
                </div>
              </div>
              
              <div className="p-4 rounded-md border-l-4 border-blue-500 bg-blue-500/5">
                <div className="font-medium mb-1">Technical Assessment</div>
                <div className="text-sm text-muted-foreground">Full Stack Engineer @ InnoTech Systems</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Friday, 2:30 PM</span>
                  </div>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <AIGenerated>
                <div className="space-y-3">
                  <p className="text-sm">Interview preparation tips:</p>
                  <ul className="text-xs space-y-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Research TechCorp's recent product launches</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Review React performance optimization techniques</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Prepare questions about their development workflow</span>
                    </li>
                  </ul>
                </div>
              </AIGenerated>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium">Profile Completion</h3>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Resume</span>
                <Badge>Completed</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Skills Assessment</span>
                <Badge>Completed</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Video Introduction</span>
                <Badge variant="outline">Incomplete</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Work Experience</span>
                <Badge>Completed</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Education</span>
                <Badge>Completed</Badge>
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                <Link to="/candidate/profile">Complete Profile</Link>
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="col-span-1 md:col-span-2 lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium">AI Career Insights</h3>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            
            <AIGenerated>
              <div className="space-y-4">
                <p className="text-sm">
                  Based on your profile and current market trends, here are some personalized insights:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-md bg-muted/50">
                    <h4 className="text-sm font-medium mb-1">Skill Gaps</h4>
                    <p className="text-xs text-muted-foreground">
                      Consider strengthening your TypeScript and GraphQL skills, which appear in 68% of jobs matching your profile.
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-md bg-muted/50">
                    <h4 className="text-sm font-medium mb-1">Market Trends</h4>
                    <p className="text-xs text-muted-foreground">
                      React developers with state management experience (Redux, Recoil) are seeing 15% higher interview rates.
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-md bg-muted/50">
                    <h4 className="text-sm font-medium mb-1">Interview Performance</h4>
                    <p className="text-xs text-muted-foreground">
                      Your communication skills are strong, but consider practicing more technical explanations of your past projects.
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-md bg-muted/50">
                    <h4 className="text-sm font-medium mb-1">Resume Enhancement</h4>
                    <p className="text-xs text-muted-foreground">
                      Adding quantifiable achievements could increase your resume match score by up to 24% for senior roles.
                    </p>
                  </div>
                </div>
                
                <Button size="sm" className="w-full">
                  Get Full Career Report
                </Button>
              </div>
            </AIGenerated>
          </div>
        </Card>
      </div>
    </div>;
};

export default CandidateDashboard;
