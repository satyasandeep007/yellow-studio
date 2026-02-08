type WalletModalProps = {
  open: boolean;
  onClose: () => void;
  onConnectMetaMask: () => void;
  hasProvider: boolean;
  errorMessage?: string | null;
};

export function WalletModal({
  open,
  onClose,
  onConnectMetaMask,
  hasProvider,
  errorMessage,
}: WalletModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d1117] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/40">
              Wallet Connect
            </p>
            <h3 className="text-xl font-semibold text-white">
              Choose a wallet
            </h3>
          </div>
          <button
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70 transition hover:border-white/30"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <p className="mt-3 text-sm text-white/60">
          Connect with MetaMask to start a session. WalletConnect support can be
          added next.
        </p>

        {errorMessage ? (
          <div className="mt-4 rounded-2xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-6 grid gap-3">
          <button
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onConnectMetaMask}
            disabled={!hasProvider}
          >
            <span>MetaMask</span>
            <span className="text-xs text-emerald-200">
              {hasProvider ? "Detected" : "Not installed"}
            </span>
          </button>
          <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white/50">
            WalletConnect (coming soon)
          </div>
        </div>
      </div>
    </div>
  );
}
