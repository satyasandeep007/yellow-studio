export function ChatPanel() {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(15,20,26,0.95),rgba(9,12,16,0.95))] p-6 shadow-[0_0_80px_rgba(0,184,255,0.08)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/40">
            Builder Chat
          </p>
          <h2 className="text-lg font-semibold">Prompt-to-Site Studio</h2>
        </div>
        <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
          Live
        </span>
      </div>

      <div className="mt-6 flex flex-1 flex-col gap-4 overflow-hidden">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            System
          </p>
          <p className="mt-2 text-sm text-white/80">
            Tell me the vibe, sections, and any must-have interactions.
          </p>
        </div>
        <div className="ml-auto max-w-[80%] rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/80">
            You
          </p>
          <p className="mt-2 text-sm text-white/90">
            Create a neon event landing page with countdown and registration
            form.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Chainva AI
          </p>
          <p className="mt-2 text-sm text-white/80">
            Drafting hero, schedule, speakers, and CTA. Rendering preview now.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300"></span>
            Generation #3 • 0.08 USDC
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.24em] text-white/40">
            New Prompt
          </p>
          <span className="text-xs text-white/40">
            Shift + Enter for newline
          </span>
        </div>
        <div className="mt-3 min-h-[88px] rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white/70">
          Describe the vibe, colors, and sections you want to generate...
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300"></span>
            Ready to generate
          </div>
          <button className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-emerald-300">
            Generate (0.08 USDC)
          </button>
        </div>
      </div>
    </div>
  );
}
