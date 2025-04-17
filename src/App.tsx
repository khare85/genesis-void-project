
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { RequireAuth as ProtectedRoute } from './lib/auth';
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
import { Toaster } from './components/ui/toaster';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerJobListings from './pages/manager/ManagerJobListings';
import ManagerInterviews from './pages/manager/ManagerInterviews';
import ManagerAnalytics from './pages/manager/ManagerAnalytics';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateApplications from './pages/candidate/CandidateApplications';
import CandidateInterviews from './pages/candidate/CandidateInterviews';
import CandidateProfilePage from './pages/candidate/CandidateProfilePage';
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
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/companies" element={<ProtectedRoute allowedRoles={['admin']}><AdminCompanies /></ProtectedRoute>} />
          <Route path="/admin/companies/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminCompanyDetails /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/billing" element={<ProtectedRoute allowedRoles={['admin']}><AdminBilling /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
          
          {/* Manager Routes */}
          <Route path="/manager/dashboard" element={<ProtectedRoute allowedRoles={['hiring_manager']}><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/manager/jobs" element={<ProtectedRoute allowedRoles={['hiring_manager']}><ManagerJobListings /></ProtectedRoute>} />
          <Route path="/manager/jobs/create" element={<ProtectedRoute allowedRoles={['hiring_manager', 'recruiter']}><CreateJob /></ProtectedRoute>} />
          <Route path="/manager/jobs/:id/applicants" element={<ProtectedRoute allowedRoles={['hiring_manager']}><JobApplicants /></ProtectedRoute>} />
          <Route path="/manager/interviews" element={<ProtectedRoute allowedRoles={['hiring_manager']}><ManagerInterviews /></ProtectedRoute>} />
          <Route path="/manager/analytics" element={<ProtectedRoute allowedRoles={['hiring_manager']}><ManagerAnalytics /></ProtectedRoute>} />
          
          {/* Recruiter Routes */}
          <Route path="/recruiter/dashboard" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>} />
          <Route path="/recruiter/jobs" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterJobListings /></ProtectedRoute>} />
          <Route path="/recruiter/jobs/create" element={<ProtectedRoute allowedRoles={['recruiter']}><CreateJob /></ProtectedRoute>} />
          <Route path="/recruiter/jobs/:id/applicants" element={<ProtectedRoute allowedRoles={['recruiter']}><JobApplicants /></ProtectedRoute>} />
          <Route path="/recruiter/candidates" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterCandidates /></ProtectedRoute>} />
          <Route path="/recruiter/candidates/:id" element={<ProtectedRoute allowedRoles={['recruiter']}><CandidateProfile /></ProtectedRoute>} />
          <Route path="/recruiter/screening" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterScreening /></ProtectedRoute>} />

          {/* Candidate Routes */}
          <Route path="/candidate/dashboard" element={<ProtectedRoute allowedRoles={['candidate']}><CandidateDashboard /></ProtectedRoute>} />
          <Route path="/candidate/applications" element={<ProtectedRoute allowedRoles={['candidate']}><CandidateApplications /></ProtectedRoute>} />
          <Route path="/candidate/interviews" element={<ProtectedRoute allowedRoles={['candidate']}><CandidateInterviews /></ProtectedRoute>} />
          <Route path="/candidate/profile" element={<ProtectedRoute allowedRoles={['candidate']}><CandidateProfilePage /></ProtectedRoute>} />
        </Route>
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
