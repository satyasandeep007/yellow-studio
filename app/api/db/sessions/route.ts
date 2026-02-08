import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const normalizeAddress = (address: string) => address.trim().toLowerCase();
const shortenAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

async function getOrCreateUser(walletAddress: string) {
  const normalized = normalizeAddress(walletAddress);
  const { data: existing } = await supabaseServer
    .from("users")
    .select("id")
    .or(`wallet_address.eq.${walletAddress},wallet_address.eq.${normalized}`)
    .single();
  if (existing?.id) return existing.id;

  const legacyAddress = shortenAddress(walletAddress);
  const legacyNormalized = shortenAddress(normalized);
  const { data: legacy } = await supabaseServer
    .from("users")
    .select("id")
    .or(`wallet_address.eq.${legacyAddress},wallet_address.eq.${legacyNormalized}`)
    .single();
  if (legacy?.id) {
    const { data: updated, error: updateError } = await supabaseServer
      .from("users")
      .update({ wallet_address: normalized })
      .eq("id", legacy.id)
      .select("id")
      .single();
    if (updateError) throw new Error(updateError.message);
    return updated.id;
  }

  const { data: created, error } = await supabaseServer
    .from("users")
    .insert({ wallet_address: normalized })
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

  const normalized = normalizeAddress(walletAddress);
  const { data: user } = await supabaseServer
    .from("users")
    .select("id")
    .or(`wallet_address.eq.${walletAddress},wallet_address.eq.${normalized}`)
    .single();

  if (!user?.id) {
    return NextResponse.json({ sessions: [] });
  }

  const { data, error } = await supabaseServer
    .from("yellow_sessions")
    .select("id,balance_usdc,total_tokens,status,created_at,ended_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ sessions: data || [] });
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
