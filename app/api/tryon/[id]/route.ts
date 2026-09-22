import { NextResponse } from "next/server";
import { fashnStatus } from "@/lib/fashn-client";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const status = await fashnStatus(params.id);
    return NextResponse.json(status, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Durum alınamadı" }, { status: 500 });
  }
}
