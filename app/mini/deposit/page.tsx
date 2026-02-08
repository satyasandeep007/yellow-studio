export default function MiniDeposit() {
   return (
      <div className="min-h-screen p-6 bg-gray-50">
         <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Deposit USDC</h1>

            <div className="bg-white rounded-lg shadow p-6 space-y-6">
               <div>
                  <label className="block text-sm font-semibold mb-2">Amount</label>
                  <input
                     type="number"
                     placeholder="0.00"
                     className="w-full p-3 border rounded-lg text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">Enter amount in USDC</p>
               </div>

               <div className="border-t pt-4">
                  <button className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mb-3">
                     Connect Wallet
                  </button>
                  <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                     Deposit to Channel
                  </button>
               </div>

               <div className="text-center">
                  <a href="/mini/home" className="text-blue-600 hover:underline">
                     ← Back to Home
                  </a>
               </div>
            </div>
         </div>
      </div>
   );
}
