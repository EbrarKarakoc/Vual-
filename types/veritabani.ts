export interface Favori {
  id: string;
  userId: string;
  productId: string;
  createdAt: string | Date;
}

export interface EtkilesimTipi {
  type: "view" | "try" | "favorite" | "click_buy";
}

export interface DenemeSonucu {
  id: string;
  userId: string;
  productId: string;
  templateId: string;
  resultUrl: string;
  createdAt: string | Date;
}
