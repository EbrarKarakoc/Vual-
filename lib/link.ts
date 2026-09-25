/** Arama alanına yazılan metin bir ürün linki mi? (Tarayıcıda da kullanılır.) */
export function linkMi(metin: string): boolean {
  return /^https?:\/\/\S+\.\S+/i.test(metin.trim());
}
