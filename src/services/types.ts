// Common API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// Paginated API response types
export interface PaginatedApiResponse<T = any> extends ApiResponse<T> {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

// Job related types
export interface Job {
  id: string;
  title: string;
  companyId: string;
  description: string;
  requirements?: string | null;
  responsibilities?: string | null;
  benefits?: string | null;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
  workMode: 'REMOTE' | 'ONSITE' | 'HYBRID';
  experienceLevel: 'ENTRY_LEVEL' | 'MID_LEVEL' | 'SENIOR_LEVEL' | 'EXECUTIVE';
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  minExperience?: number | null;
  maxExperience?: number | null;
  minSalary?: number | null;
  maxSalary?: number | null;
  salaryNegotiable?: boolean;
  skillsRequired?: string[];
  educationLevel?: string | null;
  applicationCount?: number;
  viewCount?: number;
  publishedAt?: string | null;
  closedAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  location?: {
    city?: {
      id?: string;
      name?: string;
      state?: {
        id?: string;
        name?: string;
        code?: string;
        country?: {
          id?: string;
          name?: string;
          code?: string;
        };
      };
    };
  };
  cityName?: string;
  company?: {
    id: string;
    name: string;
    companyId: string; // Format: spear-{code}
    logo?: string | null;
  };
}

export interface CreateJobRequest {
  title: string;
  companyId: string;
  description: string;
  requirements?: string | null;
  responsibilities?: string | null;
  benefits?: string | null;
  minSalary?: number | null;
  maxSalary?: number | null;
  cityId?: number | null;
  skillsRequired?: string[];
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
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phonecode: string;
  capital: string | null;
  currency: string | null;
  currency_name: string | null;
  currency_symbol: string | null;
  tld: string | null;
  native: string | null;
  region: string;
  region_id: number | null;
  subregion: string | null;
  subregion_id: number | null;
  nationality: string;
  latitude: string | null;
  longitude: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCountryRequest {
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phonecode: string;
  capital?: string | null;
  currency?: string | null;
  currency_name?: string | null;
  currency_symbol?: string | null;
  tld?: string | null;
  native?: string | null;
  region: string;
  region_id?: number | null;
  subregion?: string | null;
  subregion_id?: number | null;
  nationality: string;
  latitude?: string | null;
  longitude?: string | null;
  isActive?: boolean;
}

export interface UpdateCountryRequest extends Partial<CreateCountryRequest> {
  id: number;
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
  countryId: number;
  isActive: boolean;
}

export interface UpdateStateRequest extends Partial<CreateStateRequest> {
  id: string;
}

// City related types
export interface City {
  id: string;
  name: string;
  code: string;
  stateId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCityRequest {
  name: string;
  code?: string;
  stateId: number;
  isActive?: boolean;
}

export interface UpdateCityRequest extends Partial<CreateCityRequest> {
  id: string;
}

// Company related types
export interface Company {
  id: string;
  name: string;
  slug: string;
  uuid?: string;
  companyId: string; // Format: spear-{code}
  description?: string;
  website?: string;
  logo?: string;
  industry?: string;
  foundedYear?: number;
  employeeCount?: string;
  headquarters?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyRequest {
  name: string;
  slug?: string; // Optional - auto-generated from UUID if not provided
  description: string;
  website: string;
  logo?: string;
  industry: string;
  foundedYear: number;
  employeeCount: string;
  headquarters: string;
  address: string;
  country?: string;
  state?: string;
  city?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  isVerified?: boolean;
  isActive?: boolean;
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {
  id: string;
}

// User related types
export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  phone: string | null;
  phoneVerified: boolean;
  phoneVerifiedAt: string | null;
  password: string;
  role: 'CANDIDATE' | 'ADMIN' | 'EMPLOYER' | 'SUPER_ADMIN';
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLoginAt: string | null;
  profileCompleted: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  candidate?: {
    firstName: string;
    lastName: string;
  } | null;
}

// User Profile types for profile components
export interface UserProfile {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  designation?: string;
  role?: string;
  location?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

// FAQ related types
export interface FAQ {
  id: number;
  question: string;
  answer: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
  active?: boolean;
}

export interface UpdateFAQRequest extends Partial<CreateFAQRequest> {
  id: string;
  active?: boolean;
}

// Testimonial types
export interface Testimonial {
  id?: string;
  name: string;
  title: string;
  company: string;
  content: string;
  rating: number;
  imageUrl: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTestimonialRequest {
  name: string;
  title: string;
  company: string;
  content: string;
  rating: number;
  imageUrl: string;
  isActive: boolean;
}

export interface UpdateTestimonialRequest extends Partial<CreateTestimonialRequest> {
  id: string;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
