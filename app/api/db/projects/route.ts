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
    const legacyAddress = shortenAddress(walletAddress);
    const legacyNormalized = shortenAddress(normalized);
    const { data: legacy } = await supabaseServer
      .from("users")
      .select("id")
      .or(`wallet_address.eq.${legacyAddress},wallet_address.eq.${legacyNormalized}`)
      .single();
    if (!legacy?.id) {
      return NextResponse.json({ projects: [] });
    }
    const { data: updated, error: updateError } = await supabaseServer
      .from("users")
      .update({ wallet_address: normalized })
      .eq("id", legacy.id)
      .select("id")
      .single();
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    const { data, error } = await supabaseServer
      .from("projects")
      .select("id,name,updated_at")
      .eq("user_id", updated.id)
      .order("updated_at", { ascending: false });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ projects: data || [] });
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
