"use client";

import { useEffect, useRef } from "react";

export function HizliOnizleme({
  sablonUrl,
  colorHex,
  size = 320,
}: {
  sablonUrl: string;
  colorHex: string;
  size?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = colorHex;
      ctx.fillRect(0, 0, size, size);
      ctx.globalCompositeOperation = "source-over";
    };
    img.src = sablonUrl;
  }, [sablonUrl, colorHex, size]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-xl bg-cream"
      aria-label="Hızlı önizleme"
    />
  );
}
