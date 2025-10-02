import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | Spearwin Admin"
        description="Spearwin Admin Dashboard"
      />
      
      {/* Title Bar */}
      <div className="px-30 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-30 py-4">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Today User */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Today User</p>
                <p className="text-2xl font-bold text-gray-900">15645</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-green-600 font-medium">↗ 8.5%</span>
                  <span className="text-xs text-gray-500 ml-1">Up from yesterday</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                {/* Icon placeholder - you can replace this */}
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
              </div>
            </div>
          </div>

          {/* Active User */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active User</p>
                <p className="text-2xl font-bold text-gray-900">10293</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-green-600 font-medium">↗ 1.3%</span>
                  <span className="text-xs text-gray-500 ml-1">Up from past week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                {/* Icon placeholder - you can replace this */}
                <div className="w-6 h-6 bg-yellow-500 rounded"></div>
              </div>
            </div>
          </div>

          {/* Verified Users */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Verified Users</p>
                <p className="text-2xl font-bold text-gray-900">$89,000</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-red-600 font-medium">↘ 4.3%</span>
                  <span className="text-xs text-gray-500 ml-1">Down from yesterday</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                {/* Icon placeholder - you can replace this */}
                <div className="w-6 h-6 bg-green-500 rounded"></div>
              </div>
            </div>
          </div>

          {/* Todays Job */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Todays Job</p>
                <p className="text-2xl font-bold text-gray-900">2040</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-green-600 font-medium">↗ 1.8%</span>
                  <span className="text-xs text-gray-500 ml-1">Up from yesterday</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                {/* Icon placeholder - you can replace this */}
                <div className="w-6 h-6 bg-orange-500 rounded"></div>
              </div>
            </div>
          </div>

          {/* Active Jobs */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">2040</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-green-600 font-medium">↗ 1.8%</span>
                  <span className="text-xs text-gray-500 ml-1">Up from yesterday</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                {/* Icon placeholder - you can replace this */}
                <div className="w-6 h-6 bg-blue-400 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Recent Users Table */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                        <span className="text-sm font-medium text-gray-900">Alfredo Vetrovs</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">sample@gmail.com</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">+91 9876543210</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12.09.2025</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                        <span className="text-sm font-medium text-gray-900">Charlie Ekstrom</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">sample@gmail.com</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">+91 9876543210</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12.09.2025</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                        <span className="text-sm font-medium text-gray-900">Carla Westervelt</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">sample@gmail.com</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">+91 9876543210</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12.09.2025</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Job Table */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Job</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Technical Consultant</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Banglore</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12.09.2025</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Technical Consultant</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Banglore</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12.09.2025</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Technical Consultant</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Banglore</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12.09.2025</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}