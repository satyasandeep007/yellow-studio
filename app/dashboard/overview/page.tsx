export default function DashboardOverview() {
   return (
      <div className="min-h-screen p-6 bg-gray-50">
         <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Creator Dashboard ⭐</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Today Earnings</h3>
                  <p className="text-3xl font-bold text-green-600">$0.00</p>
               </div>

               <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Earnings</h3>
                  <p className="text-3xl font-bold text-blue-600">$0.00</p>
               </div>

               <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Users</h3>
                  <p className="text-3xl font-bold text-purple-600">0</p>
               </div>

               <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Interactions</h3>
                  <p className="text-3xl font-bold text-orange-600">0</p>
               </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
               <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
               <div className="flex gap-3">
                  <a href="/dashboard/signals" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                     Manage Signals
                  </a>
                  <a href="/dashboard/activity" className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                     View Activity
                  </a>
                  <a href="/dashboard/settlement" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                     Settle Funds
                  </a>
               </div>
            </div>
         </div>
      </div>
   );
}
