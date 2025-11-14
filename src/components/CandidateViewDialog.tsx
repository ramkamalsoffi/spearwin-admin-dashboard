import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/userService";

interface CandidateViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

interface CandidateData {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  fatherName?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  profilePicture?: string;
  bio?: string;
  currentTitle?: string;
  currentCompany?: string;
  currentLocation?: string;
  preferredLocation?: string;
  noticePeriod?: string;
  currentSalary?: number;
  expectedSalary?: number;
  profileType?: string;
  experienceYears?: number;
  address?: string;
  streetAddress?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  isAvailable?: boolean;
  offerInHand?: string;
  salaryCurrency?: string;
  nationality?: string;
  careerLevel?: string;
  functionalArea?: string;
  industry?: string;
  referredBy?: string;
  referredByEmail?: string;
  candidateJoiningDate?: string;
  active?: string;
  cvResume?: string;
  city?: {
    id: number;
    name: string;
    state?: {
      id: number;
      name: string;
      country?: {
        id: number;
        name: string;
      };
    };
  };
  skills?: Array<{
    id: string;
    skillName?: string;
    skill?: string;
    level?: string;
    proficiency?: string;
    yearsUsed?: number;
  }>;
  education?: Array<{
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    level?: string;
    startDate?: Date | string;
    endDate?: Date | string;
    startYear?: number;
    endYear?: number;
    isCompleted?: boolean;
    grade?: string;
    description?: string;
  }>;
  experience?: Array<{
    id: string;
    company: string;
    position?: string;
    title?: string;
    description?: string;
    startDate?: Date | string;
    endDate?: Date | string;
    isCurrent?: boolean;
    isCompleted?: boolean;
    location?: string;
    achievements?: string;
  }>;
  resumes?: Array<{
    id: string;
    title?: string;
    fileName: string;
    filePath?: string;
    fileUrl?: string;
    fileSize?: number;
    mimeType?: string;
    isDefault?: boolean;
    uploadedAt?: Date | string;
  }>;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export default function CandidateViewDialog({ isOpen, onClose, userId }: CandidateViewDialogProps) {
  // Fetch user data with candidate profile - enhanced to get all relations
  const { data: userResponse, isLoading: userLoading } = useQuery({
    queryKey: ['candidate-view', userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await userService.getUserById(userId);
      return response;
    },
    enabled: !!userId && isOpen,
  });

  if (!isOpen) return null;

  // Extract candidate data from user response
  const userData = userResponse?.data || userResponse;
  const candidate = userData?.candidate || {};

  // Build comprehensive candidate data from user response
  // Include all fields from the candidate object and nested relations
  const candidateData: CandidateData = {
    id: candidate.id || userData?.id || '',
    userId: userId || candidate.userId || userData?.id || '',
    firstName: candidate.firstName || '',
    lastName: candidate.lastName || '',
    email: userData?.email || candidate.email || '',
    phone: userData?.phone || candidate.phone || candidate.mobileNumber || '',
    fatherName: candidate.fatherName,
    dateOfBirth: candidate.dateOfBirth,
    gender: candidate.gender,
    maritalStatus: candidate.maritalStatus,
    profilePicture: candidate.profilePicture || candidate.profilePictures?.[0]?.filePath,
    bio: candidate.bio || candidate.profileSummary,
    currentTitle: candidate.currentTitle,
    currentCompany: candidate.currentCompany,
    currentLocation: candidate.currentLocation,
    preferredLocation: candidate.preferredLocation,
    noticePeriod: candidate.noticePeriod,
    currentSalary: candidate.currentSalary ? (typeof candidate.currentSalary === 'string' ? parseFloat(candidate.currentSalary) : candidate.currentSalary) : undefined,
    expectedSalary: candidate.expectedSalary ? (typeof candidate.expectedSalary === 'string' ? parseFloat(candidate.expectedSalary) : candidate.expectedSalary) : undefined,
    profileType: candidate.profileType,
    experienceYears: candidate.experienceYears,
    address: candidate.address,
    streetAddress: candidate.streetAddress,
    linkedinUrl: candidate.linkedinUrl,
    githubUrl: candidate.githubUrl,
    portfolioUrl: candidate.portfolioUrl,
    twitterUrl: candidate.twitterUrl,
    facebookUrl: candidate.facebookUrl,
    instagramUrl: candidate.instagramUrl,
    isAvailable: candidate.isAvailable,
    offerInHand: (candidate as any).offerInHand,
    salaryCurrency: (candidate as any).salaryCurrency,
    nationality: candidate.country || candidate.city?.state?.country?.name || candidate.nationality,
    careerLevel: (candidate as any).careerLevel,
    functionalArea: (candidate as any).functionalArea,
    industry: (candidate as any).industry,
    referredBy: (candidate as any).referredBy,
    referredByEmail: (candidate as any).referredByEmail,
    candidateJoiningDate: (candidate as any).candidateJoiningDate,
    active: (userData as any)?.status === 'ACTIVE' ? 'Yes' : 'No',
    cvResume: candidate.resumes?.[0]?.filePath || candidate.resumes?.[0]?.fileUrl || (candidate as any).cvResume,
    city: candidate.city,
    // Include all skills, education, experience, and resumes from the candidate object
    skills: candidate.skills || [],
    education: candidate.education || [],
    experience: candidate.experience || [],
    resumes: candidate.resumes || [],
    createdAt: candidate.createdAt || userData?.createdAt,
    updatedAt: candidate.updatedAt || userData?.updatedAt,
  };

  const isLoading = userLoading;

  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Candidate Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading candidate details...</span>
            </div>
          ) : candidateData.id ? (
            <div className="space-y-6">
              {/* Profile Picture and Basic Info */}
              <div className="flex items-start gap-6">
                {candidateData.profilePicture && (
                  <img 
                    src={candidateData.profilePicture} 
                    alt={`${candidateData.firstName} ${candidateData.lastName}`}
                    className="w-24 h-24 rounded-full object-cover border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/user/owner.jpg";
                    }}
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {candidateData.firstName} {candidateData.lastName}
                  </h3>
                  {candidateData.currentTitle && (
                    <p className="text-lg text-gray-600 mt-1">{candidateData.currentTitle}</p>
                  )}
                  {candidateData.currentCompany && (
                    <p className="text-sm text-gray-500 mt-1">{candidateData.currentCompany}</p>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">First Name</label>
                    <p className="mt-1 text-base text-gray-900">{candidateData.firstName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Name</label>
                    <p className="mt-1 text-base text-gray-900">{candidateData.lastName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-base text-gray-900">{candidateData.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="mt-1 text-base text-gray-900">{candidateData.phone || 'N/A'}</p>
                  </div>
                  {candidateData.fatherName && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Father Name</label>
                      <p className="mt-1 text-base text-gray-900">{candidateData.fatherName}</p>
                    </div>
                  )}
                  {candidateData.dateOfBirth && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="mt-1 text-base text-gray-900">{formatDate(candidateData.dateOfBirth)}</p>
                    </div>
                  )}
                  {candidateData.gender && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      <p className="mt-1 text-base text-gray-900">{candidateData.gender}</p>
                    </div>
                  )}
                  {candidateData.maritalStatus && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Marital Status</label>
                      <p className="mt-1 text-base text-gray-900">{candidateData.maritalStatus}</p>
                    </div>
                  )}
                </div>
                {candidateData.bio && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-500">Bio</label>
                    <p className="mt-1 text-base text-gray-700 whitespace-pre-wrap">{candidateData.bio}</p>
                  </div>
                )}
              </div>

