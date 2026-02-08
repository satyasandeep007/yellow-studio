type StreamPayload = {
  prompt: string;
  model: string;
  messages: Array<{ role: string; content: string }>;
  currentCode: string;
};

export const streamGeneration = async (
  payload: StreamPayload,
  onDelta: (html: string) => void
) => {
  const response = await fetch("/api/chat/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  let generatedCode = "";
  let tokens: { total?: number } | undefined;

  if (contentType.includes("text/event-stream") && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith("data:")) continue;
        const data = line.replace(/^data:\s*/, "");
        if (data === "[DONE]") {
          streamDone = true;
          break;
        }
        const payloadChunk = JSON.parse(data) as {
          type?: string;
          content?: string;
          usage?: { total_tokens?: number };
          message?: string;
        };
        if (payloadChunk.type === "delta" && payloadChunk.content) {
          generatedCode += payloadChunk.content;
          onDelta(generatedCode);
        } else if (payloadChunk.type === "usage") {
          tokens = { total: payloadChunk.usage?.total_tokens ?? 0 };
        } else if (payloadChunk.type === "error") {
          throw new Error(payloadChunk.message || "Stream error");
        }
      }
    }
  } else {
    const data = await response.json();
    generatedCode = data.code;
    tokens = data.tokens;
    onDelta(generatedCode);
  }

  if (!generatedCode) {
    throw new Error("No code returned from the model.");
  }

  return { generatedCode, tokens };
};
