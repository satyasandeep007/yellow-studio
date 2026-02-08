type PreviewPanelProps = {
  html: string;
};

export function PreviewPanel({ html }: PreviewPanelProps) {
  return (
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

      <div className="mt-6 flex flex-1 flex-col overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/5">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/40">
          <span>Render Canvas</span>
          <span className="text-[10px] text-white/30">preview.html</span>
        </div>
        <div className="flex flex-1">
          {html ? (
            <iframe
              className="h-full w-full bg-white"
              title="Chainva Preview"
              sandbox="allow-scripts allow-forms allow-same-origin"
              srcDoc={html}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
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
          )}
        </div>
      </div>
    </div>
  );
}
