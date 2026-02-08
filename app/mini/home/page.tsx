export default function MiniHome() {
   return (
      <div className="min-h-screen p-6 bg-gray-50">
         <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Home</h1>

            <div className="bg-white rounded-lg shadow p-6 mb-4">
               <h2 className="text-lg font-semibold mb-2">Balance</h2>
               <p className="text-3xl font-bold text-blue-600">$0.00 USDC</p>
            </div>

            <div className="space-y-3">
               <a
                  href="/mini/deposit"
                  className="block w-full px-6 py-3 bg-green-600 text-white text-center rounded-lg hover:bg-green-700"
               >
                  Deposit
               </a>

               <a
                  href="/mini/chat"
                  className="block w-full px-6 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700"
               >
                  Enter Signal Chat ⭐
               </a>
            </div>
         </div>
      </div>
   );
}
