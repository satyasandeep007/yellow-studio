import { useState, useEffect, useRef } from "react";

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
    tokens?: number;
  }[];
  selectedModel: "gpt-4" | "gpt-3.5-turbo" | "gpt-4o";
  onModelChange: (model: "gpt-4" | "gpt-3.5-turbo" | "gpt-4o") => void;
};

const SUGGESTED_PROMPTS = [
  "Create a modern landing page for a SaaS product",
  "Build a portfolio website with dark theme",
  "Design an e-commerce product showcase page",
  "Make a restaurant menu with image gallery",
];

export function ChatPanel({
  prompt,
  onPromptChange,
  onGenerate,
  isGenerating,
  canGenerate,
  messages,
  selectedModel,
  onModelChange,
}: ChatPanelProps) {
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getModelDisplayName = (model: string) => {
    switch (model) {
      case "gpt-4":
        return "GPT-4 Turbo";
      case "gpt-3.5-turbo":
        return "GPT-3.5 Turbo";
      case "gpt-4o":
        return "GPT-4o";
      default:
        return "GPT-4 Turbo";
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false);
      }
    };

    if (showModelDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showModelDropdown]);

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              {/* Welcome Message */}
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Hello there!</h1>
                <p className="text-lg text-gray-500">How can I help you today?</p>
              </div>

              {/* Suggested Prompts */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-2xl mb-6">
                {SUGGESTED_PROMPTS.map((suggestedPrompt, index) => (
                  <button
                    key={index}
                    onClick={() => onPromptChange(suggestedPrompt)}
                    className="group relative rounded-xl border border-gray-200 bg-white p-4 text-left text-sm text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      <svg className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-purple-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="leading-snug">{suggestedPrompt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const isUser = message.role === "user";
              return (
                <div key={message.id} className="group flex gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {isUser ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                        <span className="text-xs font-semibold text-white">U</span>
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {/* Message Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {isUser ? "You" : "Chainva AI"}
                      </span>
                      {message.meta && (
                        <span className="text-xs text-gray-500">{message.meta}</span>
                      )}
                      {message.tokens && (
                        <span className="flex items-center gap-1 text-xs text-purple-600">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          {message.tokens.toLocaleString()} tokens
                        </span>
                      )}
                    </div>
                    <div className="max-w-none text-sm text-gray-700 leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto w-full max-w-3xl">
          {!canGenerate && (
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Start a Yellow session to begin generating
            </div>
          )}
          <div className="relative flex items-end gap-2">
            <textarea
              className="min-h-[52px] flex-1 resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Describe your website... (e.g., 'Create a neon event landing page with countdown')"
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (prompt.trim() && !isGenerating && canGenerate) {
                    onGenerate();
                  }
                }
              }}
              rows={1}
            />
            <button
              className="flex h-[52px] items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 font-medium text-white transition hover:from-purple-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onGenerate}
              disabled={!prompt.trim() || isGenerating || !canGenerate}
            >
              {isGenerating ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate
                </>
              )}
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between">
            {/* Model Selector */}
            <div className="flex items-center gap-2 relative" ref={dropdownRef}>
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{getModelDisplayName(selectedModel)}</span>
                <svg className="h-3 w-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {showModelDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-10">
                  {(["gpt-4", "gpt-3.5-turbo", "gpt-4o"] as const).map((model) => (
                    <button
                      key={model}
                      onClick={() => {
                        onModelChange(model);
                        setShowModelDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 transition first:rounded-t-lg last:rounded-b-lg ${selectedModel === model ? "bg-purple-50 text-purple-600 font-medium" : "text-gray-700"
                        }`}
                    >
                      {getModelDisplayName(model)}
                      {selectedModel === model && (
                        <svg className="inline-block ml-2 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-xs text-gray-400">Press Enter to send</span>
            </div>

            {/* Cost Info */}
            {canGenerate && (
              <span className="text-xs text-purple-600 font-medium">0.08 USDC per generation</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
