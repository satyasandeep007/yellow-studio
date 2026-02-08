'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTelegram } from '@/lib/telegram/TelegramProvider';

const PRICES = {
   unlock: 1,
   ask: 1,
   ai: 2,
};

const LABELS = {
   unlock: '🔓 Unlock Full Signal',
   ask: '❓ Ask Trader',
   ai: '🤖 AI Explain',
};

const DESCRIPTIONS = {
   unlock: 'Get full target, stop-loss & confidence levels',
   ask: 'Send a question directly to the trader',
   ai: 'Get AI-powered analysis of this signal',
};

function UnlockContent() {
   const searchParams = useSearchParams();
   const signalId = searchParams.get('signal');
   const action = searchParams.get('action') as 'unlock' | 'ask' | 'ai';

   const { user, webApp, isAuthenticated } = useTelegram();

   const [isProcessing, setIsProcessing] = useState(false);
   const [signal, setSignal] = useState<any>(null);
   const [error, setError] = useState<string | null>(null);

   const price = PRICES[action] || 1;
   const label = LABELS[action] || 'Action';
   const description = DESCRIPTIONS[action] || '';

   useEffect(() => {
      // Fetch signal details
      async function loadSignal() {
         try {
            const res = await fetch(`/api/signals/${signalId}`);
            const data = await res.json();

            if (data.success) {
               setSignal(data.signal);
            } else {
               setError('Signal not found');
            }
         } catch (err) {
            console.error('Error loading signal:', err);
            setError('Failed to load signal');
         }
      }

      if (signalId) {
         loadSignal();
      }

      // Configure Telegram Main Button
      if (webApp?.MainButton) {
         webApp.MainButton.setText(`Pay ₹${price}`);
         webApp.MainButton.color = '#3B82F6';
         webApp.MainButton.textColor = '#FFFFFF';
         webApp.MainButton.show();
         webApp.MainButton.onClick(handlePayment);
      }

      return () => {
         if (webApp?.MainButton) {
            webApp.MainButton.hide();
            webApp.MainButton.offClick(handlePayment);
         }
      };
   }, [signalId, action, webApp]);

   async function handlePayment() {
      if (!user || !signal) {
         webApp?.showAlert('❌ User or signal information missing');
         return;
      }

      setIsProcessing(true);
      if (webApp?.MainButton) {
         webApp.MainButton.showProgress(true);
      }

      try {
         // Mock wallet for now - integrate with WalletProvider later
         const mockWalletAddress = '0x1234567890123456789012345678901234567890';

         // Process payment
         const response = await fetch('/api/payments/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               userId: user.telegramId,
               signalId,
               action,
               amount: price,
               walletAddress: mockWalletAddress,
            }),
         });

         const result = await response.json();

         if (result.success) {
            // Haptic feedback
            webApp?.HapticFeedback?.notificationOccurred('success');

            // Show success message
            webApp?.showAlert('✅ Payment successful!', async () => {
               // Send unlock notification to Telegram group
               // Note: You need to get chatId and messageId from signal metadata
               try {
                  await fetch('/api/bot/unlock-content', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({
                        signalId,
                        userId: user.telegramId,
                        username: user.username,
                        action,
                        content: {
                           ...result.content,
                           chatId: signal.chatId || '@your_channel',
                           originalMessageId: signal.messageId,
                        },
                     }),
                  });
               } catch (err) {
                  console.error('Error sending unlock notification:', err);
               }

               // Close Mini App
               webApp?.close();
            });
         } else {
            throw new Error(result.error || 'Payment failed');
         }
      } catch (error) {
         console.error('Payment error:', error);
         webApp?.HapticFeedback?.notificationOccurred('error');
         webApp?.showAlert('❌ Payment failed. Please try again.');
      } finally {
         setIsProcessing(false);
         if (webApp?.MainButton) {
            webApp.MainButton.hideProgress();
         }
      }
   }

   if (error) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-lg shadow p-6 text-center">
               <div className="text-4xl mb-4">⚠️</div>
               <p className="text-red-600 font-semibold">{error}</p>
            </div>
         </div>
      );
   }

   if (!signal) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
               <p className="text-gray-600">Loading signal...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 pb-24">
         <div className="max-w-md mx-auto">
            {/* Signal Preview */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
               <h2 className="text-xl font-bold mb-4 flex items-center">
                  🚀 {signal.asset} Signal
                  <span className="ml-auto text-sm font-normal text-gray-500">
                     #{signalId}
                  </span>
               </h2>
               <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                     <span className="text-gray-600">Entry Price:</span>
                     <span className="font-bold text-lg">${signal.price}</span>
                  </p>
                  <p className="flex justify-between text-gray-400">
                     <span>Target:</span>
                     <span>🔒 Locked</span>
                  </p>
                  <p className="flex justify-between text-gray-400">
                     <span>Stop-loss:</span>
                     <span>🔒 Locked</span>
                  </p>
                  <p className="flex justify-between text-gray-400">
                     <span>Confidence:</span>
                     <span>🔒 Locked</span>
                  </p>
               </div>

               {signal.traderName && (
                  <div className="mt-4 pt-4 border-t">
                     <p className="text-xs text-gray-500">
                        By <span className="font-semibold">{signal.traderName}</span>
                     </p>
                  </div>
               )}
            </div>

            {/* Action Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-xl p-6 text-white">
               <div className="text-center mb-6">
                  <div className="text-5xl mb-3">
                     {action === 'unlock' ? '🔓' : action === 'ask' ? '❓' : '🤖'}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{label}</h3>
                  <p className="text-sm opacity-90">{description}</p>
               </div>

               <div className="bg-white/20 backdrop-blur rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                     <span className="text-sm">Price:</span>
                     <span className="text-3xl font-bold">₹{price}</span>
                  </div>
               </div>

               {/* User Info */}
               {user && (
                  <div className="space-y-1">
                     <div className="text-xs opacity-75 text-center">
                        Paying as @{user.username || user.firstName}
                     </div>
                     <div className="text-xs opacity-60 text-center">
                        Telegram ID: {user.telegramId}
                     </div>
                  </div>
               )}
            </div>

            {/* Info */}
            <div className="mt-6 text-center space-y-2">
               <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800 font-medium">
                     💡 Payment is instant via state channels
                  </p>
                  <p className="text-xs text-blue-600">
                     No gas fees • Instant confirmation
                  </p>
               </div>

               {isProcessing && (
                  <p className="text-sm text-gray-600 animate-pulse">
                     Processing payment...
                  </p>
               )}
            </div>

            {/* Back Button */}
            <div className="mt-6 text-center">
               <button
                  onClick={() => webApp?.close()}
                  className="text-sm text-gray-600 hover:text-gray-800"
               >
                  ← Back to chat
               </button>
            </div>
         </div>
      </div>
   );
}

export default function UnlockPage() {
   return (
      <Suspense fallback={
         <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
         </div>
      }>
         <UnlockContent />
      </Suspense>
   );
}
