"use client";
import {
  createAppSessionMessage,
  parseAnyRPCResponse,
} from "@erc7824/nitrolite";

const ws = new WebSocket("wss://clearnet-sandbox.yellow.com/ws");

// Connect to Yellow Network (using sandbox for testing)
export const connectToYellow = () => {
  console.log("connecting to yellow network...");

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
      console.warn(
        "📨 RPC parse failed (using raw message):",
        err instanceof Error ? err.message : err,
      );
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

  // Create message signer function.
  // personal_sign requires a string; nitrolite passes payload = [requestId, method, params, timestamp].
  const messageSigner = async (payload: unknown) => {
    const message =
      typeof payload === "string"
        ? payload
        : JSON.stringify(payload, (_, v) =>
            typeof v === "bigint" ? v.toString() : v,
          );
    return await window.ethereum.request({
      method: "personal_sign",
      params: [message, userAddress],
    });
  };

  console.log("✅ Wallet connected:", userAddress);
  return { userAddress, messageSigner };
};

export const createPaymentSession = async (
  messageSigner: any,
  userAddress: any,
) => {
  console.log("messageSigner: ", messageSigner, "userAddress: ", userAddress);
  const partnerAddress = "0x7EE860cDCc157998EaEF68f6B5387DE77fe3D02F";
  // Define your payment application
  const appDefinition = {
    protocol: "payment-app-v1",
    participants: [userAddress, partnerAddress],
    weights: [50, 50], // Equal participation
    quorum: 100, // Both participants must agree
    challenge: 0,
    nonce: Date.now(),
  };

  // Initial balances (1 USDC = 1,000,000 units with 6 decimals)
  const allocations = [
    { participant: userAddress, asset: "usdc", amount: "1000000" }, // 0.8 USDC
    { participant: partnerAddress, asset: "usdc", amount: "0" }, // 0.2 USDC
  ];

  // Create signed session message
  const sessionMessage = await createAppSessionMessage(messageSigner, [
    { definition: appDefinition, allocations },
  ]);

  // Send to ClearNode

  ws.send(sessionMessage);
  console.log("✅ Payment session created!");

  return { appDefinition, allocations };
};

export const sendPayment = async (messageSigner, amount, userAddress) => {
  const recipient = "0x7EE860cDCc157998EaEF68f6B5387DE77fe3D02F";
  // Create payment message
  const paymentData = {
    type: "payment",
    amount: amount.toString(),
    recipient,
    timestamp: Date.now(),
  };

  // Sign the payment
  const signature = await messageSigner(JSON.stringify(paymentData));

  const signedPayment = {
    ...paymentData,
    signature,
    sender: userAddress,
  };

  // Send instantly through ClearNode
  ws.send(JSON.stringify(signedPayment));
  console.log("💸 Payment sent instantly!");
};

// Usage
