
import { UserRole } from './types';

// Helper function to get dashboard route based on user role
export function getDashboardByRole(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'hiring_manager':
      return '/manager/dashboard';
    case 'recruiter':
      return '/recruiter/dashboard';
    case 'candidate':
      return '/candidate/dashboard';
    default:
      return '/login';
  }
}
