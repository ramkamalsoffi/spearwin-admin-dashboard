import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { adminService } from "../../services/adminService";
import { userService } from "../../services/userService";
import { imageUploadService } from "../../services/imageUploadService";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import CandidateViewDialog from "../CandidateViewDialog";

interface UserProfileCardProps {
  userId?: string; // Optional userId prop - if not provided, will use current user
}

export default function UserProfileCard({ userId }: UserProfileCardProps) {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const targetUserId = userId || currentUser?.id;

  // Single modal for all profile editing
  const editModal = useModal();
  // Modal for viewing candidate details
  const viewModal = useModal();

  // Fetch user profile data
  const { data: userData, isLoading, error, refetch } = useQuery({
    queryKey: ['user-profile', targetUserId],
    queryFn: async () => {
      if (!targetUserId) {
        throw new Error("User ID is required");
      }
      const response = await userService.getUserById(targetUserId);
      return response;
    },
    enabled: !!targetUserId,
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Transform API data to component format
  const user = userData?.data || userData;
  const candidate = user?.candidate || {};
  const admin = user?.admin || {};
  const superAdmin = user?.superAdmin || {};
  
  // Use useMemo to prevent unnecessary recalculations - depend on userData to update when refetched
  const userProfile = useMemo(() => {
    const currentUser = userData?.data || userData;
    const currentCandidate = currentUser?.candidate || {};
    const currentAdmin = currentUser?.admin || {};
    const currentSuperAdmin = currentUser?.superAdmin || {};
    
    // Determine which profile type we're working with
    const profile = currentCandidate?.id ? currentCandidate : (currentAdmin?.id ? currentAdmin : currentSuperAdmin);
    const isAdmin = !!currentAdmin?.id || !!currentSuperAdmin?.id;
    
    return {
      id: currentUser?.id || profile?.userId,
      firstName: profile?.firstName || currentUser?.firstName,
      lastName: profile?.lastName || currentUser?.lastName,
      email: profile?.email || currentAdmin?.email || currentSuperAdmin?.email || currentUser?.email,
      phone: profile?.phone || currentAdmin?.phone || currentSuperAdmin?.phone || currentUser?.phone,
      avatar: currentCandidate?.profilePicture || currentCandidate?.profilePictures?.[0]?.filePath || 
              currentAdmin?.profileImage || currentSuperAdmin?.profileImage,
      designation: currentCandidate?.currentTitle || currentAdmin?.designation || currentSuperAdmin?.designation,
      role: currentUser?.role,
      location: currentCandidate?.cityName || currentCandidate?.city?.name || currentCandidate?.currentLocation ||
               currentAdmin?.city || currentSuperAdmin?.city,
      bio: profile?.bio || currentAdmin?.bio || currentSuperAdmin?.bio,
      socialLinks: {
        linkedin: currentCandidate?.linkedinUrl || currentAdmin?.linkedinUrl || currentSuperAdmin?.linkedinUrl,
        twitter: currentCandidate?.twitterUrl || currentAdmin?.twitterUrl || currentSuperAdmin?.twitterUrl,
        facebook: currentCandidate?.facebookUrl || currentAdmin?.facebookUrl || currentSuperAdmin?.facebookUrl,
        instagram: currentCandidate?.instagramUrl || currentAdmin?.instagramUrl || currentSuperAdmin?.instagramUrl,
      },
      country: currentCandidate?.country || currentCandidate?.city?.state?.country?.name ||
               currentAdmin?.country || currentSuperAdmin?.country,
      state: currentCandidate?.state || currentCandidate?.city?.state?.name ||
             currentAdmin?.state || currentSuperAdmin?.state,
      cityName: currentCandidate?.cityName || currentCandidate?.city?.name ||
                currentAdmin?.city || currentSuperAdmin?.city,
      address: currentCandidate?.address,
      streetAddress: currentCandidate?.streetAddress || currentAdmin?.streetAddress || currentSuperAdmin?.streetAddress,
      department: currentAdmin?.department,
    };
  }, [userData]);

  // Form states
  const [metaFormData, setMetaFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    linkedinUrl: "",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    profileImage: "",
  });

  // Profile image upload state
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [addressFormData, setAddressFormData] = useState({
    country: "",
    state: "",
    cityName: "",
    address: "",
    streetAddress: "",
  });

  // Track last loaded user ID to prevent overwriting user input
  const [lastLoadedUserId, setLastLoadedUserId] = useState<string | null>(null);

  // Update form data when user data changes (only when a new user is loaded or data is first fetched)
  useEffect(() => {
    if (!userData || isLoading) return;
    
    // Extract user, candidate, and admin inside effect
    const currentUser = userData?.data || userData;
    const currentCandidate = currentUser?.candidate || {};
    const currentAdmin = currentUser?.admin || {};
    const currentSuperAdmin = currentUser?.superAdmin || {};
    const profile = currentCandidate?.id ? currentCandidate : (currentAdmin?.id ? currentAdmin : currentSuperAdmin);
    const currentUserId = currentUser?.id || profile?.userId;
    
    if (currentUserId && currentUserId !== lastLoadedUserId) {
      setMetaFormData({
        firstName: profile?.firstName || currentUser?.firstName || "",
        lastName: profile?.lastName || currentUser?.lastName || "",
        email: profile?.email || currentAdmin?.email || currentSuperAdmin?.email || currentUser?.email || "",
        phone: profile?.phone || currentAdmin?.phone || currentSuperAdmin?.phone || currentUser?.phone || "",
        bio: profile?.bio || currentAdmin?.bio || currentSuperAdmin?.bio || "",
        linkedinUrl: currentCandidate?.linkedinUrl || currentAdmin?.linkedinUrl || currentSuperAdmin?.linkedinUrl || "",
        facebookUrl: currentCandidate?.facebookUrl || currentAdmin?.facebookUrl || currentSuperAdmin?.facebookUrl || "",
        twitterUrl: currentCandidate?.twitterUrl || currentAdmin?.twitterUrl || currentSuperAdmin?.twitterUrl || "",
        instagramUrl: currentCandidate?.instagramUrl || currentAdmin?.instagramUrl || currentSuperAdmin?.instagramUrl || "",
        profileImage: currentCandidate?.profilePicture || currentAdmin?.profileImage || currentSuperAdmin?.profileImage || "",
      });

      // Set profile image preview
      const profileImageUrl = currentCandidate?.profilePicture || currentAdmin?.profileImage || currentSuperAdmin?.profileImage;
      setProfileImagePreview(profileImageUrl || null);

      setAddressFormData({
        country: currentCandidate?.country || currentCandidate?.city?.state?.country?.name ||
                 currentAdmin?.country || currentSuperAdmin?.country || "",
        state: currentCandidate?.state || currentCandidate?.city?.state?.name ||
               currentAdmin?.state || currentSuperAdmin?.state || "",
        cityName: currentCandidate?.cityName || currentCandidate?.city?.name ||
                  currentAdmin?.city || currentSuperAdmin?.city || "",
        address: currentCandidate?.address || "",
        streetAddress: currentCandidate?.streetAddress || currentAdmin?.streetAddress || currentSuperAdmin?.streetAddress || "",
      });

      setLastLoadedUserId(currentUserId);
    }
  }, [userData, isLoading, lastLoadedUserId]);

  // Mutation for uploading profile image
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      return imageUploadService.uploadImage(file, 'profile-images');
    },
    onSuccess: (imageUrl) => {
      setMetaFormData(prev => ({ ...prev, profileImage: imageUrl }));
      setProfileImagePreview(imageUrl);
      toast.success("Profile image uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to upload profile image");
    },
  });

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof metaFormData | typeof addressFormData) => {
      if (!targetUserId) {
        throw new Error("User ID is required");
      }
      return adminService.updateUserProfile(targetUserId, data);
    },
    onSuccess: async () => {
      toast.success("Profile updated successfully");
      editModal.closeModal();
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['user-profile', targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
      
      // Refetch the user profile data immediately to show updated values
      await refetch();
      
      // Reset lastLoadedUserId to allow form to update with new data
      setLastLoadedUserId(null);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update profile";
      toast.error(errorMessage);
      console.error("Error updating profile:", error);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

      setProfileImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload image immediately
      setIsUploadingImage(true);
      uploadImageMutation.mutate(file, {
        onSettled: () => {
          setIsUploadingImage(false);
        },
      });
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!targetUserId) {
      toast.error("User ID is required");
      return;
    }

    // If there's a new image file but upload hasn't completed, wait for it
    if (profileImageFile && isUploadingImage) {
      toast.error("Please wait for image upload to complete");
      return;
    }

    // Combine all form data into one payload
    const combinedData = {
      ...metaFormData,
      ...addressFormData,
    };
    
    updateProfileMutation.mutate(combinedData);
  };

  const handleMetaInputChange = (field: keyof typeof metaFormData, value: string) => {
    setMetaFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressInputChange = (field: keyof typeof addressFormData, value: string) => {
    setAddressFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper functions
  const getAvatarUrl = () => {
    // Use preview if available (for immediate feedback)
    if (profileImagePreview) return profileImagePreview;
    if (!userProfile) return "/images/user/owner.jpg";
    if (userProfile.avatar) return userProfile.avatar;
    return "/images/user/owner.jpg";
  };

  const getLocation = () => {
    if (!userProfile) return "Not set";
    if (userProfile.location) return userProfile.location;
    if (userProfile.cityName && userProfile.state) {
      return `${userProfile.cityName}, ${userProfile.state}`;
    }
    return userProfile.cityName || userProfile.state || "Not set";
  };

  const getDisplayValue = (field: 'country' | 'state' | 'city' | 'address') => {
    if (!userProfile) return "Not set";
    switch (field) {
      case 'country':
        return userProfile.country || "Not set";
      case 'state':
        return userProfile.state || "Not set";
      case 'city':
        return userProfile.cityName || "Not set";
      case 'address':
        return userProfile.address || userProfile.streetAddress || "Not set";
      default:
        return "Not set";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-2">Error loading profile</p>
        <p className="text-sm text-gray-500">{(error as any)?.message || "Please try again later"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Meta Card - Profile Picture, Name, Social Links */}
      <div className="p-5 border border-blue-200 rounded-2xl lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-blue-200 rounded-full">
              <img 
                src={getAvatarUrl()} 
                alt={userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : "user"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (e.currentTarget.src !== "/images/user/owner.jpg") {
                    e.currentTarget.src = "/images/user/owner.jpg";
                  }
                }}
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-blue-900 xl:text-left">
                {userProfile ? `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() || "Loading..." : "Loading..."}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-blue-700">
                  {userProfile?.designation || userProfile?.role || "Not set"}
                </p>
                <div className="hidden h-3.5 w-px bg-blue-300 xl:block"></div>
                <p className="text-sm text-blue-700">
                  {getLocation()}
                </p>
              </div>
            </div>
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              <a
                href={userProfile?.socialLinks?.facebook || "#"}
                target="_blank"
                rel="noopener"
                className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-blue-300 bg-white text-sm font-medium text-blue-700 shadow-theme-xs hover:bg-blue-50 hover:text-blue-900"
              >
                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.6666 11.2503H13.7499L14.5833 7.91699H11.6666V6.25033C11.6666 5.39251 11.6666 4.58366 13.3333 4.58366H14.5833V1.78374C14.3118 1.7477 13.2858 1.66699 12.2023 1.66699C9.94025 1.66699 8.33325 3.04771 8.33325 5.58342V7.91699H5.83325V11.2503H8.33325V18.3337H11.6666V11.2503Z" fill="" />
                </svg>
              </a>
              <a
                href={userProfile?.socialLinks?.twitter || "#"}
                target="_blank"
                rel="noopener"
                className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-blue-300 bg-white text-sm font-medium text-blue-700 shadow-theme-xs hover:bg-blue-50 hover:text-blue-900"
              >
                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.1708 1.875H17.9274L11.9049 8.75833L18.9899 18.125H13.4424L9.09742 12.4442L4.12578 18.125H1.36745L7.80912 10.7625L1.01245 1.875H6.70078L10.6283 7.0675L15.1708 1.875ZM14.2033 16.475H15.7308L5.87078 3.43833H4.23162L14.2033 16.475Z" fill="" />
                </svg>
              </a>
              <a
                href={userProfile?.socialLinks?.linkedin || "#"}
                target="_blank"
                rel="noopener"
                className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-blue-300 bg-white text-sm font-medium text-blue-700 shadow-theme-xs hover:bg-blue-50 hover:text-blue-900"
              >
                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z" fill="" />
                </svg>
              </a>
              <a
                href={userProfile?.socialLinks?.instagram || "#"}
                target="_blank"
                rel="noopener"
                className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-blue-300 bg-white text-sm font-medium text-blue-700 shadow-theme-xs hover:bg-blue-50 hover:text-blue-900"
              >
                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.8567 1.66699C11.7946 1.66854 12.2698 1.67351 12.6805 1.68573L12.8422 1.69102C13.0291 1.69766 13.2134 1.70599 13.4357 1.71641C14.3224 1.75738 14.9273 1.89766 15.4586 2.10391C16.0078 2.31572 16.4717 2.60183 16.9349 3.06503C17.3974 3.52822 17.6836 3.99349 17.8961 4.54141C18.1016 5.07197 18.2419 5.67753 18.2836 6.56433C18.2935 6.78655 18.3015 6.97088 18.3081 7.15775L18.3133 7.31949C18.3255 7.73011 18.3311 8.20543 18.3328 9.1433L18.3335 9.76463C18.3336 9.84055 18.3336 9.91888 18.3336 9.99972L18.3335 10.2348L18.333 10.8562C18.3314 11.794 18.3265 12.2694 18.3142 12.68L18.3089 12.8417C18.3023 13.0286 18.294 13.213 18.2836 13.4351C18.2426 14.322 18.1016 14.9268 17.8961 15.458C17.6842 16.0074 17.3974 16.4713 16.9349 16.9345C16.4717 17.397 16.0057 17.6831 15.4586 17.8955C14.9273 18.1011 14.3224 18.2414 13.4357 18.2831C13.2134 18.293 13.0291 18.3011 12.8422 18.3076L12.6805 18.3128C12.2698 18.3251 11.7946 18.3306 10.8567 18.3324L10.2353 18.333C10.1594 18.333 10.0811 18.333 10.0002 18.333H9.76516L9.14375 18.3325C8.20591 18.331 7.7306 18.326 7.31997 18.3137L7.15824 18.3085C6.97136 18.3018 6.78703 18.2935 6.56481 18.2831C5.67801 18.2421 5.07384 18.1011 4.5419 17.8955C3.99328 17.6838 3.5287 17.397 3.06551 16.9345C2.60231 16.4713 2.3169 16.0053 2.1044 15.458C1.89815 14.9268 1.75856 14.322 1.7169 13.4351C1.707 13.213 1.69892 13.0286 1.69238 12.8417L1.68714 12.68C1.67495 12.2694 1.66939 11.794 1.66759 10.8562L1.66748 9.1433C1.66903 8.20543 1.67399 7.73011 1.68621 7.31949L1.69151 7.15775C1.69815 6.97088 1.70648 6.78655 1.7169 6.56433C1.75786 5.67683 1.89815 5.07266 2.1044 4.54141C2.3162 3.9928 2.60231 3.52822 3.06551 3.06503C3.5287 2.60183 3.99398 2.31641 4.5419 2.10391C5.07315 1.89766 5.67731 1.75808 6.56481 1.71641C6.78703 1.70652 6.97136 1.69844 7.15824 1.6919L7.31997 1.68666C7.7306 1.67446 8.20591 1.6689 9.14375 1.6671L10.8567 1.66699ZM10.0002 5.83308C7.69781 5.83308 5.83356 7.69935 5.83356 9.99972C5.83356 12.3021 7.69984 14.1664 10.0002 14.1664C12.3027 14.1664 14.1669 12.3001 14.1669 9.99972C14.1669 7.69732 12.3006 5.83308 10.0002 5.83308ZM10.0002 7.49974C11.381 7.49974 12.5002 8.61863 12.5002 9.99972C12.5002 11.3805 11.3813 12.4997 10.0002 12.4997C8.6195 12.4997 7.50023 11.3809 7.50023 9.99972C7.50023 8.61897 8.61908 7.49974 10.0002 7.49974ZM14.3752 4.58308C13.8008 4.58308 13.3336 5.04967 13.3336 5.62403C13.3336 6.19841 13.8002 6.66572 14.3752 6.66572C14.9496 6.66572 15.4169 6.19913 15.4169 5.62403C15.4169 5.04967 14.9488 4.58236 14.3752 4.58308Z" fill="" />
                </svg>
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {candidate?.id && (
              <button
                onClick={viewModal.openModal}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-blue-300 bg-white px-4 py-3 text-sm font-medium text-blue-700 shadow-theme-xs hover:bg-blue-50 hover:text-blue-900 lg:inline-flex lg:w-auto"
                title="View Candidate Details"
              >
                <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 3C5 3 2.73 5.11 1 8.5C2.73 11.89 5 14 9 14C13 14 15.27 11.89 17 8.5C15.27 5.11 13 3 9 3ZM9 12.5C6.24 12.5 4 10.26 4 7.5C4 4.74 6.24 2.5 9 2.5C11.76 2.5 14 4.74 14 7.5C14 10.26 11.76 12.5 9 12.5ZM9 4.5C7.07 4.5 5.5 6.07 5.5 8C5.5 9.93 7.07 11.5 9 11.5C10.93 11.5 12.5 9.93 12.5 8C12.5 6.07 10.93 4.5 9 4.5Z" fill="currentColor"/>
                </svg>
                View Details
              </button>
            )}
            <button
              onClick={editModal.openModal}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-blue-300 bg-white px-4 py-3 text-sm font-medium text-blue-700 shadow-theme-xs hover:bg-blue-50 hover:text-blue-900 lg:inline-flex lg:w-auto"
            >
              <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" fill="" />
              </svg>
              Edit Profile
            </button>
          </div>   
        </div>
      </div>

      {/* Info Card - Personal Information */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">First Name</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {userProfile?.firstName || "Not set"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Last Name</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {userProfile?.lastName || "Not set"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Email address</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {userProfile?.email || "Not set"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {userProfile?.phone || "Not set"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Bio</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {userProfile?.bio || "Not set"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Card */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">Address</h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Country</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{getDisplayValue('country')}</p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">State</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{getDisplayValue('state')}</p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">City</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{getDisplayValue('city')}</p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Street Address</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{getDisplayValue('address')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Edit Modal */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.closeModal} className="max-w-[800px] m-4">
        <div className="no-scrollbar relative w-full max-w-[800px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Edit Profile</h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">Update your details to keep your profile up-to-date.</p>
          </div>
          <form className="flex flex-col" onSubmit={handleSave}>
            <div className="custom-scrollbar max-h-[600px] overflow-y-auto px-2 pb-3">
              {/* Profile Image Upload Section */}
              <div className="mb-6">
                <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">Profile Photo</h5>
                <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center">
                  <div className="relative">
                    <div className="w-24 h-24 overflow-hidden border-2 border-gray-300 rounded-full">
                      <img
                        src={profileImagePreview || getAvatarUrl()}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          if (e.currentTarget.src !== "/images/user/owner.jpg") {
                            e.currentTarget.src = "/images/user/owner.jpg";
                          }
                        }}
                      />
                    </div>
                    {isUploadingImage && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label>Upload Profile Photo</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isUploadingImage}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        file:cursor-pointer
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      JPG, PNG or GIF. Max size 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="mb-6">
                <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">Personal Information</h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>First Name</Label>
                    <Input type="text" value={metaFormData.firstName} onChange={(e) => handleMetaInputChange("firstName", e.target.value)} />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input type="text" value={metaFormData.lastName} onChange={(e) => handleMetaInputChange("lastName", e.target.value)} />
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <Input type="email" value={metaFormData.email} onChange={(e) => handleMetaInputChange("email", e.target.value)} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input type="tel" value={metaFormData.phone} onChange={(e) => handleMetaInputChange("phone", e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <Label>Bio</Label>
                    <Input type="text" value={metaFormData.bio} onChange={(e) => handleMetaInputChange("bio", e.target.value)} placeholder="Tell us about yourself..." />
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="mb-6">
                <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">Address Information</h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Country</Label>
                    <Input type="text" value={addressFormData.country} onChange={(e) => handleAddressInputChange("country", e.target.value)} placeholder="Enter country name" />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input type="text" value={addressFormData.state} onChange={(e) => handleAddressInputChange("state", e.target.value)} placeholder="Enter state name" />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input type="text" value={addressFormData.cityName} onChange={(e) => handleAddressInputChange("cityName", e.target.value)} placeholder="Enter city name" />
                  </div>
                  <div>
                    <Label>Street Address</Label>
                    <Input type="text" value={addressFormData.streetAddress} onChange={(e) => handleAddressInputChange("streetAddress", e.target.value)} placeholder="Enter street address" />
                  </div>
                  <div className="col-span-2">
                    <Label>Address (Full)</Label>
                    <Input type="text" value={addressFormData.address} onChange={(e) => handleAddressInputChange("address", e.target.value)} placeholder="Enter full address" />
                  </div>
                </div>
              </div>

              {/* Social Media Links Section */}
              <div className="mb-6">
                <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">Social Media Links</h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>LinkedIn</Label>
                    <Input type="url" value={metaFormData.linkedinUrl} onChange={(e) => handleMetaInputChange("linkedinUrl", e.target.value)} placeholder="https://www.linkedin.com/in/yourprofile" />
                  </div>
                  <div>
                    <Label>Facebook</Label>
                    <Input type="url" value={metaFormData.facebookUrl} onChange={(e) => handleMetaInputChange("facebookUrl", e.target.value)} placeholder="https://www.facebook.com/yourprofile" />
                  </div>
                  <div>
                    <Label>X.com (Twitter)</Label>
                    <Input type="url" value={metaFormData.twitterUrl} onChange={(e) => handleMetaInputChange("twitterUrl", e.target.value)} placeholder="https://x.com/yourprofile" />
                  </div>
                  <div>
                    <Label>Instagram</Label>
                    <Input type="url" value={metaFormData.instagramUrl} onChange={(e) => handleMetaInputChange("instagramUrl", e.target.value)} placeholder="https://instagram.com/yourprofile" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={editModal.closeModal} disabled={updateProfileMutation.isPending}>Close</Button>
              <Button size="sm" onClick={handleSave} disabled={updateProfileMutation.isPending || !targetUserId}>
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Candidate View Dialog */}
      <CandidateViewDialog
        isOpen={viewModal.isOpen}
        onClose={viewModal.closeModal}
        userId={targetUserId || null}
      />
    </div>
  );
}

