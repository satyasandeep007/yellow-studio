export default function DashboardActivity() {
   return (
      <div className="min-h-screen p-6 bg-gray-50">
         <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
               <h1 className="text-3xl font-bold">Activity History</h1>
               <a href="/dashboard/overview" className="text-blue-600 hover:underline">
                  ← Back to Overview
               </a>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
               <table className="w-full">
                  <thead className="bg-gray-100">
                     <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">User</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Time</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr className="border-t">
                        <td className="px-6 py-4 text-gray-500" colSpan={5}>
                           No transactions yet
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}
