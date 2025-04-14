
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, Home, PlusCircle, Search } from "lucide-react";

const MainLayout = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BriefcaseBusiness className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">JobsBoard</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/jobs/create">
              <Button variant="default" size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" /> Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8">
            <Link to="/" className={`py-3 px-1 inline-flex items-center gap-2 border-b-2 ${isActive('/') ? 'border-primary text-primary font-medium' : 'border-transparent hover:text-primary'}`}>
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link to="/jobs" className={`py-3 px-1 inline-flex items-center gap-2 border-b-2 ${isActive('/jobs') ? 'border-primary text-primary font-medium' : 'border-transparent hover:text-primary'}`}>
              <BriefcaseBusiness className="h-4 w-4" />
              <span>Browse Jobs</span>
            </Link>
            <Link to="/jobs/search" className={`py-3 px-1 inline-flex items-center gap-2 border-b-2 ${isActive('/jobs/search') ? 'border-primary text-primary font-medium' : 'border-transparent hover:text-primary'}`}>
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">JobsBoard</h3>
              <p className="text-muted-foreground">
                Find your dream job or post a job opening to find the perfect candidate.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li><Link to="/jobs" className="text-muted-foreground hover:text-primary">Browse Jobs</Link></li>
                <li><Link to="/jobs/search" className="text-muted-foreground hover:text-primary">Search Jobs</Link></li>
                <li><Link to="/jobs/saved" className="text-muted-foreground hover:text-primary">Saved Jobs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2">
                <li><Link to="/jobs/create" className="text-muted-foreground hover:text-primary">Post a Job</Link></li>
                <li><Link to="/pricing" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
                <li><Link to="/resources/employers" className="text-muted-foreground hover:text-primary">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} JobsBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