              {/* Career Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Career Information</h4>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {candidateData.currentTitle && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Current Title</label>
                      <p className="mt-1 text-base text-gray-900">{candidateData.currentTitle}</p>
                    </div>
                  )}
                  {candidateData.currentCompany && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Current Company</label>
                      <p className="mt-1 text-base text-gray-900">{candidateData.currentCompany}</p>
                    </div>
                  )}
                  {candidateData.currentLocation && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Current Location</label>
                      <p className="mt-1 text-base text-gray-900">{candidateData.currentLocation}</p>
                    </div>
                  )}
                  {candidateData.preferredLocation && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Preferred Location</label>
                      <p className="mt-1 text-base text-gray-900">{candidateData.preferredLocation}</p>
                    </div>
                  )}
                  {candidateData.noticePeriod && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Notice Period</label>
                      <p className="mt-1 text-base text-gray-900">{candidateData.noticePeriod}</p>
                    </div>
                  )}
                  {candidateData.experienceYears !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Experience (Years)</label>
                      <p className="mt-1 text-base text-gray-900">{candidateData.experienceYears}</p>
                    </div>
                  )}
                  {candidateData.currentSalary !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Current Salary</label>
                      <p className="mt-1 text-base text-gray-900">{formatCurrency(candidateData.currentSalary)}</p>
                    </div>
                  )}
                  {candidateData.expectedSalary !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Expected Salary</label>
                      <p className="mt-1 text-base text-gray-900">{formatCurrency(candidateData.expectedSalary)}</p>
                    </div>
                  )}
                  {candidateData.profileType && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Profile Type</label>
                      <p className="mt-1 text-base text-gray-900">{candidateData.profileType}</p>
                    </div>
                  )}
                  {candidateData.offerInHand && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Offer in Hand</label>
                      <p className="mt-1 text-base text-gray-900">{candidateData.offerInHand}</p>
                    </div>
                  )}
                  {candidateData.salaryCurrency && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Salary Currency</label>
                      <p className="mt-1 text-base text-gray-900">{candidateData.salaryCurrency}</p>
                    </div>
                  )}
                  {candidateData.careerLevel && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Career Level</label>
                      <p className="mt-1 text-base text-gray-900">{candidateData.careerLevel}</p>
                    </div>
                  )}
                  {candidateData.functionalArea && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Functional Area</label>
                      <p className="mt-1 text-base text-gray-900">{candidateData.functionalArea}</p>
                    </div>
                  )}
                  {candidateData.industry && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Industry</label>
                      <p className="mt-1 text-base text-gray-900">{candidateData.industry}</p>
                    </div>
                  )}
                  {candidateData.referredBy && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Referred By</label>
                      <p className="mt-1 text-base text-gray-900">{candidateData.referredBy}</p>
                    </div>
                  )}
                  {candidateData.referredByEmail && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Referrer Email</label>
                      <p className="mt-1 text-base text-gray-900">{candidateData.referredByEmail}</p>
                    </div>
                  )}
                  {candidateData.candidateJoiningDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Candidate Joining Date</label>
                      <p className="mt-1 text-base text-gray-900">{formatDate(candidateData.candidateJoiningDate)}</p>
                    </div>
                  )}
                  {candidateData.active && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Active Status</label>
                      <p className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          candidateData.active === 'Yes'
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {candidateData.active}
                        </span>
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Availability</label>
                    <p className="mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        candidateData.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {candidateData.isAvailable ? 'Available' : 'Not Available'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              {(candidateData.address || candidateData.streetAddress || candidateData.city || candidateData.nationality) && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h4>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {candidateData.nationality && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nationality</label>
                        <p className="mt-1 text-base text-gray-900">{candidateData.nationality}</p>
                      </div>
                    )}
                    {candidateData.city?.state?.country && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Country</label>
                        <p className="mt-1 text-base text-gray-900">{candidateData.city.state.country.name}</p>
                      </div>
                    )}
                    {candidateData.city?.state && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">State</label>
                        <p className="mt-1 text-base text-gray-900">{candidateData.city.state.name}</p>
                      </div>
                    )}
                    {candidateData.city && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">City</label>
                        <p className="mt-1 text-base text-gray-900">{candidateData.city.name}</p>
                      </div>
                    )}
                    {candidateData.streetAddress && (
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-500">Street Address</label>
                        <p className="mt-1 text-base text-gray-900">{candidateData.streetAddress}</p>
                      </div>
                    )}
                    {candidateData.address && (
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <p className="mt-1 text-base text-gray-900">{candidateData.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(candidateData.linkedinUrl || candidateData.githubUrl || candidateData.portfolioUrl || 
                candidateData.twitterUrl || candidateData.facebookUrl || candidateData.instagramUrl) && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Social Links</h4>
                  <div className="flex flex-wrap gap-4">
                    {candidateData.linkedinUrl && (
                      <a href={candidateData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                        LinkedIn
                      </a>
                    )}
                    {candidateData.githubUrl && (
                      <a href={candidateData.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline text-sm">
                        GitHub
                      </a>
                    )}
                    {candidateData.portfolioUrl && (
                      <a href={candidateData.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline text-sm">
                        Portfolio
                      </a>
                    )}
                    {candidateData.twitterUrl && (
                      <a href={candidateData.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">
                        Twitter
                      </a>
                    )}
                    {candidateData.facebookUrl && (
                      <a href={candidateData.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:underline text-sm">
                        Facebook
                      </a>
                    )}
                    {candidateData.instagramUrl && (
                      <a href={candidateData.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline text-sm">
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Skills */}
              {candidateData.skills && candidateData.skills.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Skills ({candidateData.skills.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidateData.skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="inline-flex flex-col px-3 py-2 text-sm font-medium rounded-lg bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        <span>{skill.skillName || skill.skill || 'N/A'}</span>
                        {(skill.level || skill.proficiency || skill.yearsUsed) && (
                          <span className="text-xs text-blue-600 mt-1">
                            {skill.level && `Level: ${skill.level}`}
                            {skill.proficiency && `Proficiency: ${skill.proficiency}`}
                            {skill.yearsUsed && `Years: ${skill.yearsUsed}`}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {candidateData.education && candidateData.education.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Education ({candidateData.education.length})</h4>
                  <div className="space-y-4">
                    {candidateData.education.map((edu) => (
                      <div key={edu.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 text-lg">{edu.degree || 'N/A'}</h5>
                            <p className="text-sm text-gray-600 mt-1 font-medium">{edu.institution || 'N/A'}</p>
                            {edu.fieldOfStudy && (
                              <p className="text-sm text-gray-500 mt-1">Field of Study: {edu.fieldOfStudy}</p>
                            )}
                            {edu.level && (
                              <p className="text-sm text-gray-500 mt-1">Level: {edu.level}</p>
                            )}
                            {edu.description && (
                              <p className="text-sm text-gray-700 mt-2">{edu.description}</p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            {edu.startYear && edu.endYear && (
                              <p className="text-sm text-gray-500 font-medium">{edu.startYear} - {edu.endYear}</p>
                            )}
                            {edu.startDate && (
                              <p className="text-sm text-gray-500">
                                {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : (edu.isCompleted ? 'Completed' : 'Present')}
                              </p>
                            )}
                            {edu.grade && (
                              <p className="text-sm text-gray-500 mt-1">Grade: {edu.grade}</p>
                            )}
                            {edu.isCompleted !== undefined && (
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                                edu.isCompleted 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {edu.isCompleted ? 'Completed' : 'In Progress'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {candidateData.experience && candidateData.experience.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Work Experience ({candidateData.experience.length})</h4>
                  <div className="space-y-4">
                    {candidateData.experience.map((exp) => (
                      <div key={exp.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 text-lg">{exp.position || exp.title || 'N/A'}</h5>
                            <p className="text-sm text-gray-600 mt-1 font-medium">{exp.company || 'N/A'}</p>
                            {exp.location && (
                              <p className="text-sm text-gray-500 mt-1">📍 {exp.location}</p>
                            )}
                            {exp.description && (
                              <p className="text-sm text-gray-700 mt-3 leading-relaxed">{exp.description}</p>
                            )}
                            {exp.achievements && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700 mb-1">Key Achievements:</p>
                                <p className="text-sm text-gray-600 leading-relaxed">{exp.achievements}</p>
                              </div>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            {exp.startDate && (
                              <p className="text-sm text-gray-500 font-medium">
                                {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : (exp.isCurrent || exp.isCompleted === false ? 'Present' : 'N/A')}
                              </p>
                            )}
                            {(exp.isCurrent || exp.isCompleted === false) && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 mt-2">
                                Current
                              </span>
                            )}
                            {exp.isCompleted && exp.isCurrent !== true && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 mt-2">
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resumes */}
              {(candidateData.resumes && candidateData.resumes.length > 0) || candidateData.cvResume ? (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Resumes & CVs {candidateData.resumes && `(${candidateData.resumes.length + (candidateData.cvResume ? 1 : 0)})`}
                  </h4>
                  <div className="space-y-3">
                    {candidateData.cvResume && (
                      <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 flex-1">
                          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">CV/Resume</p>
                            <p className="text-sm text-gray-500 mt-1">Uploaded CV/Resume File</p>
                          </div>
                        </div>
                        <a
                          href={candidateData.cvResume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          View/Download
                        </a>
                      </div>
                    )}
                    {candidateData.resumes && candidateData.resumes.map((resume) => (
                      <div key={resume.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 flex-1">
                          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{resume.title || resume.fileName || 'Resume'}</p>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                              {resume.uploadedAt && (
                                <span>Uploaded: {formatDate(resume.uploadedAt)}</span>
                              )}
                              {resume.fileSize && (
                                <span>Size: {(resume.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                              )}
                              {resume.mimeType && (
                                <span>Type: {resume.mimeType}</span>
                              )}
                              {resume.isDefault && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Default</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {(resume.filePath || resume.fileUrl) && (
                            <a
                              href={resume.filePath || resume.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              View/Download
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Timestamps */}
              {(candidateData.createdAt || candidateData.updatedAt) && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  {candidateData.createdAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created At</label>
                      <p className="mt-1 text-sm text-gray-600">{formatDate(candidateData.createdAt)}</p>
                    </div>
                  )}
                  {candidateData.updatedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Updated At</label>
                      <p className="mt-1 text-sm text-gray-600">{formatDate(candidateData.updatedAt)}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No candidate data available</h3>
              <p className="mt-1 text-sm text-gray-500">Unable to load candidate details. Please try again.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

