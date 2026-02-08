export default function DashboardSettlement() {
   return (
      <div className="min-h-screen p-6 bg-gray-50">
         <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
               <h1 className="text-3xl font-bold">Settlement</h1>
               <a href="/dashboard/overview" className="text-blue-600 hover:underline">
                  ← Back to Overview
               </a>
            </div>

            {/* Current Balance */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
               <h2 className="text-xl font-bold mb-4">Off-Chain Balance</h2>
               <p className="text-4xl font-bold text-green-600 mb-4">$0.00 USDC</p>
               <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Settle to Wallet
               </button>
            </div>

            {/* Settlement History */}
            <div className="bg-white rounded-lg shadow p-6">
               <h2 className="text-xl font-bold mb-4">Settlement History</h2>

               <div className="overflow-hidden">
                  <table className="w-full">
                     <thead className="bg-gray-100">
                        <tr>
                           <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                           <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                           <th className="px-4 py-3 text-left text-sm font-semibold">Tx Hash</th>
                           <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <td className="px-4 py-4 text-gray-500" colSpan={4}>
                              No settlements yet
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
   );
}
