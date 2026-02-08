export default function Home() {
  return (
    <div className="min-h-screen px-6 py-6 text-white">
      <main className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1440px] flex-col gap-6">
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

        <section className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1.25fr]">
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
                  Create a neon event landing page with countdown and
                  registration form.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                  Chainva AI
                </p>
                <p className="mt-2 text-sm text-white/80">
                  Drafting hero, schedule, speakers, and CTA. Rendering preview
                  now.
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

          <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-[linear-gradient(160deg,rgba(12,15,20,0.95),rgba(10,12,16,0.95))] p-6 shadow-[0_0_100px_rgba(57,255,136,0.12)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">
                  Live Preview
                </p>
                <h2 className="text-lg font-semibold">Neon Event Landing</h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  Desktop
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  1440px
                </span>
                <button className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/70 transition hover:border-white/30">
                  Refresh
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-black/50 text-2xl">
                ▢
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                Preview will render here
              </h3>
              <p className="mt-2 max-w-md text-sm text-white/60">
                Chainva streams generated HTML/CSS/React into this canvas and
                updates instantly after each generation.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-white/50">
                <span className="rounded-full border border-white/10 bg-black/40 px-3 py-2">
                  Version v0.3
                </span>
                <span className="rounded-full border border-white/10 bg-black/40 px-3 py-2">
                  Last update 6s ago
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
