import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { oneriGetir } from "@/lib/oneri-motoru";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const sb = createSupabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { limit = 20 } = await req.json().catch(() => ({ limit: 20 }));

  try {
    const urunler = await oneriGetir(user.id, limit);
    return NextResponse.json({ urunler });
  } catch (e: any) {
    return NextResponse.json({ urunler: [], error: e.message }, { status: 200 });
  }
}
