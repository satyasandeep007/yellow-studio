import { useEffect, useMemo, useState } from "react";
import { updateSession, upsertSession } from "@/lib/projectApi";

type EthereumProvider = {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

export const useWalletSession = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionBalance, setSessionBalance] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionTokens, setSessionTokens] = useState(0);

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
    setSessionTokens(0);
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
    upsertSession(walletAddress, 0)
      .then((data) => {
        if (!data.session) return;
        setSessionId(data.session.id);
        setSessionBalance(Number(data.session.balance_usdc || 0));
        setSessionActive(data.session.status === "open");
        setSessionTokens(Number(data.session.total_tokens || 0));
      })
      .catch(() => {});
  }, [walletConnected, walletAddress]);

  return {
    ethereum,
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
  };
};
