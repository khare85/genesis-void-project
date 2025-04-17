
export type UserRole = 'admin' | 'hiring_manager' | 'recruiter' | 'candidate';

export interface UserPermissions {
  canManageUsers: boolean;
  canManageJobs: boolean;
  canManageCandidates: boolean;
  canManageInterviews: boolean;
  canViewAnalytics: boolean;
  canApplyToJobs: boolean;
}

export const getRolePermissions = (role: UserRole): UserPermissions => {
  switch (role) {
    case 'admin':
      return {
        canManageUsers: true,
        canManageJobs: true,
        canManageCandidates: true,
        canManageInterviews: true,
        canViewAnalytics: true,
        canApplyToJobs: false,
      };
    case 'hiring_manager':
      return {
        canManageUsers: false,
        canManageJobs: true,
        canManageCandidates: true,
        canManageInterviews: true,
        canViewAnalytics: true,
        canApplyToJobs: false,
      };
    case 'recruiter':
      return {
        canManageUsers: false,
        canManageJobs: true,
        canManageCandidates: true,
        canManageInterviews: true,
        canViewAnalytics: false,
        canApplyToJobs: false,
      };
    case 'candidate':
      return {
        canManageUsers: false,
        canManageJobs: false,
        canManageCandidates: false,
        canManageInterviews: false,
        canViewAnalytics: false,
        canApplyToJobs: true,
      };
    default:
      return {
        canManageUsers: false,
        canManageJobs: false,
        canManageCandidates: false,
        canManageInterviews: false,
        canViewAnalytics: false,
        canApplyToJobs: false,
      };
  }
};
