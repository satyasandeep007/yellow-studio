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

export async function POST(request: NextRequest) {
  const { walletAddress, balanceUsdc } = await request.json();
  if (!walletAddress) {
    return NextResponse.json({ error: "walletAddress required" }, { status: 400 });
  }

  try {
    const userId = await getOrCreateUser(walletAddress);
    const { data: existing } = await supabaseServer
      .from("yellow_sessions")
      .select("id,balance_usdc,status,total_tokens")
      .eq("user_id", userId)
      .eq("status", "open")
      .single();

    if (existing?.id) {
      return NextResponse.json({ session: existing });
    }

    const { data, error } = await supabaseServer
      .from("yellow_sessions")
      .insert({
        user_id: userId,
        balance_usdc: balanceUsdc ?? 0,
        total_tokens: 0,
        status: "open",
      })
      .select("id,balance_usdc,status,total_tokens")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ session: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to open";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { sessionId, balanceUsdc, status, totalTokens } = await request.json();
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from("yellow_sessions")
    .update({
      balance_usdc: balanceUsdc,
      total_tokens: totalTokens,
      status,
      ended_at: status === "closed" ? new Date().toISOString() : null,
    })
    .eq("id", sessionId)
    .select("id,balance_usdc,status,total_tokens")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data });
}
