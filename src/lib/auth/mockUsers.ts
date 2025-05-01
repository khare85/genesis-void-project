
import { User } from './types';

// Demo users for different roles
export const DEMO_USERS: Record<string, User> = {
  'admin@example.com': {
    id: '1',
    email: 'admin@example.com',
    name: 'Alex Morgan',
    role: 'admin',
    companyId: '1',
    companyName: 'TechCorp Inc.',
    avatarUrl: 'https://i.pravatar.cc/150?u=admin',
  },
  'hm@example.com': {
    id: '2',
    email: 'hm@example.com',
    name: 'Jordan Smith',
    role: 'hiring_manager',
    companyId: '1',
    companyName: 'TechCorp Inc.',
    avatarUrl: 'https://i.pravatar.cc/150?u=hm',
  },
  'recruiter@example.com': {
    id: '3',
    email: 'recruiter@example.com',
    name: 'Taylor Wilson',
    role: 'recruiter',
    companyId: '1',
    companyName: 'TechCorp Inc.',
    avatarUrl: 'https://i.pravatar.cc/150?u=recruiter',
  },
  'candidate@example.com': {
    id: '4',
    email: 'candidate@example.com',
    name: 'Jamie Lee',
    role: 'candidate',
    avatarUrl: 'https://i.pravatar.cc/150?u=candidate',
  },
};

// Check if an email is a demo user
export const isDemoUser = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return Object.keys(DEMO_USERS).includes(email.toLowerCase());
};
