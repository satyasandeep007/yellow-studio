/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface TelegramUser {
   telegramId: number;
   firstName: string;
   lastName?: string;
   username?: string;
   photoUrl?: string;
}

interface TelegramContextType {
   user: TelegramUser | null;
   isLoading: boolean;
   isAuthenticated: boolean;
   isTelegramWebApp: boolean;
   webApp: any | null;
}

const TelegramContext = createContext<TelegramContextType>({
   user: null,
   isLoading: true,
   isAuthenticated: false,
   isTelegramWebApp: false,
   webApp: null,
});

export function TelegramProvider({ children }: { children: React.ReactNode }) {
   const [user, setUser] = useState<TelegramUser | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
   const [webApp, setWebApp] = useState<any>(null);

   useEffect(() => {
      async function initTelegram() {
         try {
            // Only run on client side
            if (typeof window === 'undefined') {
               return;
            }

            // Dynamically import Telegram SDK
            const { default: WebApp } = await import('@twa-dev/sdk');
            setWebApp(WebApp);

            // Check if running inside Telegram
            const isTelegram = window.Telegram?.WebApp !== undefined;

            setIsTelegramWebApp(isTelegram);

            if (!isTelegram) {
               console.warn('Not running inside Telegram WebApp');

               // For development: create mock user
               if (process.env.NODE_ENV === 'development') {
                  setUser({
                     telegramId: 123456789,
                     firstName: 'Dev',
                     lastName: 'User',
                     username: 'devuser',
                  });
               }

               setIsLoading(false);
               return;
            }

            // Initialize Telegram WebApp
            WebApp.ready();
            WebApp.expand();

            const initData = WebApp.initData;

            if (!initData) {
               console.error('No initData from Telegram');
               setIsLoading(false);
               return;
            }

            // Send to backend for verification
            const response = await fetch('/api/auth/telegram', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({ initData }),
            });

            if (!response.ok) {
               throw new Error('Authentication failed');
            }

            const data = await response.json();

            if (data.success && data.user) {
               setUser(data.user);
               console.log('✅ Telegram user authenticated:', data.user);
            }
         } catch (error) {
            console.error('Telegram initialization error:', error);

            // For development fallback
            if (process.env.NODE_ENV === 'development') {
               console.warn('Using dev fallback user');
               setUser({
                  telegramId: 123456789,
                  firstName: 'Dev',
                  lastName: 'User',
                  username: 'devuser',
               });
            }
         } finally {
            setIsLoading(false);
         }
      }

      initTelegram();
   }, []);

   const value: TelegramContextType = {
      user,
      isLoading,
      isAuthenticated: !!user,
      isTelegramWebApp,
      webApp: isTelegramWebApp ? webApp : null,
   };

   return (
      <TelegramContext.Provider value={value}>
         {children}
      </TelegramContext.Provider>
   );
}

export function useTelegram() {
   const context = useContext(TelegramContext);
   if (context === undefined) {
      throw new Error('useTelegram must be used within TelegramProvider');
   }
   return context;
}
