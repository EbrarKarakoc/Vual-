"use client";

import { useRef } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFotografYukle } from "@/hooks/useFotografYukle";

export function FotografYukle({ onYuklendi }: { onYuklendi: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { yukle, loading, progress } = useFotografYukle();

  async function secildi(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await yukle(file);
    if (url) onYuklendi(url);
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 sm:p-8 text-center">
      <UploadCloud className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
      <h3 className="font-medium mb-1">Fotoğrafını Yükle</h3>
      <p className="text-sm text-black/60 mb-5">JPG, PNG veya WEBP. En fazla 10MB.</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={secildi}
        className="hidden"
      />
      <Button onClick={() => inputRef.current?.click()} disabled={loading}>
        {loading ? `Yükleniyor %${progress}` : "Dosya Seç"}
      </Button>
      {loading && (
        <div className="mt-4 h-1.5 bg-black/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
