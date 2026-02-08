import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  const { projectId, role, content, tokens } = await request.json();
  if (!projectId || !role || !content) {
    return NextResponse.json(
      { error: "projectId, role, content required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("messages")
    .insert({
      project_id: projectId,
      role,
      content,
      tokens: tokens || 0,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data?.id });
}
