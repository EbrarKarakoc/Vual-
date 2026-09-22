export type TryOnDurum =
  | "idle"
  | "uploading"
  | "queued"
  | "processing"
  | "completed"
  | "error";

export interface TryOnSonuc {
  id: string;
  status: TryOnDurum;
  output?: string[];
  error?: string;
}
