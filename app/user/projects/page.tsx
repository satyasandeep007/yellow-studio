"use client";

import { BuilderHeader } from "@/components/BuilderHeader";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { Sidebar } from "@/components/Sidebar";
import { WalletModal } from "@/components/WalletModal";
import { ProjectShell } from "@/components/project/ProjectShell";
import { useGeneration } from "@/lib/hooks/useGeneration";
import { useProjects } from "@/lib/hooks/useProjects";
import { useWalletSession } from "@/lib/hooks/useWalletSession";
import { connectToYellow } from "@/yellow/yellow";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [prompt, setPrompt] = useState(
    "Create a neon event landing page with countdown and registration form."
  );
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState("Awaiting render");
  const [previewMode, setPreviewMode] = useState<"code" | "preview">("code");
  const [selectedModel, setSelectedModel] = useState<
    "gpt-4" | "gpt-3.5-turbo" | "gpt-4o"
  >("gpt-4");


  useEffect(() => {
    console.log('connecting to yellow network...');
    connectToYellow();
  }, []);

  const {
    hasProvider,
    walletConnected,
    walletAddress,
    walletModalOpen,
    walletError,
    sessionActive,
    sessionBalance,
    sessionId,
    sessionTokens,
    setSessionTokens,
    setSessionBalance,
    handleConnectWallet,
    handleDisconnectWallet,
    handleConnectMetaMask,
    handleStartSession,
    handleEndSession,
    setWalletModalOpen,
  } = useWalletSession();

  const {
    projects,
    currentProjectId,
    currentProjectName,
    messages,
    setMessages,
    previewHtml,
    setPreviewHtml,
    generationCount,
    setGenerationCount,
    projectTokens,
    setProjectTokens,
    handleNewProject,
    handleSelectProject,
    resetProjectState,
  } = useProjects({
    walletConnected,
    walletAddress,
    urlProjectId: null,
  });

  const canGenerate = walletConnected && sessionActive;

  const { isGenerating, handleGenerate } = useGeneration({
    canGenerate,
    prompt,
    setPrompt,
    selectedModel,
    messages,
    setMessages,
    previewHtml,
    setPreviewHtml,
    currentProjectId,
    generationCount,
    setGenerationCount,
    setLastUpdatedLabel,
    setPreviewMode,
    projectTokens,
    setProjectTokens,
    sessionTokens,
    setSessionTokens,
    sessionId,
    sessionBalance,
    setSessionBalance,
    currentProjectName,
  });

  const handleCreateProject = () => {
    if (!walletAddress) return;
    const projectName = window.prompt("Name your project");
    if (!projectName?.trim()) return;
    handleNewProject(projectName.trim())
      .then(() => {
        resetProjectState();
        setPrompt("");
      })
      .catch(() => {});
  };

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
          onNewProject={handleCreateProject}
        />
      }
      chat={
        <ChatPanel
          prompt={prompt}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          canGenerate={canGenerate && Boolean(currentProjectId)}
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
