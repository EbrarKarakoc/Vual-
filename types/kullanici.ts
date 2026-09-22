export interface Kullanici {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  photoUrl?: string | null;
  photoProcessed: boolean;
}

export interface Sablon {
  id: string;
  userId: string;
  templateType: string;
  imageUrl: string;
  isSelected: boolean;
}
