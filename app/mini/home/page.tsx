'use client';

import { useTelegram } from '@/lib/telegram/TelegramProvider';

export default function MiniHome() {
   const { user, isLoading } = useTelegram();

   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen p-6 bg-gray-50">
         <div className="max-w-md mx-auto">
            {/* User Welcome */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow p-6 mb-6 text-white">
               <h1 className="text-2xl font-bold mb-2">Welcome!</h1>
               <div className="flex items-center gap-3">
                  {user?.photoUrl && (
                     <img
                        src={user.photoUrl}
                        alt="Profile"
                        className="w-12 h-12 rounded-full"
                     />
                  )}
                  <div>
                     <p className="font-semibold">
                        {user?.firstName} {user?.lastName}
                     </p>
                     {user?.username && (
                        <p className="text-sm opacity-90">@{user.username}</p>
                     )}
                  </div>
               </div>
            </div>

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
