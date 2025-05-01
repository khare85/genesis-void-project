
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './lib/auth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PublicRoute from './components/PublicRoute';
import MainLayout from './components/layout/MainLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminCompanyDetails from './pages/admin/AdminCompanyDetails';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBilling from './pages/admin/AdminBilling';
import AdminSettings from './pages/admin/AdminSettings';
import ProfilePage from './pages/profile/ProfilePage';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterJobListings from './pages/recruiter/RecruiterJobListings';
import RecruiterCandidates from './pages/recruiter/RecruiterCandidates';
import CandidateProfile from './pages/recruiter/CandidateProfile';
import RecruiterScreening from './pages/recruiter/RecruiterScreening';
import JobApplicants from './pages/recruiter/JobApplicants';
import { Toaster } from 'sonner';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerJobListings from './pages/manager/ManagerJobListings';
import ManagerInterviews from './pages/manager/ManagerInterviews';
import ManagerAnalytics from './pages/manager/ManagerAnalytics';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateApplications from './pages/candidate/CandidateApplications';
import CandidateInterviews from './pages/candidate/CandidateInterviews';
import CandidateProfilePage from './pages/candidate/CandidateProfilePage';
import CandidateJobs from './pages/candidate/CandidateJobs';
import LandingPage from './pages/LandingPage';
import CareersPage from './pages/CareersPage';
import JobDetail from './pages/JobDetail';
import JobApplicationPage from './pages/JobApplicationPage';
import Index from './pages/Index';
import CreateJob from './pages/recruiter/CreateJob';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/careers/:id" element={<JobDetail />} />
        <Route path="/careers/:id/apply" element={<JobApplicationPage />} />
        
        {/* Protected Routes with Layout */}
        <Route path="/" element={<MainLayout />}>
          {/* Default dashboard redirect */}
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<RequireAuth allowedRoles={['admin']}><AdminDashboard /></RequireAuth>} />
          <Route path="/admin/companies" element={<RequireAuth allowedRoles={['admin']}><AdminCompanies /></RequireAuth>} />
          <Route path="/admin/companies/:id" element={<RequireAuth allowedRoles={['admin']}><AdminCompanyDetails /></RequireAuth>} />
          <Route path="/admin/users" element={<RequireAuth allowedRoles={['admin']}><AdminUsers /></RequireAuth>} />
          <Route path="/admin/billing" element={<RequireAuth allowedRoles={['admin']}><AdminBilling /></RequireAuth>} />
          <Route path="/admin/settings" element={<RequireAuth allowedRoles={['admin']}><AdminSettings /></RequireAuth>} />
          
          {/* Manager Routes */}
          <Route path="/manager/dashboard" element={<RequireAuth allowedRoles={['hiring_manager']}><ManagerDashboard /></RequireAuth>} />
          <Route path="/manager/jobs" element={<RequireAuth allowedRoles={['hiring_manager']}><ManagerJobListings /></RequireAuth>} />
          <Route path="/manager/jobs/create" element={<RequireAuth allowedRoles={['hiring_manager', 'recruiter']}><CreateJob /></RequireAuth>} />
          <Route path="/manager/jobs/:id/applicants" element={<RequireAuth allowedRoles={['hiring_manager']}><JobApplicants /></RequireAuth>} />
          <Route path="/manager/interviews" element={<RequireAuth allowedRoles={['hiring_manager']}><ManagerInterviews /></RequireAuth>} />
          <Route path="/manager/analytics" element={<RequireAuth allowedRoles={['hiring_manager']}><ManagerAnalytics /></RequireAuth>} />
          
          {/* Recruiter Routes */}
          <Route path="/recruiter/dashboard" element={<RequireAuth allowedRoles={['recruiter']}><RecruiterDashboard /></RequireAuth>} />
          <Route path="/recruiter/jobs" element={<RequireAuth allowedRoles={['recruiter']}><RecruiterJobListings /></RequireAuth>} />
          <Route path="/recruiter/jobs/create" element={<RequireAuth allowedRoles={['recruiter']}><CreateJob /></RequireAuth>} />
          <Route path="/recruiter/jobs/:id/applicants" element={<RequireAuth allowedRoles={['recruiter']}><JobApplicants /></RequireAuth>} />
          <Route path="/recruiter/candidates" element={<RequireAuth allowedRoles={['recruiter']}><RecruiterCandidates /></RequireAuth>} />
          <Route path="/recruiter/candidates/:id" element={<RequireAuth allowedRoles={['recruiter', 'hiring_manager']}><CandidateProfile /></RequireAuth>} />
          <Route path="/recruiter/screening" element={<RequireAuth allowedRoles={['recruiter']}><RecruiterScreening /></RequireAuth>} />

          {/* Candidate Routes - Also accessible by recruiters for viewing */}
          <Route path="/candidate/dashboard" element={<RequireAuth allowedRoles={['candidate']}><CandidateDashboard /></RequireAuth>} />
          <Route path="/candidate/applications" element={<RequireAuth allowedRoles={['candidate']}><CandidateApplications /></RequireAuth>} />
          <Route path="/candidate/interviews" element={<RequireAuth allowedRoles={['candidate']}><CandidateInterviews /></RequireAuth>} />
          <Route path="/candidate/profile" element={<RequireAuth allowedRoles={['candidate', 'recruiter', 'hiring_manager']}><CandidateProfilePage /></RequireAuth>} />
          <Route path="/candidate/jobs" element={<RequireAuth allowedRoles={['candidate']}><CandidateJobs /></RequireAuth>} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
