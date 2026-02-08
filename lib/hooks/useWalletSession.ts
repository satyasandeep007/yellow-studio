import { useEffect, useMemo, useState } from "react";
import { fetchSessions, updateSession, upsertSession } from "@/lib/projectApi";
import { createPaymentSession, setupMessageSigner } from "@/yellow/yellow";

type EthereumProvider = {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

export const useWalletSession = (options?: {
  onDisconnect?: () => void;
  onWalletChange?: (address: string) => void;
}) => {
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
    options?.onDisconnect?.();
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

    console.log('starting session...');
    setupMessageSigner().then(({ userAddress, messageSigner }) => {
      console.log('messageSigner', userAddress);
      createPaymentSession(messageSigner, userAddress);
      
    });


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
      setSessionTokens(0);
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
        setSessionTokens(0);
      })
      .catch(() => {
        setSessionActive(false);
        setSessionId(null);
        setSessionTokens(0);
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
        options?.onDisconnect?.();
        return;
      }
      setWalletAddress(list[0]);
      setWalletConnected(true);
      options?.onWalletChange?.(list[0]);
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
    fetchSessions(walletAddress)
      .then((data) => {
        const sessions = data.sessions || [];
        if (!sessions.length) {
          setSessionId(null);
          setSessionBalance(0);
          setSessionTokens(0);
          setSessionActive(false);
          return;
        }
        const openSession = sessions.find((session) => session.status === "open");
        const latest = openSession ?? sessions[0];
        setSessionId(latest.id);
        setSessionBalance(Number(latest.balance_usdc || 0));
        setSessionTokens(Number(latest.total_tokens || 0));
        setSessionActive(latest.status === "open");
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
