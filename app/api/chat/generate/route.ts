import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
   try {
      const { prompt, model } = await request.json();

      if (!prompt) {
         return NextResponse.json(
            { error: "Prompt is required" },
            { status: 400 }
         );
      }

      const systemPrompt = `You are an expert web developer. Generate complete, production-ready HTML code based on the user's request. 

CRITICAL RULES:
1. Generate ONLY the HTML code - no explanations, no markdown, no code fences
2. Include inline CSS within <style> tags in the <head>
3. Include inline JavaScript within <script> tags if needed
4. Make it fully responsive and mobile-friendly
5. Use modern, clean design principles
6. Include all necessary meta tags and viewport settings
7. Use semantic HTML5 elements
8. Make it visually appealing with good color schemes and spacing

Return ONLY the HTML code starting with <!DOCTYPE html> and ending with </html>. Nothing else.`;

      // Model mapping
      let modelName = "gpt-4-turbo-preview";
      if (model === "gpt-3.5-turbo") {
         modelName = "gpt-3.5-turbo";
      } else if (model === "gpt-4o") {
         modelName = "gpt-4o";
      }

      const completion = await openai.chat.completions.create({
         model: modelName,
         messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
         ],
         temperature: 0.7,
         max_tokens: 4000,
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
