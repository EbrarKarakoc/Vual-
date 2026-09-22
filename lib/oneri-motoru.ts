import { createSupabaseAdmin } from "./supabase-server";

export async function oneriGetir(userId: string, limit = 20) {
  const supabase = createSupabaseAdmin();

  // 1. Kullanıcının favorileri
  const { data: favoriler } = await supabase
    .from("Favorite")
    .select("product_id")
    .eq("user_id", userId);

  const favoriIds = (favoriler ?? []).map((f: any) => f.product_id);

  if (favoriIds.length === 0) {
    // Favori yoksa popüler ürünler döndür
    const { data: populer } = await supabase
      .from("Product")
      .select("*")
      .eq("inStock", true)
      .limit(limit);
    return populer ?? [];
  }

  // 2. Favori ürünlerin renk/kumaşlarına benzer ürünleri al
  const { data: favProducts } = await supabase
    .from("Product")
    .select("*")
    .in("id", favoriIds);

  const renkler = [...new Set((favProducts ?? []).map((p: any) => p.color_hex))];
  const kumaslar = [...new Set((favProducts ?? []).map((p: any) => p.fabric_type))];

  const { data: oneriler } = await supabase
    .from("Product")
    .select("*")
    .eq("inStock", true)
    .not("id", "in", `(${favoriIds.join(",")})`)
    .or(
      [
        ...renkler.map((r) => `color_hex.eq.${r}`),
        ...kumaslar.map((k) => `fabric_type.eq.${k}`),
      ].join(",")
    )
    .limit(limit);

  return oneriler ?? [];
}
