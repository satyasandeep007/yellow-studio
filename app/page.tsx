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
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [messages, setMessages] = useState([
    {
      id: "sys-1",
      role: "system" as const,
      content: "Tell me the vibe, sections, and any must-have interactions.",
    },
    {
      id: "user-1",
      role: "user" as const,
      content:
        "Create a neon event landing page with countdown and registration form.",
    },
    {
      id: "assistant-1",
      role: "assistant" as const,
      content: "Drafting hero, schedule, speakers, and CTA. Rendering preview now.",
      meta: "Generation #1 • 0.08 USDC",
    },
  ]);

  const [walletAddress, setWalletAddress] = useState("");
  const [projects, setProjects] = useState([
    { id: "1", name: "Neon Event Landing", updatedAt: "2 hours ago" },
    { id: "2", name: "Portfolio Site", updatedAt: "Yesterday" },
    { id: "3", name: "Product Launch Page", updatedAt: "3 days ago" },
  ]);
  const [currentProjectId, setCurrentProjectId] = useState("1");
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
    const newProject = {
      id: String(Date.now()),
      name: "Untitled Project",
      updatedAt: "Just now",
    };
    setProjects([newProject, ...projects]);
    setCurrentProjectId(newProject.id);
    setMessages([]);
    setPreviewHtml("");
    setGenerationCount(0);
    setPrompt("");
  };

  const handleSelectProject = (projectId: string) => {
    setCurrentProjectId(projectId);
    // In a real app, load project data from DB
  };

  const handleGenerate = () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    const sanitizedPrompt = prompt || "A neon event landing page";
    const demoHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Chainva Preview</title>
    <style>
      :root {
        color-scheme: light;
      }
      * {
        box-sizing: border-box;
        font-family: "Space Grotesk", Arial, sans-serif;
      }
      body {
        margin: 0;
        background: radial-gradient(circle at top, #1b1f2a, #0b0d12 50%, #07080c);
        color: #f5f7ff;
      }
      .hero {
        padding: 48px 40px;
        display: grid;
        gap: 24px;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        border-radius: 999px;
        border: 1px solid rgba(57, 255, 136, 0.4);
        background: rgba(57, 255, 136, 0.08);
        font-size: 12px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #9dffd0;
      }
      h1 {
        font-size: 36px;
        margin: 0;
      }
      p {
        margin: 0;
        line-height: 1.6;
        color: rgba(245, 247, 255, 0.7);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 16px;
      }
      .card {
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.04);
        padding: 16px;
      }
      .cta {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 22px;
        border-radius: 999px;
        background: #39ff88;
        color: #0b0d12;
        text-decoration: none;
        font-weight: 600;
        margin-top: 12px;
      }
    </style>
  </head>
  <body>
    <section class="hero">
      <span class="badge">Chainva Preview</span>
      <h1>${sanitizedPrompt}</h1>
      <p>Neon gradients, bold typography, and a countdown-ready layout generated in seconds.</p>
      <div class="grid">
        <div class="card">
          <strong>Countdown</strong>
          <p>12 days · 8 hours · 24 minutes</p>
        </div>
        <div class="card">
          <strong>Speakers</strong>
          <p>6 industry leaders announced</p>
        </div>
        <div class="card">
          <strong>Register</strong>
          <p>Early access list is open</p>
        </div>
      </div>
      <a class="cta" href="#">Join the Event</a>
    </section>
  </body>
</html>`;

    setTimeout(() => {
      setPreviewHtml(demoHtml);
      const nextCount = generationCount + 1;
      setGenerationCount(nextCount);
      setLastUpdatedLabel("Updated just now");
      setSessionBalance((prev) => Math.max(0, Number((prev - 0.08).toFixed(2))));
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${nextCount + 1}`,
          role: "user",
          content: sanitizedPrompt,
        },
        {
          id: `assistant-${nextCount + 1}`,
          role: "assistant",
          content: "Generated hero, countdown, and registration CTA layout.",
          meta: `Generation #${nextCount + 1} • 0.08 USDC`,
        },
      ]);
      setIsGenerating(false);
    }, 450);
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
      />

      {/* Main Content: Sidebar + Split View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          projects={projects}
          currentProjectId={currentProjectId}
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
          />
        </div>

        {/* Preview Panel */}
        <div className="flex-1">
          <PreviewPanel
            html={previewHtml}
            versionLabel={`v${generationCount + 1}`}
            lastUpdated={lastUpdatedLabel}
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
