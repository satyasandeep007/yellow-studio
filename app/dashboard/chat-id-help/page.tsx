'use client';

import { useState } from 'react';

export default function ChatIdHelp() {
   const [chatData, setChatData] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   async function fetchChatId() {
      setIsLoading(true);
      setError(null);

      try {
         const response = await fetch('/api/bot/get-chat-id');
         const data = await response.json();

         if (data.success) {
            setChatData(data);
         } else {
            setError(data.message || 'No messages found');
         }
      } catch (err) {
         setError('Failed to fetch chat ID');
      } finally {
         setIsLoading(false);
      }
   }

   function copyToClipboard(text: string) {
      navigator.clipboard.writeText(text);
      alert('✅ Copied to clipboard!');
   }

   return (
      <div className="min-h-screen p-6 bg-gray-50">
         <div className="max-w-3xl mx-auto">
            <div className="mb-6">
               <a href="/dashboard/signals" className="text-blue-600 hover:underline">
                  ← Back to Signals
               </a>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
               <h1 className="text-3xl font-bold mb-6">🆔 Get Your Telegram Chat ID</h1>

               <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                  <h2 className="font-bold mb-2">📋 Instructions:</h2>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                     <li>Open Telegram and search for your bot</li>
                     <li>Click <strong>START</strong> or send <code className="bg-gray-200 px-2 py-1 rounded">/start</code></li>
                     <li>Send any message to the bot (e.g., "hello")</li>
                     <li>Click the button below to fetch your Chat ID</li>
                  </ol>
               </div>

               <button
                  onClick={fetchChatId}
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold text-lg mb-6"
               >
                  {isLoading ? '🔄 Fetching...' : '🔍 Fetch My Chat ID'}
               </button>

               {error && (
                  <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
                     <p className="text-red-800 font-semibold">⚠️ {error}</p>
                     {chatData?.instructions && (
                        <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                           {chatData.instructions.map((instruction: string, i: number) => (
                              <li key={i}>{instruction}</li>
                           ))}
                        </ul>
                     )}
                  </div>
               )}

               {chatData?.chats && chatData.chats.length > 0 && (
                  <div className="space-y-4">
                     <div className="bg-green-50 border-l-4 border-green-600 p-4">
                        <h3 className="font-bold text-green-800 mb-2">✅ Found Your Chat!</h3>
                        <p className="text-sm text-green-700">
                           Use the Chat ID below when posting signals
                        </p>
                     </div>

                     {chatData.chats.map((chat: any, index: number) => (
                        <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
                           <div className="flex justify-between items-start mb-4">
                              <div>
                                 <h3 className="text-xl font-bold text-gray-800">
                                    {chat.firstName} {chat.lastName}
                                 </h3>
                                 {chat.username && (
                                    <p className="text-sm text-gray-600">@{chat.username}</p>
                                 )}
                              </div>
                              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs">
                                 {chat.type}
                              </span>
                           </div>

                           <div className="bg-white rounded-lg p-4 mb-4">
                              <label className="block text-xs font-semibold text-gray-600 mb-2">
                                 YOUR CHAT ID (Use this when posting signals)
                              </label>
                              <div className="flex items-center gap-2">
                                 <code className="flex-1 text-2xl font-mono font-bold text-blue-600 bg-blue-50 px-4 py-3 rounded">
                                    {chat.chatId}
                                 </code>
                                 <button
                                    onClick={() => copyToClipboard(chat.chatId.toString())}
                                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                 >
                                    📋 Copy
                                 </button>
                              </div>
                           </div>

                           {chat.lastMessage && (
                              <div className="text-sm">
                                 <span className="text-gray-600">Last message:</span>
                                 <p className="text-gray-800 italic">"{chat.lastMessage}"</p>
                                 <p className="text-xs text-gray-500 mt-1">
                                    {new Date(chat.date).toLocaleString()}
                                 </p>
                              </div>
                           )}
                        </div>
                     ))}

                     <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
                        <h4 className="font-bold text-yellow-800 mb-2">💡 Next Steps:</h4>
                        <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
                           <li>Copy the Chat ID above</li>
                           <li>Go back to Manage Signals</li>
                           <li>Create a signal and click "Post to Telegram"</li>
                           <li>Paste your Chat ID when prompted</li>
                           <li>Check your Telegram bot chat for the signal!</li>
                        </ol>
                     </div>
                  </div>
               )}

               {!chatData && !error && (
                  <div className="text-center text-gray-500">
                     <p>Click the button above to fetch your chat information</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
