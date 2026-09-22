import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function GET() {
  const sb = createSupabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const admin = createSupabaseAdmin();
  const { data } = await admin
    .from("Favorite")
    .select("product_id")
    .eq("user_id", user.id);

  return NextResponse.json({ favoriler: (data ?? []).map((f: any) => f.product_id) });
}

export async function POST(req: NextRequest) {
  const sb = createSupabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { productId, action } = await req.json();
  if (!productId || !["add", "remove"].includes(action)) {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const admin = createSupabaseAdmin();
  if (action === "add") {
    await admin.from("Favorite").upsert({ user_id: user.id, product_id: productId });
    await admin.from("Interaction").insert({
      user_id: user.id,
      product_id: productId,
      type: "favorite",
    });
  } else {
    await admin.from("Favorite").delete().eq("user_id", user.id).eq("product_id", productId);
  }

  return NextResponse.json({ ok: true });
}
