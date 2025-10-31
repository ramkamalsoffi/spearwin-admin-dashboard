import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import api from "../utils/axios";

export default function EditAdminUser() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    role: "",
    status: "",
  });

  // Normalize ID
  const normalizedId = id ? String(id).trim() : null;

  // Fetch admin user data by ID
  const { data: adminResponse, isLoading, error } = useQuery({
    queryKey: ['admin', normalizedId],
    queryFn: async () => {
      if (!normalizedId) throw new Error('Admin ID is required');
      const response = await api.get(`/api/admin/admins/${normalizedId}`);
      return response.data;
    },
    enabled: !!normalizedId,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // Reset form when ID changes
  useEffect(() => {
    if (normalizedId) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        role: "",
        status: "",
      });
    }
  }, [normalizedId]);

  // Populate form when admin data is loaded
  useEffect(() => {
    if (adminResponse) {
      const admin = adminResponse;
      
      setFormData({
        firstName: admin.firstName || "",
        lastName: admin.lastName || "",
        email: admin.user?.email || "",
        phone: admin.user?.phone || "",
        department: admin.department || "",
        designation: admin.designation || "",
        role: admin.user?.role || "",
        status: admin.user?.status || "",
      });
    }
  }, [adminResponse]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update admin mutation
  const updateAdminMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!normalizedId) throw new Error('Admin ID is missing');
      
      // Prepare update payload according to UpdateAdminProfileDto
      const updateData: any = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim() || undefined,
        department: data.department.trim() || undefined,
        designation: data.designation.trim() || undefined,
      };

      // Use PUT endpoint to update admin by adminId
      const response = await api.put(`/api/admin/admins/${normalizedId}/profile`, updateData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Admin user updated successfully!");
      setTimeout(() => {
        navigate("/admin-users");
      }, 1000);
    },
    onError: (error: any) => {
      console.error("Error updating admin:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update admin user";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    
    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateAdminMutation.mutateAsync(formData);
    } catch (error) {
      // Error is handled by onError callback
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          <span className="text-gray-600">Loading admin user...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Admin User</h2>
          <p className="text-gray-600 mb-4">Failed to load admin user data</p>
          <button
            onClick={() => navigate("/admin-users")}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Back to Admin Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Edit Admin User | spearwin-admin"
        description="Edit admin user"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Admin Users", path: "/admin-users" },
              { label: "Edit Admin User" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-30 py-2">
        {/* Form Card */}
        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
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

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Department */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Enter department"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Designation */}
                <div>
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="Enter designation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Role (Read-only) */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>

                {/* Status (Read-only) */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <input
                    type="text"
                    id="status"
                    name="status"
                    value={formData.status}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="mt-8 flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting || updateAdminMutation.isPending}
                  className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {isSubmitting || updateAdminMutation.isPending ? "Updating..." : "Update Admin User"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin-users")}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
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

