export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-black/60">
        <p>&copy; {new Date().getFullYear()} Başörtü Dene. Tüm hakları saklıdır.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-emerald-700">Gizlilik</a>
          <a href="#" className="hover:text-emerald-700">KVKK</a>
          <a href="#" className="hover:text-emerald-700">İletişim</a>
        </div>
      </div>
    </footer>
  );
}
