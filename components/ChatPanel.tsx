type ChatPanelProps = {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
  messages: {
    id: string;
    role: "system" | "user" | "assistant";
    content: string;
    meta?: string;
  }[];
};

export function ChatPanel({
  prompt,
  onPromptChange,
  onGenerate,
  isGenerating,
  canGenerate,
  messages,
}: ChatPanelProps) {
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
        {messages.map((message) => {
          const isUser = message.role === "user";
          const isAssistant = message.role === "assistant";
          return (
            <div
              key={message.id}
              className={`rounded-2xl border p-4 ${
                isUser
                  ? "ml-auto max-w-[80%] border-emerald-400/30 bg-emerald-400/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <p
                className={`text-xs uppercase tracking-[0.2em] ${
                  isUser
                    ? "text-emerald-200/80"
                    : isAssistant
                      ? "text-white/60"
                      : "text-white/40"
                }`}
              >
                {isUser ? "You" : isAssistant ? "Chainva AI" : "System"}
              </p>
              <p className="mt-2 text-sm text-white/85">{message.content}</p>
              {message.meta ? (
                <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300"></span>
                  {message.meta}
                </div>
              ) : null}
            </div>
          );
        })}
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
        <textarea
          className="mt-3 min-h-[88px] w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white/80 outline-none placeholder:text-white/40"
          placeholder="Describe the vibe, colors, and sections you want to generate..."
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
        />
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300"></span>
            Ready to generate
          </div>
          <div className="flex items-center gap-3 text-xs text-white/40">
            {!canGenerate ? (
              <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-amber-200">
                Start a session to generate
              </span>
            ) : null}
          </div>
          <button
            className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onGenerate}
            disabled={!prompt.trim() || isGenerating || !canGenerate}
          >
            {isGenerating ? "Generating..." : "Generate (0.08 USDC)"}
          </button>
        </div>
      </div>
    </div>
  );
}
