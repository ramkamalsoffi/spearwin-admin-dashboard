import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { companyService } from "../services/companyService";
import { Company } from "../services/types";

interface CompanyViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string | null;
}

export default function CompanyViewDialog({ isOpen, onClose, companyId }: CompanyViewDialogProps) {
  // Fetch company details
  const { data: companyResponse, isLoading: companyLoading } = useQuery({
    queryKey: ['company-details', companyId],
    queryFn: () => companyId ? companyService.getCompanyById(companyId) : Promise.resolve(null),
    enabled: !!companyId && isOpen,
  });

  // Handle different response structures from the API
  const company = (companyResponse?.data || companyResponse) as Company;

  if (!isOpen) return null;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Company Details</h2>
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
          {companyLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading company details...</span>
            </div>
          ) : (company && company.id) ? (
            <div className="space-y-6">
              {/* Company Logo and Basic Info */}
              <div className="flex items-start gap-6">
                {company.logo && (
                  <img 
                    src={company.logo} 
                    alt={company.name}
                    className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{company.name}</h3>
                  <p className="text-lg font-mono text-gray-600 mt-1">{company.companyId || 'N/A'}</p>
                  {company.industry && (
                    <p className="text-sm text-gray-500 mt-2">{company.industry}</p>
                  )}
                </div>
              </div>

              {/* Company Information Grid */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Company ID</label>
                  <p className="mt-1 text-base text-gray-900 font-mono">{company.companyId || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Slug</label>
                  <p className="mt-1 text-base text-gray-900 font-mono">{company.slug || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">UUID</label>
                  <p className="mt-1 text-base text-gray-900 font-mono">{(company as any).uuid || company.slug || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">City</label>
                  <p className="mt-1 text-base text-gray-900">{company.city || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">State</label>
                  <p className="mt-1 text-base text-gray-900">{company.state || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Country</label>
                  <p className="mt-1 text-base text-gray-900">{company.country || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Website</label>
                  <p className="mt-1 text-base text-gray-900">
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {company.website}
                      </a>
                    ) : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Industry</label>
                  <p className="mt-1 text-base text-gray-900">{company.industry || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Employee Count</label>
                  <p className="mt-1 text-base text-gray-900">{company.employeeCount || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Headquarters</label>
                  <p className="mt-1 text-base text-gray-900">{company.headquarters || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Founded Year</label>
                  <p className="mt-1 text-base text-gray-900">{company.foundedYear || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="mt-1 text-base text-gray-900">{company.address || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="mt-1 text-base text-gray-900">
                    {[company.city, company.state, company.country].filter(Boolean).join(', ') || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      company.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {company.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Verified</label>
                  <p className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      company.isVerified 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {company.isVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Social Links */}
              {(company.linkedinUrl || company.twitterUrl || company.facebookUrl) && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Social Links</label>
                  <div className="mt-2 flex flex-wrap gap-4">
                    {company.linkedinUrl && (
                      <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                        LinkedIn
                      </a>
                    )}
                    {company.twitterUrl && (
                      <a href={company.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">
                        Twitter
                      </a>
                    )}
                    {company.facebookUrl && (
                      <a href={company.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:underline text-sm">
                        Facebook
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {company.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="mt-1 text-base text-gray-700 whitespace-pre-wrap">{company.description}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created At</label>
                  <p className="mt-1 text-sm text-gray-600">{formatDate(company.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Updated At</label>
                  <p className="mt-1 text-sm text-gray-600">{formatDate(company.updatedAt)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No company data available</h3>
              <p className="mt-1 text-sm text-gray-500">Unable to load company details. Please try again.</p>
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

