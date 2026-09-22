import { NextResponse, type NextRequest } from "next/server";

// Not: Prototip entegrasyonu sırasında Supabase kontrolü devre dışı.
// Auth, şimdilik StudioProvider + localStorage üzerinden yürütülüyor.
// Gerçek Supabase auth'a dönmek için bu dosyayı eski haline getirmen yeterli.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
