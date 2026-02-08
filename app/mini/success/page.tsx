export default function MiniSuccess() {
   return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
         <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow p-8">
               <div className="text-6xl mb-4">✅</div>
               <h1 className="text-2xl font-bold mb-2">Payment Successful</h1>
               <p className="text-gray-600 mb-6">
                  Your transaction has been completed successfully
               </p>

               <div className="space-y-3">
                  <a
                     href="/mini/chat"
                     className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                     Back to Chat
                  </a>
                  <a
                     href="/mini/home"
                     className="block w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                     Go to Home
                  </a>
               </div>
            </div>
         </div>
      </div>
   );
}
