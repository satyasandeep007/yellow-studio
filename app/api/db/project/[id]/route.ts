import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;
  if (!projectId) {
    return NextResponse.json({ error: "project id required" }, { status: 400 });
  }

  const { data: project, error: projectError } = await supabaseServer
    .from("projects")
    .select("id,name,latest_html,updated_at")
    .eq("id", projectId)
    .single();

  if (projectError) {
    return NextResponse.json({ error: projectError.message }, { status: 500 });
  }

  const { data: messages, error: messagesError } = await supabaseServer
    .from("messages")
    .select("id,role,content,tokens,created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (messagesError) {
    return NextResponse.json({ error: messagesError.message }, { status: 500 });
  }

  const { data: generations, error: generationsError } = await supabaseServer
    .from("generations")
    .select("id,tokens,cost_usdc")
    .eq("project_id", projectId);

  if (generationsError) {
    return NextResponse.json({ error: generationsError.message }, { status: 500 });
  }

  const totals = (generations || []).reduce(
    (acc, row) => {
      acc.tokens += row.tokens || 0;
      acc.cost += Number(row.cost_usdc || 0);
      return acc;
    },
    { tokens: 0, cost: 0 }
  );

  return NextResponse.json({
    project,
    messages: messages || [],
    generationCount: generations?.length || 0,
    totals,
  });
}
