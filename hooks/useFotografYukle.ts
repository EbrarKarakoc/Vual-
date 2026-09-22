"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MAX_FOTO_MB, MIN_FOTO_PIXEL } from "@/lib/sabitler";

const GECERLI_TIPLER = ["image/jpeg", "image/png", "image/webp"];

export function useFotografYukle() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  async function yukle(file: File): Promise<string | null> {
    if (!GECERLI_TIPLER.includes(file.type)) {
      toast.error("Sadece JPG, PNG veya WEBP kabul edilir.");
      return null;
    }
    if (file.size > MAX_FOTO_MB * 1024 * 1024) {
      toast.error(`Fotoğraf en fazla ${MAX_FOTO_MB}MB olabilir.`);
      return null;
    }

    // Min boyut kontrolü
    const dim = await new Promise<{ w: number; h: number }>((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => resolve({ w: 0, h: 0 });
      img.src = URL.createObjectURL(file);
    });
    if (dim.w < MIN_FOTO_PIXEL || dim.h < MIN_FOTO_PIXEL) {
      toast.error(`Fotoğraf en az ${MIN_FOTO_PIXEL}x${MIN_FOTO_PIXEL} olmalı.`);
      return null;
    }

    setLoading(true);
    setProgress(10);
    try {
      const fd = new FormData();
      fd.append("file", file);
      setProgress(40);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      setProgress(90);
      if (!res.ok) throw new Error("Yükleme başarısız");
      const data = await res.json();
      setUrl(data.url);
      setProgress(100);
      toast.success("Fotoğraf yüklendi");
      return data.url as string;
    } catch (e) {
      toast.error("Yükleme sırasında bir hata oluştu.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { yukle, loading, progress, url };
}
