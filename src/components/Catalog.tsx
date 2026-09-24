"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products, categories } from "@/lib/data";
import { CategoryNav } from "./CategoryNav";
import { ProductCard } from "./ProductCard";

export function Catalog() {
  const params = useSearchParams();
  const query = (params.get("q") ?? "").trim().toLowerCase();
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === "all" || p.categoryId === activeCategory;
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const activeCatName =
    categories.find((c) => c.id === activeCategory)?.name ?? "Semua";

  return (
    <div className="mx-auto max-w-6xl px-4 py-5">
      {!query && (
        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-light p-6 text-white sm:p-8">
          <div className="max-w-lg">
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              ⚡ Quick Commerce
            </span>
            <h1 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
              Belanja kebutuhan harian, diantar dalam hitungan menit.
            </h1>
            <p className="mt-2 text-sm text-white/80">
              Ribuan produk segar & sembako, harga bersahabat, langsung ke
              depan pintumu.
            </p>
          </div>
        </div>
      )}

      <div className="mb-4">
        <CategoryNav active={activeCategory} onSelect={setActiveCategory} />
      </div>

      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-lg font-bold">
          {query ? `Hasil pencarian "${query}"` : activeCatName}
        </h2>
        <span className="text-sm text-gray-400">{filtered.length} produk</span>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
          <span className="text-4xl">🔍</span>
          <p className="mt-3 font-semibold">Produk tidak ditemukan</p>
          <p className="mt-1 text-sm text-gray-400">
            Coba kata kunci lain atau pilih kategori berbeda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
