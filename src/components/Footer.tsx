export function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-extrabold">
              Sat<span className="text-brand">set</span>
            </span>
          </div>
          <div className="text-sm text-gray-500">
            <p>Belanja kebutuhan harian, diantar kilat.</p>
            <p className="mt-1 text-xs font-medium text-brand">
              📍 Khusus area BSD – Serpong
            </p>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Satset
        </p>
      </div>
    </footer>
  );
}
