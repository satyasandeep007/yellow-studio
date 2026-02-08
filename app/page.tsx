"use client";

import { BuilderHeader } from "@/components/BuilderHeader";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState(
    "Create a neon event landing page with countdown and registration form."
  );
  const [previewHtml, setPreviewHtml] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionBalance, setSessionBalance] = useState(0);
  const [generationCount, setGenerationCount] = useState(0);
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState("Awaiting render");
  const [messages, setMessages] = useState([
    {
      id: "sys-1",
      role: "system" as const,
      content: "Tell me the vibe, sections, and any must-have interactions.",
    },
    {
      id: "user-1",
      role: "user" as const,
      content:
        "Create a neon event landing page with countdown and registration form.",
    },
    {
      id: "assistant-1",
      role: "assistant" as const,
      content: "Drafting hero, schedule, speakers, and CTA. Rendering preview now.",
      meta: "Generation #1 • 0.08 USDC",
    },
  ]);

  const walletAddress = "0xA13...9B2";
  const canGenerate = walletConnected && sessionActive;

  const handleConnectWallet = () => setWalletConnected(true);
  const handleDisconnectWallet = () => {
    setWalletConnected(false);
    setSessionActive(false);
    setSessionBalance(0);
  };
  const handleStartSession = () => {
    if (!walletConnected) return;
    setSessionActive(true);
    setSessionBalance(9.8);
  };
  const handleEndSession = () => {
    setSessionActive(false);
  };

  const handleGenerate = () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    const sanitizedPrompt = prompt || "A neon event landing page";
    const demoHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Chainva Preview</title>
    <style>
      :root {
        color-scheme: light;
      }
      * {
        box-sizing: border-box;
        font-family: "Space Grotesk", Arial, sans-serif;
      }
      body {
        margin: 0;
        background: radial-gradient(circle at top, #1b1f2a, #0b0d12 50%, #07080c);
        color: #f5f7ff;
      }
      .hero {
        padding: 48px 40px;
        display: grid;
        gap: 24px;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        border-radius: 999px;
        border: 1px solid rgba(57, 255, 136, 0.4);
        background: rgba(57, 255, 136, 0.08);
        font-size: 12px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #9dffd0;
      }
      h1 {
        font-size: 36px;
        margin: 0;
      }
      p {
        margin: 0;
        line-height: 1.6;
        color: rgba(245, 247, 255, 0.7);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 16px;
      }
      .card {
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.04);
        padding: 16px;
      }
      .cta {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 22px;
        border-radius: 999px;
        background: #39ff88;
        color: #0b0d12;
        text-decoration: none;
        font-weight: 600;
        margin-top: 12px;
      }
    </style>
  </head>
  <body>
    <section class="hero">
      <span class="badge">Chainva Preview</span>
      <h1>${sanitizedPrompt}</h1>
      <p>Neon gradients, bold typography, and a countdown-ready layout generated in seconds.</p>
      <div class="grid">
        <div class="card">
          <strong>Countdown</strong>
          <p>12 days · 8 hours · 24 minutes</p>
        </div>
        <div class="card">
          <strong>Speakers</strong>
          <p>6 industry leaders announced</p>
        </div>
        <div class="card">
          <strong>Register</strong>
          <p>Early access list is open</p>
        </div>
      </div>
      <a class="cta" href="#">Join the Event</a>
    </section>
  </body>
</html>`;

    setTimeout(() => {
      setPreviewHtml(demoHtml);
      const nextCount = generationCount + 1;
      setGenerationCount(nextCount);
      setLastUpdatedLabel("Updated just now");
      setSessionBalance((prev) => Math.max(0, Number((prev - 0.08).toFixed(2))));
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${nextCount + 1}`,
          role: "user",
          content: sanitizedPrompt,
        },
        {
          id: `assistant-${nextCount + 1}`,
          role: "assistant",
          content: "Generated hero, countdown, and registration CTA layout.",
          meta: `Generation #${nextCount + 1} • 0.08 USDC`,
        },
      ]);
      setIsGenerating(false);
    }, 450);
  };

  return (
    <div className="min-h-screen px-6 py-6 text-white">
      <main className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1440px] flex-col gap-6">
        <BuilderHeader
          walletConnected={walletConnected}
          walletAddress={walletAddress}
          onConnectWallet={handleConnectWallet}
          onDisconnectWallet={handleDisconnectWallet}
          sessionActive={sessionActive}
          sessionBalance={sessionBalance}
          onStartSession={handleStartSession}
          onEndSession={handleEndSession}
        />
        <section className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1.25fr]">
          <ChatPanel
            prompt={prompt}
            onPromptChange={setPrompt}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            canGenerate={canGenerate}
            messages={messages}
          />
          <PreviewPanel
            html={previewHtml}
            versionLabel={`Version v${generationCount + 1}`}
            lastUpdated={lastUpdatedLabel}
          />
        </section>
      </main>
    </div>
  );
}
