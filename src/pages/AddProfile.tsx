import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { userService } from "../services/userService";
import { imageUploadService } from "../services/imageUploadService";
import { locationService, Country, State, City } from "../services/locationService";
import DatePicker from "../components/form/date-picker";
import { codes } from "currency-codes-ts";

export default function AddProfile() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCvFile, setSelectedCvFile] = useState<File | null>(null);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    // Basic Information
    profilePicture: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    email: "",
    password: "",
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
    referredByEmail: "",
    candidateJoiningDate: "",
    cvResume: "",
    
    // Preferences & Status
    subscribeToJobAlert: "",
    commentsRemarks: "",
    active: "",
    verified: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image immediately
    setIsUploadingImage(true);
    try {
      const imageUrl = await imageUploadService.uploadImage(file, 'profile-pictures');
      setFormData(prev => ({
        ...prev,
        profilePicture: imageUrl
      }));
      toast.success("Profile picture uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload profile picture");
      setSelectedFile(null);
      setImagePreview(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      profilePicture: ""
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCvFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF, DOC, DOCX)
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      toast.error("Please select a valid CV file (PDF, DOC, or DOCX)");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("CV file size should be less than 10MB");
      return;
    }

    setSelectedCvFile(file);

    // Upload CV immediately using document upload endpoint
    setIsUploadingCv(true);
    try {
      const cvUrl = await imageUploadService.uploadDocument(file, 'cv-resumes');
      setFormData(prev => ({
        ...prev,
        cvResume: cvUrl
      }));
      toast.success("CV uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload CV");
      setSelectedCvFile(null);
    } finally {
      setIsUploadingCv(false);
    }
  };

  const handleRemoveCv = () => {
    setSelectedCvFile(null);
    setFormData(prev => ({
      ...prev,
      cvResume: ""
    }));
    if (cvInputRef.current) {
      cvInputRef.current.value = "";
    }
  };

  // Location state management
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [nationalitySearchTerm, setNationalitySearchTerm] = useState("");
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);

  // Fetch countries
  const { data: countriesData } = useQuery({
    queryKey: ['countries'],
    queryFn: () => locationService.getCountries(),
  });

  // Fetch states when country is selected
  const { data: statesData } = useQuery({
    queryKey: ['states', selectedCountryId],
    queryFn: () => locationService.getStatesByCountry(selectedCountryId!),
    enabled: !!selectedCountryId,
  });

  // Fetch cities when state is selected
  const { data: citiesData } = useQuery({
    queryKey: ['cities', selectedStateId],
    queryFn: () => locationService.getCitiesByState(selectedStateId!),
    enabled: !!selectedStateId,
  });

  // Get unique nationalities from countries
  const nationalities = countriesData?.data
    ? Array.from(new Set(
        countriesData.data
          .map((c: Country) => c.nationality)
          .filter((n): n is string => !!n)
      )).sort()
    : [];

  // Filter nationalities based on search term
  const filteredNationalities = nationalities.filter((nat: string) =>
    nat.toLowerCase().includes(nationalitySearchTerm.toLowerCase())
  );

  // Handle country change
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    const country = countriesData?.data?.find((c: Country) => c.name === countryName);
    setSelectedCountryId(country?.id || null);
    setFormData(prev => ({
      ...prev,
      country: countryName,
      state: "",
      city: ""
    }));
    setSelectedStateId(null);
  };

  // Handle state change
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateName = e.target.value;
    const state = statesData?.data?.find((s: State) => s.name === stateName);
    setSelectedStateId(state?.id || null);
    setFormData(prev => ({
      ...prev,
      state: stateName,
      city: ""
    }));
  };

  // Handle city change
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      city: e.target.value
    }));
  };

  const createProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Map form data to API payload
      const userData = {
        email: data.email.trim().toLowerCase(),
        password: data.password,
        phone: data.mobileNumber || undefined,
        role: 'CANDIDATE' as const,
        emailVerified: data.verified === "Yes",
        phoneVerified: data.mobileNumber ? data.verified === "Yes" : false,
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
        profilePicture: data.profilePicture || undefined,
        cvResume: data.cvResume || undefined,
      };

      return userService.createUserWithProfile(userData, candidateData);
    },
    onSuccess: (data) => {
      toast.success("User profile created successfully!");
      navigate("/user-profiles");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || "Failed to create user profile";
      toast.error(errorMessage);
      console.error("Error creating profile:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast.error("Please fill in all required fields (Email, Password, First Name, Last Name)");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    // Note: For admin-created users, password complexity requirements are relaxed
    // (No need for uppercase, lowercase, number, and symbol)

    setIsSubmitting(true);
    try {
      await createProfileMutation.mutateAsync(formData);
    } catch (error) {
      // Error is handled by onError callback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Add User Profiles | spearwin-admin"
        description="Add new user profile"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "User Profiles", path: "/user-profiles" },
              { label: "Add User Profiles" }
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
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-full h-48 object-cover rounded-md border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        disabled={isUploadingImage}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {isUploadingImage && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="w-full px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {isUploadingImage ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload
                        </>
                      )}
                    </button>
                  )}
                  {!imagePreview && (
                    <p className="mt-1 text-xs text-gray-500">JPG, PNG, WEBP up to 5MB</p>
                  )}
                </div>

                {/* CV/Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CV/Resume
                  </label>
                  <input
                    ref={cvInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleCvFileChange}
                    className="hidden"
                    disabled={isUploadingCv}
                  />
                  {selectedCvFile || formData.cvResume ? (
                    <div className="relative">
                      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {selectedCvFile?.name || "CV/Resume uploaded"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(selectedCvFile?.size ? (selectedCvFile.size / 1024 / 1024).toFixed(2) : '0')} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCv}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          disabled={isUploadingCv}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      {isUploadingCv && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => cvInputRef.current?.click()}
                      disabled={isUploadingCv}
                      className="w-full px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {isUploadingCv ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          Upload CV/Resume
                        </>
                      )}
                    </button>
                  )}
                  {!selectedCvFile && !formData.cvResume && (
                    <p className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  )}
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

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
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
                    required
                  />
                </div>

                {/* Date of Birth - Moved near Mobile Number with DatePicker */}
                <div>
                  <DatePicker
                    id="dateOfBirth"
                    label="Date of Birth"
                    placeholder="Select date of birth"
                    defaultDate={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                    onChange={(selectedDates, dateStr) => {
                      setFormData(prev => ({
                        ...prev,
                        dateOfBirth: dateStr || ""
                      }));
                    }}
                  />
                </div>

                {/* Candidate Joining Date - Moved near Mobile Number with DatePicker */}
                <div>
                  <DatePicker
                    id="candidateJoiningDate"
                    label="Candidate Joining Date"
                    placeholder="Select joining date"
                    defaultDate={formData.candidateJoiningDate ? new Date(formData.candidateJoiningDate) : undefined}
                    onChange={(selectedDates, dateStr) => {
                      setFormData(prev => ({
                        ...prev,
                        candidateJoiningDate: dateStr || ""
                      }));
                    }}
                  />
                </div>

                {/* Experience - Dropdown 0-25 */}
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Experience (Years)
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                  >
                    <option value="">Select experience</option>
                    {Array.from({ length: 26 }, (_, i) => (
                      <option key={i} value={i.toString()}>
                        {i} {i === 1 ? 'year' : 'years'}
                      </option>
                    ))}
                  </select>
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

                {/* Notice Period - Dropdown */}
                <div>
                  <label htmlFor="noticePeriod" className="block text-sm font-medium text-gray-700 mb-2">
                    Notice Period
                  </label>
                  <select
                    id="noticePeriod"
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                  >
                    <option value="">Select notice period</option>
                    <option value="Immediate Joiner">Immediate Joiner</option>
                    <option value="15 days">15 days</option>
                    <option value="30 days">30 days</option>
                    <option value="60 days">60 days</option>
                    <option value="90 days">90 days</option>
                  </select>
                </div>

                {/* Offer in Hand */}
                <div>
                  <label htmlFor="offerInHand" className="block text-sm font-medium text-gray-700 mb-2">
                    Offer in Hand
                  </label>
                  <input
                    type="text"
                    id="offerInHand"
                    name="offerInHand"
                    value={formData.offerInHand}
                    onChange={handleInputChange}
                    placeholder="Enter offers"
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

                {/* National ID Card - Commented out */}
                {/* <div>
                  <label htmlFor="nationalIdCard" className="block text-sm font-medium text-gray-700 mb-2">
                    National ID Card#
                  </label>
                  <input
                    type="text"
                    id="nationalIdCard"
                    name="nationalIdCard"
                    value={formData.nationalIdCard}
                    onChange={handleInputChange}
                    placeholder="Enter card no"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div> */}


                {/* Functional Area */}
                <div>
                  <label htmlFor="functionalArea" className="block text-sm font-medium text-gray-700 mb-2">
                    Functional Area
                  </label>
                  <select
                    id="functionalArea"
                    name="functionalArea"
                    value={formData.functionalArea}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                  >
                    <option value="">Select functional area</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                {/* Subscribe to Job Alert - Commented out */}
                {/* <div>
                  <label htmlFor="subscribeToJobAlert" className="block text-sm font-medium text-gray-700 mb-2">
                    Subscribe to Job Alert
                  </label>
                  <select
                    id="subscribeToJobAlert"
                    name="subscribeToJobAlert"
                    value={formData.subscribeToJobAlert}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                  >
                    <option value="">Select job alert</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div> */}

                {/* Comments/Remarks - Commented out */}
                {/* <div>
                  <label htmlFor="commentsRemarks" className="block text-sm font-medium text-gray-700 mb-2">
                    Comments/Remarks
                  </label>
                  <input
                    type="text"
                    id="commentsRemarks"
                    name="commentsRemarks"
                    value={formData.commentsRemarks}
                    onChange={handleInputChange}
                    placeholder="Comments/Remarks"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div> */}

                {/* Salary Currency */}
                <div>
                  <label htmlFor="salaryCurrency" className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Currency
                  </label>
                  <select
                    id="salaryCurrency"
                    name="salaryCurrency"
                    value={formData.salaryCurrency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                  >
                    <option value="">Select currency</option>
                    {codes().map((currencyCode) => (
                      <option key={currencyCode} value={currencyCode}>
                        {currencyCode}
                      </option>
                    ))}
                  </select>
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

                {/* Country, State, City - In Same Row */}
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Country - From Database */}
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleCountryChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                    >
                      <option value="">Select country</option>
                      {countriesData?.data?.map((country: Country) => (
                        <option key={country.id} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* State - From Database */}
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleStateChange}
                      disabled={!selectedCountryId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">{selectedCountryId ? "Select state" : "Select country first"}</option>
                      {statesData?.data?.map((state: State) => (
                        <option key={state.id} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City - From Database */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleCityChange}
                      disabled={!selectedStateId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">{selectedStateId ? "Select city" : "Select state first"}</option>
                      {citiesData?.data?.map((city: City) => (
                        <option key={city.id} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Career Level */}
                <div>
                  <label htmlFor="careerLevel" className="block text-sm font-medium text-gray-700 mb-2">
                    Career Level
                  </label>
                  <select
                    id="careerLevel"
                    name="careerLevel"
                    value={formData.careerLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                  >
                    <option value="">Select level</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Executive">Executive</option>
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

                {/* Referred By */}
                <div>
                  <label htmlFor="referredBy" className="block text-sm font-medium text-gray-700 mb-2">
                    Referred By
                  </label>
                  <select
                    id="referredBy"
                    name="referredBy"
                    value={formData.referredBy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                  >
                    <option value="">Select referral source</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Naukri">Naukri</option>
                    <option value="Person">Person who referred</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Referred By Email - Show when "Person" is selected */}
                {formData.referredBy === "Person" && (
                  <div>
                    <label htmlFor="referredByEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Referrer Email
                    </label>
                    <input
                      type="email"
                      id="referredByEmail"
                      name="referredByEmail"
                      value={formData.referredByEmail}
                      onChange={handleInputChange}
                      placeholder="Enter referrer email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                {/* Active */}
                <div>
                  <label htmlFor="active" className="block text-sm font-medium text-gray-700 mb-2">
                    Active
                  </label>
                  <select
                    id="active"
                    name="active"
                    value={formData.active}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                  >
                    <option value="">Select status</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
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

                {/* Nationality - Type-ahead Dropdown */}
                <div className="relative">
                  <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality
                  </label>
                  <input
                    type="text"
                    id="nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, nationality: e.target.value }));
                      setNationalitySearchTerm(e.target.value);
                      setShowNationalityDropdown(true);
                    }}
                    onFocus={() => setShowNationalityDropdown(true)}
                    onBlur={() => setTimeout(() => setShowNationalityDropdown(false), 200)}
                    placeholder="Type to search nationality"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {showNationalityDropdown && filteredNationalities.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredNationalities.map((nationality: string) => (
                        <div
                          key={nationality}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, nationality }));
                            setNationalitySearchTerm("");
                            setShowNationalityDropdown(false);
                          }}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                        >
                          {nationality}
                        </div>
                      ))}
                    </div>
                  )}
                </div>


                {/* Industry */}
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                  >
                    <option value="">Select industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Manufacturing">Manufacturing</option>
                  </select>
                </div>

                {/* Profile Summary */}
                <div>
                  <label htmlFor="profileSummary" className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Summary
                  </label>
                  <input
                    type="text"
                    id="profileSummary"
                    name="profileSummary"
                    value={formData.profileSummary}
                    onChange={handleInputChange}
                    placeholder="Enter summary"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>


                {/* Verified */}
                <div>
                  <label htmlFor="verified" className="block text-sm font-medium text-gray-700 mb-2">
                    Verified
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
                  disabled={isSubmitting || createProfileMutation.isPending}
                  className="bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {isSubmitting || createProfileMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    "Submit"
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
