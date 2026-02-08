import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createProject, ensureUser, fetchProject, fetchProjects } from "@/lib/projectApi";

type ProjectRow = {
  id: string;
  name: string;
  updated_at?: string;
};

type Message = {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  tokens?: number;
};

export const useProjects = ({
  walletConnected,
  walletAddress,
  urlProjectId,
}: {
  walletConnected: boolean;
  walletAddress: string;
  urlProjectId?: string | null;
}) => {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [previewHtml, setPreviewHtml] = useState("");
  const [generationCount, setGenerationCount] = useState(0);
  const [projectTokens, setProjectTokens] = useState(0);

  const currentProjectName = useMemo(
    () => projects.find((project) => project.id === currentProjectId)?.name || "",
    [projects, currentProjectId]
  );

  const resetProjectState = () => {
    setMessages([]);
    setPreviewHtml("");
    setGenerationCount(0);
    setProjectTokens(0);
  };

  const handleNewProject = async (name: string) => {
    const data = await createProject(walletAddress, name);
    if (!data.project) return null;
    setProjects((prev) => [data.project, ...prev]);
    setCurrentProjectId(data.project.id);
    router.push(`/user/projects/${data.project.id}`);
    resetProjectState();
    return data.project.id;
  };

  const loadProject = async (projectId: string) => {
    const data = await fetchProject(projectId);
    setPreviewHtml(data.project?.latest_html || "");
    setMessages(data.messages || []);
    setGenerationCount(data.generationCount || 0);
    setProjectTokens(data.totals?.tokens || 0);
  };

  const handleSelectProject = async (projectId: string) => {
    setCurrentProjectId(projectId);
    router.push(`/user/projects/${projectId}`);
    await loadProject(projectId);
  };

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
          return loadProject(fallbackId);
        }
        return null;
      })
      .catch(() => {});
  }, [walletConnected, walletAddress, urlProjectId, router]);

  return {
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
  };
};
