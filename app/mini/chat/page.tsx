'use client';

import { useTelegram } from '@/lib/telegram/TelegramProvider';

export default function MiniChat() {
   const { user, isLoading } = useTelegram();

   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen p-4 bg-gray-50">
         <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
               <div>
                  <h1 className="text-2xl font-bold">Signal Chat ⭐</h1>
                  {user && (
                     <p className="text-sm text-gray-600">@{user.username || user.firstName}</p>
                  )}
               </div>
               <div className="bg-blue-100 px-4 py-2 rounded-lg">
                  <span className="text-sm font-semibold">Session: $0.00</span>
               </div>
            </div>

            {/* Signal Message Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
               <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                     C
                  </div>
                  <div className="flex-1">
                     <h3 className="font-semibold mb-1">Creator Signal</h3>
                     <p className="text-gray-700">
                        🚀 BREAKING: New alpha signal incoming! Get ready...
                     </p>
                  </div>
               </div>

               {/* Action Buttons */}
               <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                     ❤️ Like ₹1
                  </button>
                  <button className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200">
                     ❓ Ask ₹1
                  </button>
                  <button className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200">
                     🤖 AI Explain ₹2
                  </button>
               </div>
            </div>

            {/* Premium Message Input */}
            <div className="bg-white rounded-lg shadow p-4">
               <textarea
                  className="w-full p-3 border rounded-lg mb-3"
                  placeholder="Send premium message..."
                  rows={3}
               />
               <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Send Premium Message
               </button>
            </div>
         </div>
      </div>
   );
}
