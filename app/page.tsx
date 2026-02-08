import { BuilderHeader } from "@/components/BuilderHeader";
import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";

export default function Home() {
  return (
    <div className="min-h-screen px-6 py-6 text-white">
      <main className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1440px] flex-col gap-6">
        <BuilderHeader />
        <section className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1.25fr]">
          <ChatPanel />
          <PreviewPanel />
        </section>
      </main>
    </div>
  );
}
