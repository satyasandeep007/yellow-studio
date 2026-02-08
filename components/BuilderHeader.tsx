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
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/15 bg-black/60 px-6 py-4 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold">
          CA
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">
            Chainva AI
          </p>
          <h1 className="text-xl font-semibold">Neon Event Builder</h1>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70">
          {sessionLabel}
        </div>
        {walletConnected ? (
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-white/20 bg-black/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80">
              {walletAddress}
            </span>
            <button
              className="rounded-full border border-white/20 bg-black/70 px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/50 hover:text-white"
              onClick={onDisconnectWallet}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            className="rounded-full border border-white/20 bg-black/70 px-5 py-2 text-sm font-semibold text-white/85 transition hover:border-white/50 hover:text-white"
            onClick={onConnectWallet}
          >
            Connect Wallet
          </button>
        )}
        {sessionActive ? (
          <button
            className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-5 py-2 text-sm font-semibold text-emerald-200 transition hover:border-emerald-300 hover:text-emerald-100"
            onClick={onEndSession}
          >
            End Session
          </button>
        ) : (
          <button
            className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onStartSession}
            disabled={!walletConnected}
          >
            Start Session
          </button>
        )}
        <button className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90">
          Publish
        </button>
      </div>
    </header>
  );
}
