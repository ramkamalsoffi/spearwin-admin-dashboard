import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | spearwin-admin"
        description="Spearwin Admin Dashboard"
      />
      
      {/* Title Bar */}
      <div className="mb-4 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {/* Today User */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-start">
              <div className="flex-1 w-3/4">
                <p className="text-sm font-medium text-gray-600 mb-1">Today User</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">15645</p>
                
              </div>
                <div className="w-12 flex justify-end">
                  <div className="w-12 h-12 bg-blue-100 rounded-[20px] flex items-center justify-center">
                   <img src="/images/dashboard/blue-icon.png" alt="user" className="w-8 h-6" />
                  </div>
                </div>
            </div>
            <div className="flex items-center ">
                  <span className="text-xs text-green-600 font-medium">↗ 8.5% Up from yesterday</span>
                </div>
          </div>

          {/* Active User */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-start">
              <div className="flex-1 w-3/4">
                <p className="text-sm font-medium text-gray-600 mb-1">Active User</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">10293</p>
                
              </div>
                <div className="w-12 flex justify-end">
                  <div className="w-12 h-12 bg-yellow-100 rounded-[20px] flex items-center justify-center">
                    <img src="/images/dashboard/orange-icon.png" alt="active user" className="w-8 h-6" />
                  </div>
                </div>
            </div>
            <div className="flex items-center">
                  <span className="text-xs text-green-600 font-medium">↗ 1.3% Up from past week</span>
                </div>
          </div>

          {/* Verified Users */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-start">
              <div className="flex-1 w-3/4">
                <p className="text-sm font-medium text-gray-600 mb-1">Verified Users</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">$89,000</p>
               
              </div>
                <div className="w-12 flex justify-end">
                  <div className="w-12 h-12 bg-green-100 rounded-[20px] flex items-center justify-center">
                    <img src="/images/dashboard/green-icon.png" alt="verified users" className="w-8 h-6" />
                  </div>
                </div>
            </div>
            <div className="flex items-center">
                  <span className="text-xs text-red-600 font-medium">↘ 4.3% Down from yesterday</span>
                </div>
          </div>

          {/* Todays Job */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-start">
              <div className="flex-1 w-3/4">
                <p className="text-sm font-medium text-gray-600 mb-1">Todays Job</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">2040</p>
                
              </div>
                <div className="w-12 flex justify-end">
                  <div className="w-12 h-12 bg-orange-100 rounded-[20px] flex items-center justify-center">
                    <img src="/images/dashboard/orange-index.png" alt="todays job" className="w-7 h-6" />
                  </div>
                </div>
            </div>
            <div className="flex items-center">
                  <span className="text-xs text-green-600 font-medium">↗ 1.8% Up from yesterday</span>
                </div>
          </div>

          {/* Active Jobs */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-start">
              <div className="flex-1 w-3/4">
                <p className="text-sm font-medium text-gray-600 mb-1">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">2040</p>
                
              </div>
                <div className="w-12 flex justify-end">
                  <div className="w-12 h-12 bg-blue-100 rounded-[20px] flex items-center justify-center">
                    <img src="/images/dashboard/blue-inndex.png" alt="active jobs" className="w-7 h-6" />
                  </div>
                </div>
            </div>
            <div className="flex items-center">
                  <span className="text-xs text-green-600 font-medium">↗ 1.8% Up from yesterday</span>
                </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
          {/* Recent Users Table */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            </div>
            <div className="overflow-x-auto">
              <Table className="w-full min-w-[600px]">
                <TableHeader>
                  <TableRow className="bg-muted/30 bg-gray-100">
                    <TableCell isHeader className="rounded-l-xl px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      <div className="flex items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-4 mr-2 sm:mr-3" />
                        <span>User Name</span>
                      </div>
                    </TableCell>
                    <TableCell isHeader className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Email</TableCell>
                    <TableCell isHeader className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</TableCell>
                    <TableCell isHeader className="rounded-r-xl px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Date</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full mr-2 sm:mr-3">
                        <img src="/images/dashboard/profile-1.png" alt="todays job" className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Alfredo Vetrovs</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">sample@gmail.com</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">+91 9876543210</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">12.09.2025</td>
                  </tr>
                  <tr>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full mr-2 sm:mr-3">
                        <img src="/images/dashboard/profile-1.png" alt="todays job" className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Charlie Ekstrom</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">sample@gmail.com</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">+91 9876543210</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">12.09.2025</td>
                  </tr>
                  <tr>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full mr-2 sm:mr-3">
                        <img src="/images/dashboard/profile-1.png" alt="todays job" className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Carla Westervelt</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">sample@gmail.com</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">+91 9876543210</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">12.09.2025</td>
                  </tr>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Recent Job Table */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Job</h3>
            </div>
            <div className="overflow-x-auto">
              <Table className="w-full min-w-[480px]">
                <TableHeader>
                  <TableRow className="bg-muted/30 bg-gray-100">
                    <TableCell isHeader className="rounded-l-xl px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Name</TableCell>
                    <TableCell isHeader className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</TableCell>
                    <TableCell isHeader className="rounded-r-xl px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200 ">
                  <tr>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Technical Consultant</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">Banglore</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">12.09.2025</td>
                  </tr>
                  <tr>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Technical Consultant</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">Banglore</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">12.09.2025</td>
                  </tr>
                  <tr>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Technical Consultant</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">Banglore</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">12.09.2025</td>
                  </tr>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}