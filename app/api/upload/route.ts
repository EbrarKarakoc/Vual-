import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase-server";
import { resmIsle } from "@/lib/gorsel-isleme";
import { STORAGE_BUCKET, MAX_FOTO_MB } from "@/lib/sabitler";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const sb = createSupabaseServer();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Sadece resim kabul edilir" }, { status: 400 });
    }
    if (file.size > MAX_FOTO_MB * 1024 * 1024) {
      return NextResponse.json({ error: `En fazla ${MAX_FOTO_MB}MB` }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const processed = await resmIsle(buffer);

    const admin = createSupabaseAdmin();
    const path = `${user.id}/${Date.now()}.jpg`;
    const { error: upErr } = await admin.storage
      .from(STORAGE_BUCKET)
      .upload(path, processed, { contentType: "image/jpeg", upsert: true });
    if (upErr) throw upErr;

    const { data: pub } = admin.storage.from(STORAGE_BUCKET).getPublicUrl(path);

    return NextResponse.json({ url: pub.publicUrl, path });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Sunucu hatası" }, { status: 500 });
  }
}
