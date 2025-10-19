import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { countryService } from "../services/countryService";
import { Country } from "../services/types";

export default function Countries() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch countries from API
  const { data: countriesResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['countries'],
    queryFn: () => countryService.getCountries(),
  });

  // Handle error
  if (error) {
    const errorMessage = (error as any).response?.data?.message || "Failed to fetch countries";
    toast.error(errorMessage);
    console.error("Error fetching countries:", error);
  }

  const countries = countriesResponse?.data || [];
  const totalCountries = countries.length;
  const countriesPerPage = 10;
  const totalPages = Math.ceil(totalCountries / countriesPerPage);

  // Filter countries based on search term
  const filteredCountries = countries.filter((country: Country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.iso2.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (country: Country) => {
    navigate(`/edit-country/${country.id}`);
  };

  const handleDelete = (country: Country) => {
    if (window.confirm(`Are you sure you want to delete ${country.name}?`)) {
      // TODO: Implement delete functionality
      toast.success(`Country ${country.name} deleted successfully`);
    }
  };

  const handleRefresh = () => {
    console.log("Refresh Countries data");
    refetch();
  };

  return (
    <>
      <PageMeta
        title="Countries | Spearwin Admin Dashboard"
        description="Manage countries in the Spearwin admin dashboard"
      />
      <PageBreadcrumb items={[{ label: "Countries" }]} />

      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-brand-500"
            >
              Refresh
            </button>
            <button
              onClick={() => navigate('/add-country')}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 focus:ring-2 focus:ring-brand-500"
            >
              Add Country
            </button>
          </div>
        </div>

        {/* Countries Table */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
              <span className="ml-2 text-gray-600">Loading countries...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCountries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        No countries found
                      </td>
                    </tr>
                  ) : (
                    filteredCountries
                      .slice((currentPage - 1) * countriesPerPage, currentPage * countriesPerPage)
                      .map((country: Country) => (
                        <tr key={country.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {country.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{country.name}</div>
                                <div className="text-sm text-gray-500">{country.nationality}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {country.iso2}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              country.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {country.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEdit(country)}
                              className="text-brand-600 hover:text-brand-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(country)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * countriesPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * countriesPerPage, filteredCountries.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredCountries.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
