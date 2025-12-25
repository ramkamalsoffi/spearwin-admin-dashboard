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
  verifiedUsers: number;
  todayJobs: number;
  activeJobs: number;
  totalResumes: number;
  todayResumes: number;
  todayUsersChange: number;
  activeUsersChange: number;
  verifiedUsersChange: number;
  todayJobsChange: number;
  activeJobsChange: number;
  totalResumesChange: number;
  todayResumesChange: number;
}

export interface ApiResponse {
  users: {
    todayUsers: number;
    activeUsers: number;
    verifiedUsers: number;
    todayUsersChange: number;
    activeUsersChange: number;
    verifiedUsersChange: number;
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
      verifiedUsers: data.users.verifiedUsers,
      todayJobs: data.jobs.todayJobs,
      activeJobs: data.jobs.activeJobs,
      totalResumes: data.resumes.totalResumes,
      todayResumes: data.resumes.todayResumes,
      todayUsersChange: data.users.todayUsersChange,
      activeUsersChange: data.users.activeUsersChange,
      verifiedUsersChange: data.users.verifiedUsersChange,
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
      verifiedUsers: statsData.users.verifiedUsers,
      todayJobs: statsData.jobs.todayJobs,
      activeJobs: statsData.jobs.activeJobs,
      totalResumes: statsData.resumes.totalResumes,
      todayResumes: statsData.resumes.todayResumes,
      todayUsersChange: statsData.users.todayUsersChange,
      activeUsersChange: statsData.users.activeUsersChange,
      verifiedUsersChange: statsData.users.verifiedUsersChange,
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
