import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  const { projectId, prompt, html, model, tokens, costUsdc } =
    await request.json();
  if (!projectId || !prompt || !html) {
    return NextResponse.json(
      { error: "projectId, prompt, html required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("generations")
    .insert({
      project_id: projectId,
      prompt,
      html,
      model,
      tokens: tokens || 0,
      cost_usdc: costUsdc || 0,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data?.id });
}
