import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

async function getOrCreateUser(walletAddress: string) {
  const { data: existing } = await supabaseServer
    .from("users")
    .select("id")
    .eq("wallet_address", walletAddress)
    .single();
  if (existing?.id) return existing.id;

  const { data: created, error } = await supabaseServer
    .from("users")
    .insert({ wallet_address: walletAddress })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return created.id;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get("wallet");
  if (!walletAddress) {
    return NextResponse.json({ error: "wallet is required" }, { status: 400 });
  }

  const { data: user } = await supabaseServer
    .from("users")
    .select("id")
    .eq("wallet_address", walletAddress)
    .single();

  if (!user?.id) {
    return NextResponse.json({ projects: [] });
  }

  const { data, error } = await supabaseServer
    .from("projects")
    .select("id,name,updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ projects: data || [] });
}

export async function POST(request: NextRequest) {
  const { walletAddress, name } = await request.json();
  if (!walletAddress || !name) {
    return NextResponse.json(
      { error: "walletAddress and name required" },
      { status: 400 }
    );
  }

  try {
    const userId = await getOrCreateUser(walletAddress);
    const { data, error } = await supabaseServer
      .from("projects")
      .insert({ user_id: userId, name })
      .select("id,name,updated_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ project: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
