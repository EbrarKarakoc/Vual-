"use client";

import * as React from "react";
import type { StudioProduct } from "@/lib/studio-data";

export type StudioPhoto =
  | { kind: "sample"; seed: number }
  | { kind: "upload"; src: string; name: string };

export type StudioUser = { name: string; email: string } | null;

type Ctx = {
  user: StudioUser;
  setUser: (u: StudioUser) => void;
  signOut: () => void;
  photo: StudioPhoto | null;
  setPhoto: (p: StudioPhoto | null) => void;
  selected: StudioProduct[];
  toggleSelect: (p: StudioProduct) => void;
  favorites: number[];
  toggleFav: (id: number) => void;
};

const StudioCtx = React.createContext<Ctx | null>(null);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = React.useState<StudioUser>(null);
  const [photo, setPhotoState] = React.useState<StudioPhoto | null>(null);
  const [selected, setSelected] = React.useState<StudioProduct[]>([]);
  const [favorites, setFavorites] = React.useState<number[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  // Persist to localStorage
  React.useEffect(() => {
    try {
      const u = localStorage.getItem("bs-user");
      const p = localStorage.getItem("bs-photo");
      const s = localStorage.getItem("bs-selected");
      const f = localStorage.getItem("bs-favorites");
      if (u) setUserState(JSON.parse(u));
      if (p) setPhotoState(JSON.parse(p));
      if (s) setSelected(JSON.parse(s));
      if (f) setFavorites(JSON.parse(f));
    } catch {}
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    if (user) localStorage.setItem("bs-user", JSON.stringify(user));
    else localStorage.removeItem("bs-user");
  }, [user, hydrated]);

  React.useEffect(() => {
    if (!hydrated) return;
    if (photo) localStorage.setItem("bs-photo", JSON.stringify(photo));
    else localStorage.removeItem("bs-photo");
  }, [photo, hydrated]);

  React.useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("bs-selected", JSON.stringify(selected));
  }, [selected, hydrated]);

  React.useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("bs-favorites", JSON.stringify(favorites));
  }, [favorites, hydrated]);

  const value: Ctx = {
    user,
    setUser: setUserState,
    signOut: () => {
      setUserState(null);
      setPhotoState(null);
      setSelected([]);
    },
    photo,
    setPhoto: setPhotoState,
    selected,
    toggleSelect: (p) =>
      setSelected((prev) =>
        prev.some((s) => s.id === p.id) ? prev.filter((s) => s.id !== p.id) : [...prev, p]
      ),
    favorites,
    toggleFav: (id) =>
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      ),
  };

  return <StudioCtx.Provider value={value}>{children}</StudioCtx.Provider>;
}

export function useStudio() {
  const ctx = React.useContext(StudioCtx);
  if (!ctx) throw new Error("useStudio must be used inside <StudioProvider>");
  return ctx;
}
