type Json = Record<string, unknown>;

export type ProjectRow = {
  id: string;
  name: string;
  updated_at?: string;
};

export type ProjectDetails = {
  project?: { latest_html?: string };
  messages?: Array<{
    id: string;
    role: "system" | "user" | "assistant";
    content: string;
    tokens?: number;
  }>;
  generationCount?: number;
  totals?: { tokens?: number };
};

export type SessionRow = {
  id: string;
  balance_usdc: number;
  status: string;
  total_tokens?: number;
};

const fetchJson = async <T>(input: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
};

const normalizeWallet = (walletAddress: string) => walletAddress.toLowerCase();

export const ensureUser = (walletAddress: string) =>
  fetchJson<{ user: Json }>("/api/db/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress: normalizeWallet(walletAddress) }),
  });

export const fetchProjects = (walletAddress: string) =>
  fetchJson<{ projects: ProjectRow[] }>(
    `/api/db/projects?wallet=${normalizeWallet(walletAddress)}`
  );

export const createProject = (walletAddress: string, name: string) =>
  fetchJson<{ project: ProjectRow }>("/api/db/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      walletAddress: normalizeWallet(walletAddress),
      name,
    }),
  });

export const fetchProject = (projectId: string) =>
  fetchJson<ProjectDetails>(`/api/db/project/${projectId}`);

export const createMessage = (payload: {
  projectId: string;
  role: "system" | "user" | "assistant";
  content: string;
  tokens?: number;
}) =>
  fetchJson<Json>("/api/db/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectId: payload.projectId,
      role: payload.role,
      content: payload.content,
      tokens: payload.tokens || 0,
    }),
  });

export const createGeneration = (payload: {
  projectId: string;
  prompt: string;
  html: string;
  model: string;
  tokens: number;
  costUsdc: number;
}) =>
  fetchJson<Json>("/api/db/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const updateProject = (payload: {
  projectId: string;
  latestHtml: string;
  name?: string;
}) =>
  fetchJson<Json>("/api/db/projects/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const upsertSession = (walletAddress: string, balanceUsdc: number) =>
  fetchJson<{ session: SessionRow }>("/api/db/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      walletAddress: normalizeWallet(walletAddress),
      balanceUsdc,
    }),
  });

export const updateSession = (payload: {
  sessionId: string;
  balanceUsdc: number;
  status: "open" | "closed";
  totalTokens?: number;
}) =>
  fetchJson<{ session: SessionRow }>("/api/db/sessions", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const createTransaction = (payload: {
  sessionId: string;
  amountUsdc: number;
  txHash: string | null;
}) =>
  fetchJson<Json>("/api/db/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
