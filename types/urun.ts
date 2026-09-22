export interface Urun {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  colorHex: string;
  colorName: string;
  fabricType: string;
  style: string;
  price: number | string;
  currency: string;
  imageUrls: string[];
  affiliateUrl: string;
  brand?: string | null;
  inStock: boolean;
  createdAt?: string | Date;
}

export interface UrunFiltre {
  renk?: string;
  kumas?: string;
  stil?: string;
  minFiyat?: number;
  maxFiyat?: number;
  arama?: string;
}
