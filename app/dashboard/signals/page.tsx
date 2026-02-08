'use client';

import { useState } from 'react';

interface Signal {
   id: string;
   asset: string;
   price: number;
   target: number;
   stopLoss: number;
   confidence: number;
   createdAt: string;
   posted: boolean;
}

export default function DashboardSignals() {
   const [signals, setSignals] = useState<Signal[]>([]);
   const [isCreating, setIsCreating] = useState(false);
   const [isPosting, setIsPosting] = useState<string | null>(null);

   const [formData, setFormData] = useState({
      asset: 'ETH',
      price: '',
      target: '',
      stopLoss: '',
      confidence: '',
      chatId: '',
   });

   async function handleCreateSignal(e: React.FormEvent) {
      e.preventDefault();
      setIsCreating(true);

      try {
         const newSignal: Signal = {
            id: `sig_${Date.now()}`,
            asset: formData.asset,
            price: parseFloat(formData.price),
            target: parseFloat(formData.target),
            stopLoss: parseFloat(formData.stopLoss),
            confidence: parseFloat(formData.confidence),
            createdAt: new Date().toISOString(),
            posted: false,
         };

         setSignals([newSignal, ...signals]);

         // Reset form
         setFormData({
            asset: 'ETH',
            price: '',
            target: '',
            stopLoss: '',
            confidence: '',
            chatId: '',
         });

         alert('✅ Signal created successfully!');
      } catch (error) {
         console.error('Error creating signal:', error);
         alert('❌ Failed to create signal');
      } finally {
         setIsCreating(false);
      }
   }

   async function handlePostToGroup(signal: Signal) {
      const chatId = prompt('Enter Telegram Chat ID or @username (e.g., @your_channel or your user ID):');

      if (!chatId) return;

      setIsPosting(signal.id);

      try {
         const response = await fetch('/api/bot/send-signal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               chatId,
               signal: {
                  id: signal.id,
                  asset: signal.asset,
                  price: signal.price,
               },
            }),
         });

         const result = await response.json();

         if (result.success) {
            // Update signal as posted
            setSignals(signals.map(s =>
               s.id === signal.id ? { ...s, posted: true } : s
            ));
            alert('✅ Signal posted to Telegram!');
         } else {
            throw new Error(result.error);
         }
      } catch (error) {
         console.error('Error posting signal:', error);
         alert('❌ Failed to post signal: ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
         setIsPosting(null);
      }
   }

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

               <form onSubmit={handleCreateSignal} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-semibold mb-2">Asset</label>
                        <select
                           className="w-full p-3 border rounded-lg"
                           value={formData.asset}
                           onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
                           required
                        >
                           <option value="ETH">ETH</option>
                           <option value="BTC">BTC</option>
                           <option value="SOL">SOL</option>
                           <option value="AVAX">AVAX</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-semibold mb-2">Entry Price ($)</label>
                        <input
                           type="number"
                           step="0.01"
                           className="w-full p-3 border rounded-lg"
                           placeholder="3200"
                           value={formData.price}
                           onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                           required
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                     <div>
                        <label className="block text-sm font-semibold mb-2">Target ($)</label>
                        <input
                           type="number"
                           step="0.01"
                           className="w-full p-3 border rounded-lg"
                           placeholder="3500"
                           value={formData.target}
                           onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                           required
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-semibold mb-2">Stop-Loss ($)</label>
                        <input
                           type="number"
                           step="0.01"
                           className="w-full p-3 border rounded-lg"
                           placeholder="3000"
                           value={formData.stopLoss}
                           onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
                           required
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-semibold mb-2">Confidence (%)</label>
                        <input
                           type="number"
                           min="0"
                           max="100"
                           className="w-full p-3 border rounded-lg"
                           placeholder="85"
                           value={formData.confidence}
                           onChange={(e) => setFormData({ ...formData, confidence: e.target.value })}
                           required
                        />
                     </div>
                  </div>

                  <button
                     type="submit"
                     disabled={isCreating}
                     className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                     {isCreating ? 'Creating...' : 'Create Signal'}
                  </button>
               </form>
            </div>

            {/* Existing Signals */}
            <div className="bg-white rounded-lg shadow p-6">
               <h2 className="text-xl font-bold mb-4">Active Signals</h2>

               {signals.length === 0 ? (
                  <p className="text-gray-500">No signals created yet</p>
               ) : (
                  <div className="space-y-4">
                     {signals.map((signal) => (
                        <div key={signal.id} className="border rounded-lg p-4 hover:bg-gray-50">
                           <div className="flex justify-between items-start mb-3">
                              <div>
                                 <h3 className="font-bold text-lg">{signal.asset} Signal</h3>
                                 <p className="text-sm text-gray-500">#{signal.id}</p>
                              </div>
                              {signal.posted ? (
                                 <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                    ✅ Posted
                                 </span>
                              ) : (
                                 <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                                    📝 Draft
                                 </span>
                              )}
                           </div>

                           <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
                              <div>
                                 <span className="text-gray-600">Entry:</span>
                                 <p className="font-semibold">${signal.price}</p>
                              </div>
                              <div>
                                 <span className="text-gray-600">Target:</span>
                                 <p className="font-semibold text-green-600">${signal.target}</p>
                              </div>
                              <div>
                                 <span className="text-gray-600">Stop:</span>
                                 <p className="font-semibold text-red-600">${signal.stopLoss}</p>
                              </div>
                              <div>
                                 <span className="text-gray-600">Confidence:</span>
                                 <p className="font-semibold">{signal.confidence}%</p>
                              </div>
                           </div>

                           {!signal.posted && (
                              <button
                                 onClick={() => handlePostToGroup(signal)}
                                 disabled={isPosting === signal.id}
                                 className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                              >
                                 {isPosting === signal.id ? 'Posting...' : '📤 Post to Telegram Group'}
                              </button>
                           )}
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
