/**
 * Application-wide constants
 */

export const APP_NAME = 'InterviewAI';
export const APP_DESCRIPTION = 'AI-powered mock interview platform to practice, improve, and land your dream job.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Experience levels
export const EXPERIENCE_LEVELS = [
  { value: 'junior', label: 'Junior (0-2 years)' },
  { value: 'mid', label: 'Mid-Level (2-5 years)' },
  { value: 'senior', label: 'Senior (5-10 years)' },
  { value: 'lead', label: 'Lead/Principal (10+ years)' },
];

// Interview types
export const INTERVIEW_TYPES = [
  { value: 'hr', label: 'HR Interview', description: 'Culture fit, motivation, and soft skills' },
  { value: 'technical', label: 'Technical Interview', description: 'Coding, system design, and technical knowledge' },
  { value: 'behavioral', label: 'Behavioral Interview', description: 'Past experiences and situational responses' },
];

// Interview modes
export const INTERVIEW_MODES = [
  { value: 'text', label: 'Text Mode', description: 'Type your answers' },
  { value: 'voice', label: 'Voice Mode', description: 'Speak your answers' },
];

// Subscription plans
export const PLANS = {
  FREE: 'free',
  PRO: 'pro',
};
// How many questions the AI asks before generating the final report
export const QUESTIONS_PER_INTERVIEW = 6;
export const PLAN_LIMITS = {
  [PLANS.FREE]: {
    interviewsPerMonth: 5,
    voiceProvider: 'browser',
    analytics: 'basic',
  },
  [PLANS.PRO]: {
    interviewsPerMonth: Infinity,
    voiceProvider: 'premium',
    analytics: 'advanced',
  },
};

// User roles
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Common skills
export const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'Python', 'Java', 'C++', 'Go', 'Rust',
  'SQL', 'MongoDB', 'PostgreSQL', 'Redis',
  'AWS', 'Docker', 'Kubernetes', 'CI/CD',
  'System Design', 'Data Structures', 'Algorithms',
  'REST API', 'GraphQL', 'Microservices',
  'Git', 'Agile', 'Leadership', 'Communication',
];

// Navigation items
export const DASHBOARD_NAV = [
  { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { title: 'Interviews', href: '/dashboard/interviews', icon: 'MessageSquare' },
  { title: 'Analytics', href: '/dashboard/analytics', icon: 'BarChart3' },
  { title: 'Profile', href: '/dashboard/profile', icon: 'User' },
  { title: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
];

export const ADMIN_NAV = [
  { title: 'Users', href: '/dashboard/admin/users', icon: 'Users' },
  { title: 'System', href: '/dashboard/admin/system', icon: 'Monitor' },
];

// Rate limit configurations
export const RATE_LIMITS = {
  AUTH: { requests: 5, window: '60s' },
  API: { requests: 30, window: '60s' },
  GENERAL: { requests: 100, window: '60s' },
  AI: { requests: 20, window: '60s' },
};

// OTP expiry (15 minutes in milliseconds)
export const OTP_EXPIRY_MS = 15 * 60 * 1000;

// Session max age (30 days in seconds)
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

// Default avatar
export const DEFAULT_AVATAR = 'https://api.dicebear.com/8.x/initials/svg?seed=User&backgroundColor=6366f1';