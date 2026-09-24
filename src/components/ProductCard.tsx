"use client";

import type { Product } from "@/lib/types";
import { formatIDR, discountedPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { QuantityStepper } from "./QuantityStepper";

export function ProductCard({ product }: { product: Product }) {
  const { getQuantity, addItem, setQuantity } = useCart();
  const qty = getQuantity(product.id);
  const finalPrice = discountedPrice(product.price, product.discountPercent);
  const hasDiscount = !!product.discountPercent;
  const outOfStock = product.stock <= 0;

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-3 transition hover:shadow-md">
      <div className="relative mb-2 flex aspect-square items-center justify-center rounded-xl bg-gray-50 text-5xl">
        <span aria-hidden>{product.image}</span>
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-accent px-2 py-0.5 text-xs font-bold text-white">
            -{product.discountPercent}%
          </span>
        )}
      </div>

      <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
        {product.name}
      </h3>
      <p className="mt-0.5 text-xs text-gray-400">{product.unit}</p>

      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className="text-sm font-bold text-gray-900">
          {formatIDR(finalPrice)}
        </span>
        {hasDiscount && (
          <span className="text-xs text-gray-400 line-through">
            {formatIDR(product.price)}
          </span>
        )}
      </div>

      <div className="mt-3">
        {outOfStock ? (
          <button
            disabled
            className="w-full cursor-not-allowed rounded-full bg-gray-100 py-2 text-sm font-semibold text-gray-400"
          >
            Stok habis
          </button>
        ) : qty === 0 ? (
          <button
            onClick={() => addItem(product)}
            className="w-full rounded-full border border-brand bg-white py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
          >
            + Tambah
          </button>
        ) : (
          <div className="flex justify-center">
            <QuantityStepper
              quantity={qty}
              max={product.stock}
              onIncrement={() => setQuantity(product.id, qty + 1)}
              onDecrement={() => setQuantity(product.id, qty - 1)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
