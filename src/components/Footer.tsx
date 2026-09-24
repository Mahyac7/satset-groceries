export function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-extrabold">
              Astro<span className="text-brand">Mart</span>
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Belanja kebutuhan harian, diantar kilat. Demo MVP — pembayaran
            disimulasikan.
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} AstroMart. Dibuat sebagai contoh aplikasi
          quick-commerce.
        </p>
      </div>
    </footer>
  );
}
