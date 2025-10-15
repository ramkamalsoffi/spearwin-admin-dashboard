// Common API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// Job related types
export interface Job {
  id: string;
  title: string;
  companyId: string;
  description: string;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
  workMode: 'REMOTE' | 'ONSITE' | 'HYBRID';
  experienceLevel: 'ENTRY_LEVEL' | 'MID_LEVEL' | 'SENIOR_LEVEL' | 'EXECUTIVE';
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobRequest {
  title: string;
  companyId: string;
  description: string;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
  workMode: 'REMOTE' | 'ONSITE' | 'HYBRID';
  experienceLevel: 'ENTRY_LEVEL' | 'MID_LEVEL' | 'SENIOR_LEVEL' | 'EXECUTIVE';
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {
  id: string;
}

// Country related types
export interface Country {
  id: string;
  name: string;
  code: string;
  language: string;
  nationality: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCountryRequest {
  name: string;
  code: string;
  isActive: boolean;
}

export interface UpdateCountryRequest extends Partial<CreateCountryRequest> {
  id: string;
}

// Admin related types
export interface Admin {
  id: string;
  email: string;
  role: string;
  status: string;
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
  lastLoginAt: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: Admin;
}

// States related types
export interface State {
  id: string;
  name: string;
  code: string;
  countryId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStateRequest {
  name: string;
  code: string;
  countryId: string;
  isActive: boolean;
}

export interface UpdateStateRequest extends Partial<CreateStateRequest> {
  id: string;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
