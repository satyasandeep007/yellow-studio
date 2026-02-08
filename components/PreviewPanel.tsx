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
  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Preview Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-900">Live Preview</h3>
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

      {/* Preview Content */}
      <div className="flex flex-1 overflow-hidden p-4">
        <div className="flex flex-1 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
          {html ? (
            <iframe
              className="h-full w-full bg-white"
              title="Chainva Preview"
              sandbox="allow-scripts allow-forms allow-same-origin"
              srcDoc={html}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center bg-white">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                <svg className="h-8 w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                Preview will render here
              </h3>
              <p className="mt-2 max-w-md text-sm text-gray-600">
                Your generated website will appear here instantly after each generation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
