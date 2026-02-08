import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const normalizeAddress = (address: string) => address.trim().toLowerCase();

const shortenAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

export async function POST(request: NextRequest) {
  const { walletAddress } = await request.json();
  if (!walletAddress) {
    return NextResponse.json({ error: "walletAddress required" }, { status: 400 });
  }

  const normalized = normalizeAddress(walletAddress);

  const { data: existing, error: existingError } = await supabaseServer
    .from("users")
    .select("*")
    .or(`wallet_address.eq.${walletAddress},wallet_address.eq.${normalized}`)
    .single();

  if (existingError && existingError.code !== "PGRST116") {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json({ user: existing });
  }

  const legacyAddress = shortenAddress(walletAddress);
  const legacyNormalized = shortenAddress(normalized);
  const { data: legacy } = await supabaseServer
    .from("users")
    .select("*")
    .or(`wallet_address.eq.${legacyAddress},wallet_address.eq.${legacyNormalized}`)
    .single();

  if (legacy?.id) {
    const { data: updated, error: updateError } = await supabaseServer
      .from("users")
      .update({ wallet_address: normalized })
      .eq("id", legacy.id)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return NextResponse.json({ user: updated });
  }

  const { data, error } = await supabaseServer
    .from("users")
    .insert({ wallet_address: normalized })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data });
}
