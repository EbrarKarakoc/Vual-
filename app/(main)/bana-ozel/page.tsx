import { KisiselVitrin } from "@/components/profil/KisiselVitrin";

export default function BanaOzelPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-serif text-3xl">Bana Özel</h1>
        <p className="text-sm text-black/60">
          Zevkine göre seçilmiş öneriler.
        </p>
      </div>
      <KisiselVitrin />
    </div>
  );
}
