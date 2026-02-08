import { useState } from "react";
import {
  createGeneration,
  createMessage,
  createTransaction,
  updateProject,
  updateSession,
} from "@/lib/projectApi";
import { streamGeneration } from "@/lib/streamGeneration";

type Message = {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  meta?: string;
  tokens?: number;
};

type GenerationParams = {
  canGenerate: boolean;
  prompt: string;
  setPrompt: (value: string) => void;
  selectedModel: string;
  messages: Message[];
  setMessages: (value: Message[] | ((prev: Message[]) => Message[])) => void;
  previewHtml: string;
  setPreviewHtml: (value: string) => void;
  currentProjectId: string | null;
  generationCount: number;
  setGenerationCount: (value: number) => void;
  setLastUpdatedLabel: (value: string) => void;
  setPreviewMode: (value: "code" | "preview") => void;
  projectTokens: number;
  setProjectTokens: (value: number | ((prev: number) => number)) => void;
  sessionTokens: number;
  setSessionTokens: (value: number | ((prev: number) => number)) => void;
  sessionId: string | null;
  sessionBalance: number;
  setSessionBalance: (value: number | ((prev: number) => number)) => void;
  currentProjectName: string;
};

export const useGeneration = (params: GenerationParams) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    const {
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
      setProjectTokens,
      sessionTokens,
      setSessionTokens,
      sessionId,
      sessionBalance,
      setSessionBalance,
      currentProjectName,
    } = params;

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
    }).catch(() => { });

    setPrompt("");

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { generatedCode, tokens }: { generatedCode: string; tokens: any } = await streamGeneration(
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
        }).catch(() => { });
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
          }).catch(() => { });
        }
      }

      setPreviewMode("preview");

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
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
      }).catch(() => { });

      createGeneration({
        projectId: currentProjectId,
        prompt: sanitizedPrompt,
        html: generatedCode,
        model: selectedModel,
        tokens: tokens?.total || 0,
        costUsdc: 0.08,
      }).catch(() => { });

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
      }).catch(() => { });

      if (sessionId) {
        createTransaction({
          sessionId,
          amountUsdc: 0.08,
          txHash: null,
        }).catch(() => { });
      }
    } catch (error) {
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

  return { isGenerating, handleGenerate };
};
