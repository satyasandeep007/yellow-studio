"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

export default function ProjectsIndex() {
  const router = useRouter();
  const [status, setStatus] = useState("Checking wallet...");

  useEffect(() => {
    const provider =
      typeof window !== "undefined"
        ? (window as { ethereum?: EthereumProvider }).ethereum
        : undefined;
    if (!provider) {
      setStatus("Connect your wallet to open a project.");
      return;
    }

    provider
      .request({ method: "eth_accounts" })
      .then((accounts) => {
        const list = Array.isArray(accounts) ? (accounts as string[]) : [];
        if (!list.length) {
          setStatus("Connect your wallet to open a project.");
          return;
        }
        return fetch(`/api/db/projects?wallet=${list[0]}`);
      })
      .then((res) => (res ? res.json() : null))
      .then((data) => {
        const projectId = data?.projects?.[0]?.id;
        if (projectId) {
          router.replace(`/user/projects/${projectId}`);
        } else {
          setStatus("No projects yet. Create your first project.");
        }
      })
      .catch(() => {
        setStatus("Connect your wallet to open a project.");
      });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Chainva AI</h1>
        <p className="mt-2 text-sm text-gray-500">{status}</p>
      </div>
    </div>
  );
}
