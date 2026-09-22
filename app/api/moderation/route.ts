import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import moderateImage from "@/lib/clarifai-client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const sb = createSupabaseServer();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const { imageUrl } = await req.json();
    if (!imageUrl) return NextResponse.json({ error: "imageUrl gerekli" }, { status: 400 });

    const result = await moderateImage(imageUrl);

    return NextResponse.json({ result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Sunucu hatası" }, { status: 500 });
  }
}
