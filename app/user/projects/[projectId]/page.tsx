"use client";

import { BuilderHeader } from "@/components/BuilderHeader";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { Sidebar } from "@/components/Sidebar";
import { WalletModal } from "@/components/WalletModal";
import { ProjectShell } from "@/components/project/ProjectShell";
import {
  createGeneration,
  createMessage,
  createProject,
  createTransaction,
  ensureUser,
  fetchProject,
  fetchProjects,
  updateProject,
  updateSession,
  upsertSession,
} from "@/lib/projectApi";
import { streamGeneration } from "@/lib/streamGeneration";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type EthereumProvider = {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

export default function ProjectPage() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();
  const urlProjectId = params?.projectId;

  const [prompt, setPrompt] = useState(
    "Create a neon event landing page with countdown and registration form."
  );
  const [previewHtml, setPreviewHtml] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionBalance, setSessionBalance] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
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
  const [projectTokens, setProjectTokens] = useState(0);
  const [sessionTokens, setSessionTokens] = useState(0);
  const canGenerate = walletConnected && sessionActive;
  const currentProjectName =
    projects.find((project) => project.id === currentProjectId)?.name || "";

  const ethereum = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return (window as { ethereum?: EthereumProvider }).ethereum;
  }, []);

  const hasProvider = Boolean(ethereum);

  const handleConnectWallet = () => {
    setWalletError(null);
    setWalletModalOpen(true);
  };
  const handleDisconnectWallet = () => {
    setWalletConnected(false);
    setSessionActive(false);
    setSessionBalance(0);
    setSessionId(null);
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
      setWalletAddress(accounts[0]);
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
    upsertSession(walletAddress, 9.8)
      .then((data) => {
        if (!data.session) return;
        setSessionId(data.session.id);
        setSessionBalance(Number(data.session.balance_usdc || 0));
        setSessionActive(true);
        setSessionTokens(Number(data.session.total_tokens || 0));
      })
      .catch(() => {});
  };
  const handleEndSession = () => {
    if (!sessionId) {
      setSessionActive(false);
      return;
    }
    updateSession({
      sessionId,
      balanceUsdc: sessionBalance,
      status: "closed",
      totalTokens: sessionTokens,
    })
      .then(() => {
        setSessionActive(false);
        setSessionId(null);
      })
      .catch(() => {
        setSessionActive(false);
        setSessionId(null);
      });
  };

  const handleNewProject = () => {
    if (!walletAddress) return;
    const projectName = window.prompt("Name your project");
    if (!projectName?.trim()) return;
    createProject(walletAddress, projectName.trim())
      .then((data) => {
        if (!data.project) return;
        setProjects((prev) => [data.project, ...prev]);
        setCurrentProjectId(data.project.id);
        router.push(`/user/projects/${data.project.id}`);
        setMessages([]);
        setPreviewHtml("");
        setGenerationCount(0);
        setPrompt("");
      })
      .catch(() => {});
  };

  const handleSelectProject = (projectId: string) => {
    setCurrentProjectId(projectId);
    router.push(`/user/projects/${projectId}`);
    fetchProject(projectId)
      .then((data) => {
        if (data?.project?.latest_html) {
          setPreviewHtml(data.project.latest_html);
        } else {
          setPreviewHtml("");
        }
        setMessages(data.messages || []);
        setGenerationCount(data.generationCount || 0);
        setProjectTokens(data.totals?.tokens || 0);
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

    const nextCount = generationCount + 1;
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: sanitizedPrompt,
      },
    ]);
    createMessage({
      projectId: currentProjectId,
      role: "user",
      content: sanitizedPrompt,
      tokens: 0,
    }).catch(() => {});

    setPrompt("");

    try {
      const { generatedCode, tokens } = await streamGeneration(
        {
          prompt: sanitizedPrompt,
          model: selectedModel,
          messages: historyForApi,
          currentCode: previewHtml || "",
        },
        setPreviewHtml
      );

      setGenerationCount(nextCount);
      setLastUpdatedLabel("Updated just now");
      const nextBalance = Math.max(
        0,
        Number((sessionBalance - 0.08).toFixed(2))
      );
      setSessionBalance(nextBalance);
      if (sessionId) {
        updateSession({
          sessionId,
          balanceUsdc: nextBalance,
          status: "open",
        }).catch(() => {});
      }
      if (tokens?.total) {
        setProjectTokens((prev) => prev + tokens.total);
        setSessionTokens((prev) => prev + tokens.total);
        if (sessionId) {
          updateSession({
            sessionId,
            balanceUsdc: nextBalance,
            status: "open",
            totalTokens: sessionTokens + tokens.total,
          }).catch(() => {});
        }
      }
      setPreviewMode("preview");

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

      createMessage({
        projectId: currentProjectId,
        role: "assistant",
        content: assistantMessage.content,
        tokens: assistantMessage.tokens || 0,
      }).catch(() => {});

      createGeneration({
        projectId: currentProjectId,
        prompt: sanitizedPrompt,
        html: generatedCode,
        model: selectedModel,
        tokens: tokens?.total || 0,
        costUsdc: 0.08,
      }).catch(() => {});

      const shouldRename =
        currentProjectName.trim().length === 0 ||
        currentProjectName.toLowerCase().startsWith("untitled project");

      updateProject({
        projectId: currentProjectId,
        latestHtml: generatedCode,
        name: shouldRename
          ? sanitizedPrompt.length > 60
            ? `${sanitizedPrompt.slice(0, 57)}...`
            : sanitizedPrompt
          : undefined,
      }).catch(() => {});

      if (sessionId) {
        createTransaction({
          sessionId,
          amountUsdc: 0.08,
          txHash: null,
        }).catch(() => {});
      }
    } catch (error) {
      console.error("Generation error:", error);

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
      setWalletAddress(list[0]);
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
    ensureUser(walletAddress)
      .then(() => fetchProjects(walletAddress))
      .then((data) => {
        const list = data.projects || [];
        setProjects(list);
        const fallbackId = urlProjectId || list[0]?.id;
        if (fallbackId) {
          setCurrentProjectId(fallbackId);
          if (fallbackId !== urlProjectId) {
            router.replace(`/user/projects/${fallbackId}`);
          }
          return fetchProject(fallbackId);
        }
        return null;
      })
      .then((data) => {
        if (!data) return;
        setPreviewHtml(data.project?.latest_html || "");
        setMessages(data.messages || []);
        setGenerationCount(data.generationCount || 0);
        setProjectTokens(data.totals?.tokens || 0);
      })
      .catch(() => {});

    upsertSession(walletAddress, 0)
      .then((data) => {
        if (!data.session) return;
        setSessionId(data.session.id);
        setSessionBalance(Number(data.session.balance_usdc || 0));
        setSessionActive(data.session.status === "open");
        setSessionTokens(Number(data.session.total_tokens || 0));
      })
      .catch(() => {});
  }, [walletConnected, walletAddress, urlProjectId, router]);

  return (
    <ProjectShell
      header={
        <BuilderHeader
          walletConnected={walletConnected}
          walletAddress={walletAddress}
          onConnectWallet={handleConnectWallet}
          onDisconnectWallet={handleDisconnectWallet}
          sessionActive={sessionActive}
          sessionBalance={sessionBalance}
          onStartSession={handleStartSession}
          onEndSession={handleEndSession}
          sessionTokens={sessionTokens}
        />
      }
      sidebar={
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
      }
      chat={
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
      }
      preview={
        <PreviewPanel
          html={previewHtml}
          versionLabel={`v${generationCount + 1}`}
          lastUpdated={lastUpdatedLabel}
          isStreaming={isGenerating}
          viewMode={previewMode}
          onViewModeChange={setPreviewMode}
        />
      }
      walletModal={
        <WalletModal
          open={walletModalOpen}
          onClose={() => setWalletModalOpen(false)}
          onConnectMetaMask={handleConnectMetaMask}
          hasProvider={hasProvider}
          errorMessage={walletError}
        />
      }
    />
  );
}
