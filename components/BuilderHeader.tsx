type BuilderHeaderProps = {
  walletConnected: boolean;
  walletAddress: string;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  sessionActive: boolean;
  sessionBalance: number;
  onStartSession: () => void;
  onEndSession: () => void;
  sessionTokens: number;
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
  sessionTokens,
}: BuilderHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
      {/* Left: Logo & Project Name */}
      <div className="flex items-center gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900">
          <img
            src="/submission/logo.svg"
            alt="Yellow Studio"
            className="h-6 w-6"
          />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-gray-900">Yellow Studio</h1>
          <p className="text-xs text-gray-500">AI Website Builder</p>
        </div>
      </div>

      {/* Right: Session & Wallet Controls */}
      <div className="flex items-center gap-3">
        {/* Token Usage */}
        {sessionActive && sessionTokens > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-1.5 text-sm">
            <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="font-medium text-purple-600">{sessionTokens.toLocaleString()} tokens</span>
          </div>
        )}

        {/* Session Status */}
        {sessionActive ? (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
            <span className="font-medium text-green-600">{sessionBalance.toFixed(2)} USDC</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-600">
            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
            <span>No Session</span>
          </div>
        )}

        {/* Wallet Connection */}
        {walletConnected ? (
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-mono text-gray-700">
              {walletAddress
                ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                : ""}
            </div>
            <button
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
              onClick={onDisconnectWallet}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
        <button className="rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800">
          Publish
        </button>
      </div>
    </header>
  );
}
