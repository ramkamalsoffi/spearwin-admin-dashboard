import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { userService } from "../services/userService";

export default function EditProfile() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    profilePicture: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    mobileNumber: "",
    
    // Professional Information
    experience: "",
    currentCompany: "",
    currentLocation: "",
    preferredLocation: "",
    noticePeriod: "",
    offerInHand: "",
    expectedSalary: "",
    currentSalary: "",
    salaryCurrency: "",
    profileType: "",
    
    // Location & Address
    nationality: "",
    country: "",
    state: "",
    city: "",
    streetAddress: "",
    nationalIdCard: "",
    
    // Career Information
    careerLevel: "",
    functionalArea: "",
    industry: "",
    profileSummary: "",
    referredBy: "",
    candidateJoiningDate: "",
    
    // Preferences & Status
    subscribeToJobAlert: "",
    commentsRemarks: "",
    active: "",
    verified: "",
    emailVerified: false,
    phoneVerified: false,
  });

  // Normalize ID and ensure it's ready
  const normalizedId = id ? String(id).trim() : null;

  // Fetch user data by ID
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['user', normalizedId],
    queryFn: async () => {
      if (!normalizedId) throw new Error('User ID is required');
      console.log('Fetching user with ID:', normalizedId);
      return await userService.getUserById(normalizedId);
    },
    enabled: !!normalizedId,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // Reset form when ID changes
  useEffect(() => {
    if (normalizedId) {
      setFormData({
        profilePicture: "",
        firstName: "",
        lastName: "",
        fatherName: "",
        email: "",
        dateOfBirth: "",
        gender: "",
        maritalStatus: "",
        mobileNumber: "",
        experience: "",
        currentCompany: "",
        currentLocation: "",
        preferredLocation: "",
        noticePeriod: "",
        offerInHand: "",
        expectedSalary: "",
        currentSalary: "",
        salaryCurrency: "",
        profileType: "",
        nationality: "",
        country: "",
        state: "",
        city: "",
        streetAddress: "",
        nationalIdCard: "",
        careerLevel: "",
        functionalArea: "",
        industry: "",
        profileSummary: "",
        referredBy: "",
        candidateJoiningDate: "",
        subscribeToJobAlert: "",
        commentsRemarks: "",
        active: "",
        verified: "",
        emailVerified: false,
        phoneVerified: false,
      });
    }
  }, [normalizedId]);

  // Populate form when user data is loaded
  useEffect(() => {
    if (userData && normalizedId) {
      const candidate = userData.candidate || {};
      const user = userData;
      
      setFormData({
        profilePicture: candidate.profilePicture || "",
        firstName: candidate.firstName || "",
        lastName: candidate.lastName || "",
        fatherName: candidate.fatherName || "",
        email: user.email || "",
        dateOfBirth: candidate.dateOfBirth ? new Date(candidate.dateOfBirth).toISOString().split('T')[0] : "",
        gender: candidate.gender || "",
        maritalStatus: candidate.maritalStatus || "",
        mobileNumber: candidate.mobileNumber || user.phone || "",
        experience: candidate.experienceYears?.toString() || candidate.jobExperience || "",
        currentCompany: candidate.currentCompany || "",
        currentLocation: candidate.currentLocation || "",
        preferredLocation: candidate.preferredLocation || "",
        noticePeriod: candidate.noticePeriod || "",
        offerInHand: "",
        expectedSalary: candidate.expectedSalary?.toString() || "",
        currentSalary: candidate.currentSalary?.toString() || "",
        salaryCurrency: "",
        profileType: candidate.profileType || "",
        nationality: candidate.country || "",
        country: candidate.country || "",
        state: candidate.state || "",
        city: candidate.cityName || "",
        streetAddress: candidate.streetAddress || candidate.address || "",
        nationalIdCard: "",
        careerLevel: "",
        functionalArea: "",
        industry: "",
        profileSummary: candidate.profileSummary || candidate.bio || "",
        referredBy: "",
        candidateJoiningDate: "",
        subscribeToJobAlert: "",
        commentsRemarks: "",
        active: user.status === 'ACTIVE' ? "Yes" : "No",
        verified: user.emailVerified ? "Yes" : "No",
        emailVerified: user.emailVerified || false,
        phoneVerified: user.phoneVerified || false,
      });
    }
  }, [userData, normalizedId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'verified' && { emailVerified: value === "Yes", phoneVerified: value === "Yes" }),
    }));
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!normalizedId) throw new Error('User ID is required');

      // Map form data to API payload
      const userData = {
        email: data.email.trim().toLowerCase(),
        phone: data.mobileNumber || undefined,
        emailVerified: data.emailVerified,
        phoneVerified: data.phoneVerified,
      };

      const candidateData = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        fatherName: data.fatherName?.trim() || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
        gender: data.gender || undefined,
        maritalStatus: data.maritalStatus || undefined,
        bio: data.profileSummary?.trim() || undefined,
        profileSummary: data.profileSummary?.trim() || undefined,
        currentTitle: data.experience?.trim() || undefined,
        currentCompany: data.currentCompany?.trim() || undefined,
        currentLocation: data.currentLocation?.trim() || undefined,
        preferredLocation: data.preferredLocation || undefined,
        noticePeriod: data.noticePeriod?.trim() || undefined,
        currentSalary: data.currentSalary ? (typeof data.currentSalary === 'string' ? parseFloat(data.currentSalary) || undefined : data.currentSalary) : undefined,
        expectedSalary: data.expectedSalary ? (typeof data.expectedSalary === 'string' ? parseFloat(data.expectedSalary) || undefined : data.expectedSalary) : undefined,
        profileType: data.profileType || undefined,
        experienceYears: data.experience ? (typeof data.experience === 'string' ? parseFloat(data.experience) || undefined : data.experience) : undefined,
        cityName: data.city || undefined,
        country: data.country || undefined,
        state: data.state || undefined,
        streetAddress: data.streetAddress?.trim() || undefined,
        mobileNumber: data.mobileNumber?.trim() || undefined,
        jobExperience: data.experience?.trim() || undefined,
      };

      return userService.updateUserWithProfile(normalizedId, userData, candidateData);
    },
    onSuccess: (data) => {
      toast.success("User profile updated successfully!");
      navigate("/user-profiles");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || "Failed to update user profile";
      if (Array.isArray(errorMessage)) {
        toast.error(errorMessage.join(", "));
      } else {
        toast.error(errorMessage);
      }
      console.error("Error updating profile:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast.error("Please fill in all required fields (Email, First Name, Last Name)");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfileMutation.mutateAsync(formData);
    } catch (error) {
      // Error is handled by onError callback
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <PageMeta
          title="Edit User Profile | spearwin-admin"
          description="Edit user profile"
        />
        <div className="px-4 sm:px-6 lg:px-30 py-4">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600">Loading user profile...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <PageMeta
          title="Edit User Profile | spearwin-admin"
          description="Edit user profile"
        />
        <div className="px-4 sm:px-6 lg:px-30 py-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load user profile</h3>
              <p className="mt-1 text-sm text-gray-500">{(error as any).message || "An unknown error occurred."}</p>
              <button
                onClick={() => navigate("/user-profiles")}
                className="mt-4 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Back to User Profiles
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Edit User Profile | spearwin-admin"
        description="Edit user profile"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "User Profiles", path: "/user-profiles" },
              { label: "Edit User Profile" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-30 py-4">
        {/* Form Card */}
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Profile Picture */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <button
                    type="button"
                    className="w-full px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload
                  </button>
                </div>

                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Father Name */}
                <div>
                  <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-2">
                    Father Name
                  </label>
                  <input
                    type="text"
                    id="fatherName"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Marital Status */}
                <div>
                  <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                  >
                    <option value="">Select status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="Enter number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Experience (Years)
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="Enter experience"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Current Company */}
                <div>
                  <label htmlFor="currentCompany" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Company
                  </label>
                  <input
                    type="text"
                    id="currentCompany"
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={handleInputChange}
                    placeholder="Enter Company"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Current Location */}
                <div>
                  <label htmlFor="currentLocation" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Location
                  </label>
                  <input
                    type="text"
                    id="currentLocation"
                    name="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleInputChange}
                    placeholder="Enter location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Preferred Location */}
                <div>
                  <label htmlFor="preferredLocation" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Location
                  </label>
                  <select
                    id="preferredLocation"
                    name="preferredLocation"
                    value={formData.preferredLocation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                  >
                    <option value="">Select location</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>

                {/* Notice Period */}
                <div>
                  <label htmlFor="noticePeriod" className="block text-sm font-medium text-gray-700 mb-2">
                    Notice Period
                  </label>
                  <input
                    type="text"
                    id="noticePeriod"
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleInputChange}
                    placeholder="Enter notice period"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Expected Salary */}
                <div>
                  <label htmlFor="expectedSalary" className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Salary (LPA)
                  </label>
                  <input
                    type="text"
                    id="expectedSalary"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleInputChange}
                    placeholder="Enter LPA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                  >
                    <option value="">Select city</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                  >
                    <option value="">Select country</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                {/* State */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                  >
                    <option value="">Select state</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                  </select>
                </div>

                {/* Street Address */}
                <div>
                  <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="streetAddress"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    placeholder="Enter address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Current Salary */}
                <div>
                  <label htmlFor="currentSalary" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Salary (LPA)
                  </label>
                  <input
                    type="text"
                    id="currentSalary"
                    name="currentSalary"
                    value={formData.currentSalary}
                    onChange={handleInputChange}
                    placeholder="Enter LPA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Profile Type */}
                <div>
                  <label htmlFor="profileType" className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Type
                  </label>
                  <select
                    id="profileType"
                    name="profileType"
                    value={formData.profileType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                {/* Profile Summary */}
                <div>
                  <label htmlFor="profileSummary" className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Summary
                  </label>
                  <textarea
                    id="profileSummary"
                    name="profileSummary"
                    value={formData.profileSummary}
                    onChange={handleInputChange}
                    placeholder="Enter summary"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Verified */}
                <div>
                  <label htmlFor="verified" className="block text-sm font-medium text-gray-700 mb-2">
                    Email & Phone Verified
                  </label>
                  <select
                    id="verified"
                    name="verified"
                    value={formData.verified}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                  >
                    <option value="">Select status</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

              </div>

              {/* Submit Button */}
              <div className="mt-8 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting || updateProfileMutation.isPending}
                  className="bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {isSubmitting || updateProfileMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    "Update Profile"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/user-profiles")}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

