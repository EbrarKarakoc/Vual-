import { User } from "lucide-react";

export function ProfilKarti({
  name,
  email,
  avatarUrl,
}: {
  name?: string | null;
  email: string;
  avatarUrl?: string | null;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={name ?? email} className="w-full h-full object-cover" />
        ) : (
          <User className="w-7 h-7 text-emerald-700" />
        )}
      </div>
      <div>
        <p className="font-serif text-xl">{name ?? "Kullanıcı"}</p>
        <p className="text-sm text-black/60">{email}</p>
      </div>
    </div>
  );
}
