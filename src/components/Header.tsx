"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useCart } from "@/context/CartContext";

function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/?q=${encodeURIComponent(query)}` : "/");
  };

  return (
    <form onSubmit={submit} className="flex-1 max-w-xl">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari produk, contoh: susu, apel, mie…"
          className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>
    </form>
  );
}

function CartButton() {
  const { itemCount } = useCart();
  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
    >
      <span>🛒</span>
      <span className="hidden sm:inline">Keranjang</span>
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-accent px-1 text-xs font-bold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="text-lg font-extrabold tracking-tight">
            Sat<span className="text-brand">set</span>
          </span>
        </Link>

        <Suspense fallback={<div className="flex-1" />}>
          <SearchBar />
        </Suspense>

        <div className="flex items-center gap-2">
          <Link
            href="/orders"
            className="hidden rounded-full px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 sm:block"
          >
            Pesanan
          </Link>
          <CartButton />
        </div>
      </div>

      <div className="border-t border-gray-50 bg-brand/5">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-1.5 text-xs text-brand-dark">
          <span>🏍️</span>
          <span className="font-medium">
            Diantar kilat ~15 menit ke lokasimu • Gratis ongkir min. Rp50.000
          </span>
        </div>
      </div>
    </header>
  );
}
