import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase-server";
import { fashnRun } from "@/lib/fashn-client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const sb = createSupabaseServer();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const { productImageUrl, templateId } = await req.json();
    if (!productImageUrl || !templateId) {
      return NextResponse.json({ error: "Eksik parametre" }, { status: 400 });
    }

    const admin = createSupabaseAdmin();
    const { data: tmpl } = await admin
      .from("UserTemplate")
      .select("*")
      .eq("id", templateId)
      .eq("user_id", user.id)
      .single();
    if (!tmpl) return NextResponse.json({ error: "Şablon bulunamadı" }, { status: 404 });

    const run = await fashnRun({
      model_image: tmpl.image_url,
      garment_image: productImageUrl,
    });

    return NextResponse.json({ id: run.id }, { status: 202 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Deneme başlatılamadı" }, { status: 500 });
  }
}
