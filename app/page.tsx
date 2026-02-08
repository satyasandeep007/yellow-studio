"use client";

import { BuilderHeader } from "@/components/BuilderHeader";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { Sidebar } from "@/components/Sidebar";
import { WalletModal } from "@/components/WalletModal";
import { useEffect, useMemo, useState } from "react";

type EthereumProvider = {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

export default function Home() {
  const [prompt, setPrompt] = useState(
    "Create a neon event landing page with countdown and registration form."
  );
  const [previewHtml, setPreviewHtml] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionBalance, setSessionBalance] = useState(0);
  const [generationCount, setGenerationCount] = useState(0);
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState("Awaiting render");
  const [previewMode, setPreviewMode] = useState<"code" | "preview">("code");
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: "system" | "user" | "assistant";
    content: string;
    meta?: string;
    tokens?: number;
  }>>([]);

  const [walletAddress, setWalletAddress] = useState("");
  const [projects, setProjects] = useState<
    Array<{ id: string; name: string; updated_at?: string }>
  >([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<"gpt-4" | "gpt-3.5-turbo" | "gpt-4o">("gpt-4");
  const [totalTokens, setTotalTokens] = useState(0);
  const canGenerate = walletConnected && sessionActive;

  const ethereum = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return (window as { ethereum?: EthereumProvider }).ethereum;
  }, []);

  const hasProvider = Boolean(ethereum);

  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const handleConnectWallet = () => {
    setWalletError(null);
    setWalletModalOpen(true);
  };
  const handleDisconnectWallet = () => {
    setWalletConnected(false);
    setSessionActive(false);
    setSessionBalance(0);
    setWalletAddress("");
    setProjects([]);
    setCurrentProjectId(null);
    setMessages([]);
    setPreviewHtml("");
    setGenerationCount(0);
  };
  const handleConnectMetaMask = async () => {
    const provider = ethereum;
    if (!provider) {
      setWalletError("MetaMask not detected. Install the extension to connect.");
      return;
    }
    try {
      setWalletError(null);
      const requested = (await provider.request({
        method: "eth_requestAccounts",
      })) as string[];
      const accounts =
        requested?.length > 0
          ? requested
          : ((await provider.request({ method: "eth_accounts" })) as string[]);
      if (!accounts?.length) {
        setWalletError("No accounts returned from MetaMask.");
        return;
      }
      setWalletAddress(shortenAddress(accounts[0]));
      setWalletConnected(true);
      setWalletModalOpen(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "MetaMask connection was rejected.";
      setWalletError(message);
    }
  };
  const handleStartSession = () => {
    if (!walletConnected) return;
    setSessionActive(true);
    setSessionBalance(9.8);
  };
  const handleEndSession = () => {
    setSessionActive(false);
  };

  const handleNewProject = () => {
    if (!walletAddress) return;
    fetch("/api/db/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress, name: "Untitled Project" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.project) return;
        setProjects((prev) => [data.project, ...prev]);
        setCurrentProjectId(data.project.id);
        setMessages([]);
        setPreviewHtml("");
        setGenerationCount(0);
        setPrompt("");
      })
      .catch(() => {});
  };

  const handleSelectProject = (projectId: string) => {
    setCurrentProjectId(projectId);
    fetch(`/api/db/project/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.project?.latest_html) {
          setPreviewHtml(data.project.latest_html);
        } else {
          setPreviewHtml("");
        }
        setMessages(data.messages || []);
        setGenerationCount(data.generationCount || 0);
        setTotalTokens(data.totals?.tokens || 0);
      })
      .catch(() => {});
  };

  const handleGenerate = async () => {
    if (!canGenerate || !prompt.trim() || !currentProjectId) return;
    setIsGenerating(true);
    setPreviewMode("code");
    const sanitizedPrompt = prompt.trim();
    const historyForApi = messages
      .filter((message) => message.role !== "system")
      .slice(-6)
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    // Add user message immediately
    const nextCount = generationCount + 1;
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: sanitizedPrompt,
      },
    ]);
    fetch("/api/db/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: currentProjectId,
        role: "user",
        content: sanitizedPrompt,
        tokens: 0,
      }),
    }).catch(() => {});

    // Clear the prompt input
    setPrompt("");

    try {
      const response = await fetch("/api/chat/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: sanitizedPrompt,
          model: selectedModel,
          messages: historyForApi,
          currentCode: previewHtml || "",
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || "";
      let generatedCode = "";
      let tokens: { total?: number } | undefined;

      if (contentType.includes("text/event-stream") && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let streamDone = false;

        while (!streamDone) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith("data:")) continue;
            const data = line.replace(/^data:\s*/, "");
            if (data === "[DONE]") {
              streamDone = true;
              break;
            }
            try {
              const payload = JSON.parse(data) as {
                type?: string;
                content?: string;
                usage?: { total_tokens?: number };
                message?: string;
              };
              if (payload.type === "delta" && payload.content) {
                generatedCode += payload.content;
                setPreviewHtml(generatedCode);
              } else if (payload.type === "usage") {
                tokens = { total: payload.usage?.total_tokens ?? 0 };
              } else if (payload.type === "error") {
                throw new Error(payload.message || "Stream error");
              }
            } catch (error) {
              throw error;
            }
          }
        }
      } else {
        const data = await response.json();
        generatedCode = data.code;
        tokens = data.tokens;
        setPreviewHtml(generatedCode);
      }

      if (!generatedCode) {
        throw new Error("No code returned from the model.");
      }

      if (tokens?.total) {
        setTotalTokens((prev) => prev + tokens.total);
      }

      setGenerationCount(nextCount);
      setLastUpdatedLabel("Updated just now");
      setSessionBalance((prev) => Math.max(0, Number((prev - 0.08).toFixed(2))));
      if (tokens?.total) {
        setTotalTokens((prev) => prev + tokens.total);
      }
      setPreviewMode("preview");

      // Add assistant message
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant" as const,
        content: previewHtml
          ? "Applied your latest change to the existing page. Check the preview to confirm the update."
          : `Generated your ${sanitizedPrompt.toLowerCase()}. Check the preview panel to see the result!`,
        meta: `Generation #${nextCount} • 0.08 USDC`,
        tokens: tokens?.total || 0,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      fetch("/api/db/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: currentProjectId,
          role: "assistant",
          content: assistantMessage.content,
          tokens: assistantMessage.tokens || 0,
        }),
      }).catch(() => {});

      fetch("/api/db/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: currentProjectId,
          prompt: sanitizedPrompt,
          html: generatedCode,
          model: selectedModel,
          tokens: tokens?.total || 0,
          costUsdc: 0.08,
        }),
      }).catch(() => {});

    fetch("/api/db/projects/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: currentProjectId,
        latestHtml: generatedCode,
        name: sanitizedPrompt.length > 60 ? `${sanitizedPrompt.slice(0, 57)}...` : sanitizedPrompt,
      }),
    }).catch(() => {});
    } catch (error) {
      console.error("Generation error:", error);

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: `Sorry, I encountered an error generating your website. Please make sure your OpenAI API key is set in .env.local and try again.`,
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!ethereum) return;
    const handleAccountsChanged = (accounts: unknown) => {
      const list = Array.isArray(accounts) ? (accounts as string[]) : [];
      if (!list.length) {
        setWalletConnected(false);
        setWalletAddress("");
        setSessionActive(false);
        return;
      }
      setWalletAddress(shortenAddress(list[0]));
      setWalletConnected(true);
    };

    ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      handleAccountsChanged(accounts);
    });

    ethereum.on?.("accountsChanged", handleAccountsChanged);
    return () => {
      ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, [ethereum]);

  useEffect(() => {
    if (!walletConnected || !walletAddress) return;
    fetch("/api/db/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress }),
    })
      .then(() => fetch(`/api/db/projects?wallet=${walletAddress}`))
      .then((res) => res.json())
      .then((data) => {
        const list = data.projects || [];
        setProjects(list);
        if (list.length > 0) {
          setCurrentProjectId(list[0].id);
          return fetch(`/api/db/project/${list[0].id}`);
        }
        return null;
      })
      .then((res) => (res ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setPreviewHtml(data.project?.latest_html || "");
        setMessages(data.messages || []);
        setGenerationCount(data.generationCount || 0);
      })
      .catch(() => {});
  }, [walletConnected, walletAddress]);

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <BuilderHeader
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
        sessionActive={sessionActive}
        sessionBalance={sessionBalance}
        onStartSession={handleStartSession}
        onEndSession={handleEndSession}
        totalTokens={totalTokens}
      />

      {/* Main Content: Sidebar + Split View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          projects={projects.map((project) => ({
            id: project.id,
            name: project.name,
            updatedAt: project.updated_at || "",
          }))}
          currentProjectId={currentProjectId || ""}
          onSelectProject={handleSelectProject}
          onNewProject={handleNewProject}
        />

        {/* Chat Panel */}
        <div className="flex-1 border-r border-gray-200">
          <ChatPanel
            prompt={prompt}
            onPromptChange={setPrompt}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            canGenerate={canGenerate}
            messages={messages}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </div>

        {/* Preview Panel */}
        <div className="flex-1">
          <PreviewPanel
            html={previewHtml}
            versionLabel={`v${generationCount + 1}`}
            lastUpdated={lastUpdatedLabel}
            isStreaming={isGenerating}
            viewMode={previewMode}
            onViewModeChange={setPreviewMode}
          />
        </div>
      </div>

      {/* Wallet Modal */}
      <WalletModal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onConnectMetaMask={handleConnectMetaMask}
        hasProvider={hasProvider}
        errorMessage={walletError}
      />
    </div>
  );
}
