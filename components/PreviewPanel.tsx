import { useState } from "react";

type PreviewPanelProps = {
  html: string;
  versionLabel: string;
  lastUpdated: string;
};

export function PreviewPanel({
  html,
  versionLabel,
  lastUpdated,
}: PreviewPanelProps) {
  const [viewMode, setViewMode] = useState<"code" | "preview">("code");

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Preview Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setViewMode("code")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${viewMode === "code"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Code
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${viewMode === "preview"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </button>
          </div>

          {versionLabel && (
            <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs text-purple-600">
              {versionLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-gray-500">{lastUpdated}</span>
          )}
          <button className="rounded-lg bg-white border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button className="rounded-lg bg-white border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
            Desktop
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden p-4">
        <div className="relative flex flex-1 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
          {html ? (
            <>
              {/* Code View */}
              <div className={`absolute inset-0 flex h-full w-full flex-col bg-[#1e1e1e] ${viewMode === "code" ? "block" : "hidden"}`}>
                <div className="flex items-center justify-between border-b border-gray-700 bg-[#252526] px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-300">index.html</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(html);
                    }}
                    className="flex items-center gap-1.5 rounded-md bg-[#2d2d30] px-3 py-1.5 text-xs text-gray-300 hover:bg-[#3e3e42] transition"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Code
                  </button>
                </div>
                <div className="flex-1 overflow-auto">
                  <pre className="p-4 text-sm leading-relaxed" style={{ tabSize: 2 }}>
                    <code className="font-mono text-gray-300 whitespace-pre">{html}</code>
                  </pre>
                </div>
              </div>

              {/* Preview View */}
              <iframe
                className={`absolute inset-0 h-full w-full bg-white ${viewMode === "preview" ? "block" : "hidden"}`}
                title="Chainva Preview"
                sandbox="allow-scripts allow-forms allow-same-origin"
                srcDoc={html}
              />
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center bg-white">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                <svg className="h-8 w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                {viewMode === "code" ? "Code will appear here" : "Preview will render here"}
              </h3>
              <p className="mt-2 max-w-md text-sm text-gray-600">
                {viewMode === "code"
                  ? "Generated HTML/CSS code will be shown here after generation."
                  : "Your generated website will appear here instantly after each generation."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
