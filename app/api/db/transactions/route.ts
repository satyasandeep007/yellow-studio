import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  const { sessionId, amountUsdc, txHash } = await request.json();
  if (!sessionId || amountUsdc === undefined) {
    return NextResponse.json(
      { error: "sessionId and amountUsdc required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("transactions")
    .insert({
      session_id: sessionId,
      amount_usdc: amountUsdc,
      tx_hash: txHash,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data?.id });
}
