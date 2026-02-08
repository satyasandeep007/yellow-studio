import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
   try {
      const { prompt, model, messages, currentCode, stream } = await request.json();

      if (!prompt) {
         return NextResponse.json(
            { error: "Prompt is required" },
            { status: 400 }
         );
      }

      const systemPrompt = `You are an expert web developer. Generate complete, production-ready HTML based on the user's request and prior context.

CRITICAL RULES:
1. Generate ONLY the HTML code - no explanations, no markdown, no code fences
2. Include inline CSS within <style> tags in the <head>
3. Include inline JavaScript within <script> tags if needed
4. Make it fully responsive and mobile-friendly
5. Use modern, clean design principles
6. Include all necessary meta tags and viewport settings
7. Use semantic HTML5 elements
8. Make it visually appealing with good color schemes and spacing
9. If existing HTML is provided, MODIFY it to apply the user's latest request while preserving the rest of the design
10. If the user asks for changes, apply only those changes and keep all other sections intact

Return ONLY the HTML code starting with <!DOCTYPE html> and ending with </html>. Nothing else.`;

      // Model mapping
      let modelName = "gpt-4-turbo-preview";
      if (model === "gpt-3.5-turbo") {
         modelName = "gpt-3.5-turbo";
      } else if (model === "gpt-4o") {
         modelName = "gpt-4o";
      }

      const history = Array.isArray(messages)
         ? messages
              .filter((message) => message?.role && message?.content)
              .slice(-8)
              .map((message) => ({
                 role: message.role,
                 content: message.content,
              }))
         : [];

      const compactCode = currentCode
         ? String(currentCode)
              .replace(/\s+/g, " ")
              .slice(0, 20000)
         : "";

      const requestMessages = [
         { role: "system", content: systemPrompt },
         ...(compactCode
            ? [
                 {
                    role: "system",
                    content: `Current HTML code to update:\n${compactCode}`,
                 },
              ]
            : []),
         ...history,
         { role: "user", content: prompt },
      ];

      if (stream) {
         const streamResponse = await openai.chat.completions.create({
            model: modelName,
            messages: requestMessages,
            temperature: 0.5,
            max_tokens: 3000,
            stream: true,
            stream_options: { include_usage: true },
         });

         const encoder = new TextEncoder();
         const readableStream = new ReadableStream({
            async start(controller) {
               try {
                  for await (const chunk of streamResponse) {
                     const delta = chunk.choices?.[0]?.delta?.content;
                     if (delta) {
                        controller.enqueue(
                           encoder.encode(
                              `data: ${JSON.stringify({ type: "delta", content: delta })}\n\n`
                           )
                        );
                     }
                     if (chunk.usage) {
                        controller.enqueue(
                           encoder.encode(
                              `data: ${JSON.stringify({ type: "usage", usage: chunk.usage })}\n\n`
                           )
                        );
                     }
                  }
                  controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                  controller.close();
               } catch (error) {
                  const message =
                     error instanceof Error ? error.message : "Stream error";
                  controller.enqueue(
                     encoder.encode(
                        `data: ${JSON.stringify({ type: "error", message })}\n\n`
                     )
                  );
                  controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                  controller.close();
               }
            },
         });

         return new Response(readableStream, {
            headers: {
               "Content-Type": "text/event-stream",
               "Cache-Control": "no-cache, no-transform",
               Connection: "keep-alive",
            },
         });
      }

      const completion = await openai.chat.completions.create({
         model: modelName,
         messages: requestMessages,
         temperature: 0.6,
         max_tokens: 3000,
      });

      const generatedCode = completion.choices[0]?.message?.content || "";
      const usage = completion.usage;

      return NextResponse.json({
         code: generatedCode,
         model: model || "gpt-4",
         tokens: {
            prompt: usage?.prompt_tokens || 0,
            completion: usage?.completion_tokens || 0,
            total: usage?.total_tokens || 0,
         },
      });
   } catch (error) {
      console.error("OpenAI API Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate code";
      return NextResponse.json(
         { error: errorMessage },
         { status: 500 }
      );
   }
}
