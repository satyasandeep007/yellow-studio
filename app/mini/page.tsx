export default function MiniAppEntry() {
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
