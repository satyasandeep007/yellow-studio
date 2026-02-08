import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  const { walletAddress } = await request.json();
  if (!walletAddress) {
    return NextResponse.json({ error: "walletAddress required" }, { status: 400 });
  }

  const { data: existing, error: existingError } = await supabaseServer
    .from("users")
    .select("*")
    .eq("wallet_address", walletAddress)
    .single();

  if (existingError && existingError.code !== "PGRST116") {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json({ user: existing });
  }

  const { data, error } = await supabaseServer
    .from("users")
    .insert({ wallet_address: walletAddress })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data });
}
