"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

type SessionRow = {
  id: string;
  balance_usdc: number;
  total_tokens: number;
  status: string;
  created_at: string;
  ended_at: string | null;
};

export default function SessionsPage() {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState("");
  const [sessions, setSessions] = useState<SessionRow[]>([]);

  useEffect(() => {
    const provider =
      typeof window !== "undefined"
        ? (window as { ethereum?: EthereumProvider }).ethereum
        : undefined;
    if (!provider) return;
    provider
      .request({ method: "eth_accounts" })
      .then((accounts) => {
        const list = Array.isArray(accounts) ? (accounts as string[]) : [];
        if (!list.length) return;
        const address = list[0].toLowerCase();
        setWalletAddress(address);
        return fetch(`/api/db/sessions?wallet=${address}`);
      })
      .then((res) => (res ? res.json() : null))
      .then((data) => {
        setSessions(data?.sessions || []);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          projects={[]}
          currentProjectId=""
          onSelectProject={() => {}}
          onNewProject={() => router.push("/user/projects")}
        />
        <div className="flex-1 overflow-auto p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Sessions</h1>
              <p className="text-sm text-gray-500">
                Wallet: {walletAddress || "Connect wallet"}
              </p>
            </div>
            <button
              onClick={() => router.push("/user/projects")}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Back to projects
            </button>
          </div>

          {sessions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">
              No sessions yet.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="grid grid-cols-5 gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <span>Session</span>
                <span>Status</span>
                <span>Tokens</span>
                <span>Balance</span>
                <span>Started</span>
              </div>
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="grid grid-cols-5 gap-2 border-b border-gray-100 px-4 py-3 text-sm text-gray-700"
                >
                  <span className="font-mono text-xs text-gray-500">
                    {session.id.slice(0, 8)}...
                  </span>
                  <span className="text-xs uppercase tracking-wider text-gray-500">
                    {session.status}
                  </span>
                  <span className="font-medium">
                    {Number(session.total_tokens || 0).toLocaleString()}
                  </span>
                  <span>{Number(session.balance_usdc || 0).toFixed(2)} USDC</span>
                  <span className="text-xs text-gray-500">
                    {new Date(session.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
