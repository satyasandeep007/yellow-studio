type BuilderHeaderProps = {
  walletConnected: boolean;
  walletAddress: string;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  sessionActive: boolean;
  sessionBalance: number;
  onStartSession: () => void;
  onEndSession: () => void;
};

export function BuilderHeader({
  walletConnected,
  walletAddress,
  onConnectWallet,
  onDisconnectWallet,
  sessionActive,
  sessionBalance,
  onStartSession,
  onEndSession,
}: BuilderHeaderProps) {
  const sessionLabel = sessionActive
    ? `Session: ${sessionBalance.toFixed(2)} USDC`
    : "Session: Not started";

  return (
    <header className="flex items-center justify-between border-b border-gray-800 bg-[#0a0e14] px-6 py-3">
      {/* Left: Logo & Project Name */}
      <div className="flex items-center gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white">Chainva AI</h1>
          <p className="text-xs text-gray-500">AI Website Builder</p>
        </div>
      </div>

      {/* Right: Session & Wallet Controls */}
      <div className="flex items-center gap-3">
        {/* Session Status */}
        {sessionActive ? (
          <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-1.5 text-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
            <span className="font-medium text-green-400">{sessionBalance.toFixed(2)} USDC</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-gray-400">
            <div className="h-2 w-2 rounded-full bg-gray-600"></div>
            <span>No Session</span>
          </div>
        )}

        {/* Wallet Connection */}
        {walletConnected ? (
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm font-mono text-gray-300">
              {walletAddress}
            </div>
            <button
              className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700"
              onClick={onDisconnectWallet}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            onClick={onConnectWallet}
          >
            Connect Wallet
          </button>
        )}

        {/* Session Control */}
        {sessionActive ? (
          <button
            className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700"
            onClick={onEndSession}
          >
            End Session
          </button>
        ) : (
          <button
            className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1.5 text-sm font-medium text-white hover:from-purple-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onStartSession}
            disabled={!walletConnected}
          >
            Start Session
          </button>
        )}

        {/* Publish Button */}
        <button className="rounded-lg bg-white px-4 py-1.5 text-sm font-medium text-black hover:bg-gray-200">
          Publish
        </button>
      </div>
    </header>
  );
}
