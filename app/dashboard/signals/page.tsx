export default function DashboardSignals() {
   return (
      <div className="min-h-screen p-6 bg-gray-50">
         <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
               <h1 className="text-3xl font-bold">Manage Signals</h1>
               <a href="/dashboard/overview" className="text-blue-600 hover:underline">
                  ← Back to Overview
               </a>
            </div>

            {/* Create Signal Form */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
               <h2 className="text-xl font-bold mb-4">Create New Signal</h2>

               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-semibold mb-2">Signal Message</label>
                     <textarea
                        className="w-full p-3 border rounded-lg"
                        placeholder="Enter your signal message..."
                        rows={4}
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-semibold mb-2">Like Price (₹)</label>
                        <input type="number" className="w-full p-3 border rounded-lg" defaultValue="1" />
                     </div>
                     <div>
                        <label className="block text-sm font-semibold mb-2">AI Explain Price (₹)</label>
                        <input type="number" className="w-full p-3 border rounded-lg" defaultValue="2" />
                     </div>
                  </div>

                  <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                     Create Signal
                  </button>
               </div>
            </div>

            {/* Existing Signals */}
            <div className="bg-white rounded-lg shadow p-6">
               <h2 className="text-xl font-bold mb-4">Active Signals</h2>
               <p className="text-gray-500">No signals created yet</p>
            </div>
         </div>
      </div>
   );
}
