export function BuilderHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur">
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
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
          Session: 9.8 USDC
        </div>
        <button className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white">
          Connect Wallet
        </button>
        <button className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90">
          Publish
        </button>
      </div>
    </header>
  );
}
