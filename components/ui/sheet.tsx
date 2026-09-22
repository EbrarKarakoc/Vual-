"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onOpenChange,
  children,
  side = "right",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  children: React.ReactNode;
  side?: "right" | "left" | "bottom";
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "absolute bg-white shadow-xl p-6 overflow-auto",
          side === "right" && "right-0 top-0 h-full w-[85%] max-w-sm",
          side === "left" && "left-0 top-0 h-full w-[85%] max-w-sm",
          side === "bottom" && "bottom-0 left-0 w-full max-h-[85%] rounded-t-2xl"
        )}
      >
        <button
          onClick={() => onOpenChange(false)}
          aria-label="Kapat"
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-black/5"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
