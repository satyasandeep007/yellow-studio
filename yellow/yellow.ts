"use client";
import { createAppSessionMessage, parseAnyRPCResponse } from "@erc7824/nitrolite";

// Connect to Yellow Network (using sandbox for testing)
export const connectToYellow = () => {
  console.log('connecting to yellow network...');
  const ws = new WebSocket("wss://clearnet-sandbox.yellow.com/ws");

  ws.onopen = () => {
    console.log("✅ Connected to Yellow Network!");
  };

  ws.onmessage = (event) => {
    try {
      console.log(event.data);
      // const message = parseAnyRPCResponse(event.data.sig);
      // console.log("📨 Received:", message);
    } catch (err) {
      // Nitrolite expects { res: [id, method, params, timestamp] }; Yellow may send a different format.
      const raw = typeof event.data === "string" ? event.data : "";
      let parsed: unknown = null;
      try {
        parsed = raw ? JSON.parse(raw) : null;
      } catch {
        // ignore
      }
      console.warn("📨 RPC parse failed (using raw message):", err instanceof Error ? err.message : err);
      console.log("📨 Raw message:", parsed ?? raw);
    }
  };

  ws.onerror = (error) => {
    console.error("Connection error:", error);
  };

  console.log("Connecting to Yellow Network...");
};

// Set up message signer for your wallet
export const setupMessageSigner = async () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask");
  }

  // Request wallet connection
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const userAddress = accounts[0];

  // Create message signer function
  const messageSigner = async (message) => {
    return await window.ethereum.request({
      method: "personal_sign",
      params: [message, userAddress],
    });
  };

  console.log("✅ Wallet connected:", userAddress);
  return { userAddress, messageSigner };
}
