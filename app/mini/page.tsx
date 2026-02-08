'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegram } from '@/lib/telegram/TelegramProvider';

export default function MiniAppEntry() {
   const router = useRouter();
   const { isLoading, isAuthenticated } = useTelegram();

   useEffect(() => {
      if (!isLoading && isAuthenticated) {
         // Auto-redirect to home after authentication
         router.push('/mini/home');
      }
   }, [isLoading, isAuthenticated, router]);

   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
               <p className="text-gray-600">Loading Telegram Mini App...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen flex items-center justify-center p-4">
         <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Telegram Mini App</h1>
            <p className="text-gray-600 mb-6">Entry Loader</p>
            <a
               href="/mini/home"
               className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
               Enter App
            </a>
         </div>
      </div>
   );
}
