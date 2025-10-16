import api from './api';

export interface CreateJobDto {
  title: string;
  description: string;
  companyId: string;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
  workMode: 'REMOTE' | 'ONSITE' | 'HYBRID';
  experienceLevel: 'ENTRY_LEVEL' | 'MID_LEVEL' | 'SENIOR_LEVEL' | 'EXECUTIVE';
  status?: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
}

export interface Job {
  id: number;
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  jobDescription: string;
  status: 'Active' | 'Pending' | 'Inactive';
  createdAt?: string;
  updatedAt?: string;
}

// Jobs API functions
export const jobsApi = {
  // Create new job
  createJob: async (jobData: CreateJobDto): Promise<Job> => {
    console.log('Creating job with data:', jobData);
    console.log('API URL:', api.defaults.baseURL + '/api/admin/jobs');
    const response = await api.post('/api/admin/jobs', jobData);
    console.log('Job created successfully:', response.data);
    return response.data;
  },
};
