import api from '../utils/axios';

export interface RecentUser {
  id: string;
  email: string;
  role: string;
  status: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  profileCompleted: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  daysSinceRegistration: number;
  isNewUser: boolean;
  hasLoggedIn: boolean;
  lastActivityAt: string | null;
}

export interface DashboardStats {
  todayUsers: number;
  activeUsers: number;
  totalCandidates: number;
  todayJobs: number;
  activeJobs: number;
  totalResumes: number;
  todayResumes: number;
  todayUsersChange: number;
  activeUsersChange: number;
  totalCandidatesChange: number;
  todayJobsChange: number;
  activeJobsChange: number;
  totalResumesChange: number;
  todayResumesChange: number;
}

export interface ApiResponse {
  users: {
    todayUsers: number;
    activeUsers: number;
    totalCandidates: number;
    todayUsersChange: number;
    activeUsersChange: number;
    totalCandidatesChange: number;
  };
  jobs: {
    todayJobs: number;
    activeJobs: number;
    todayJobsChange: number;
    activeJobsChange: number;
  };
  resumes: {
    totalResumes: number;
    todayResumes: number;
    totalResumesChange: number;
    todayResumesChange: number;
  };
}

export interface DashboardData {
  stats: DashboardStats;
  users: RecentUser[];
}

export const dashboardService = {
  // Get dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    const data: ApiResponse = response.data;
    
    // Transform the nested structure to flat structure
    return {
      todayUsers: data.users.todayUsers,
      activeUsers: data.users.activeUsers,
      totalCandidates: data.users.totalCandidates,
      todayJobs: data.jobs.todayJobs,
      activeJobs: data.jobs.activeJobs,
      totalResumes: data.resumes.totalResumes,
      todayResumes: data.resumes.todayResumes,
      todayUsersChange: data.users.todayUsersChange,
      activeUsersChange: data.users.activeUsersChange,
      totalCandidatesChange: data.users.totalCandidatesChange,
      todayJobsChange: data.jobs.todayJobsChange,
      activeJobsChange: data.jobs.activeJobsChange,
      totalResumesChange: data.resumes.totalResumesChange,
      todayResumesChange: data.resumes.todayResumesChange,
    };
  },

  // Get recent users data
  getRecentUsers: async (): Promise<RecentUser[]> => {
    const response = await api.get('/user/recent/stats');
    return response.data.users || [];
  },

  // Get complete dashboard data
  getDashboardData: async (): Promise<DashboardData> => {
    const [statsResponse, usersResponse] = await Promise.all([
      api.get('/dashboard/stats'),
      api.get('/user/recent/stats')
    ]);
    
    const statsData: ApiResponse = statsResponse.data;
    
    // Transform the nested structure to flat structure
    const stats: DashboardStats = {
      todayUsers: statsData.users.todayUsers,
      activeUsers: statsData.users.activeUsers,
      totalCandidates: statsData.users.totalCandidates,
      todayJobs: statsData.jobs.todayJobs,
      activeJobs: statsData.jobs.activeJobs,
      totalResumes: statsData.resumes.totalResumes,
      todayResumes: statsData.resumes.todayResumes,
      todayUsersChange: statsData.users.todayUsersChange,
      activeUsersChange: statsData.users.activeUsersChange,
      totalCandidatesChange: statsData.users.totalCandidatesChange,
      todayJobsChange: statsData.jobs.todayJobsChange,
      activeJobsChange: statsData.jobs.activeJobsChange,
      totalResumesChange: statsData.resumes.totalResumesChange,
      todayResumesChange: statsData.resumes.todayResumesChange,
    };
    
    return {
      stats,
      users: usersResponse.data.users || []
    };
  },
};
