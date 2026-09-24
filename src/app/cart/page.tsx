"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatIDR, discountedPrice } from "@/lib/format";
import { QuantityStepper } from "@/components/QuantityStepper";
import { DELIVERY_FEE, FREE_DELIVERY_MIN } from "@/lib/constants";

export default function CartPage() {
  const { items, subtotal, setQuantity, removeItem } = useCart();

  const deliveryFee = subtotal >= FREE_DELIVERY_MIN || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_MIN - subtotal);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <span className="text-6xl">🛒</span>
        <h1 className="mt-4 text-xl font-bold">Keranjangmu masih kosong</h1>
        <p className="mt-1 text-gray-500">
          Yuk isi dengan produk kebutuhan harianmu.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          Mulai belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-extrabold">Keranjang</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-3 lg:col-span-2">
          {items.map(({ product, quantity }) => {
            const price = discountedPrice(product.price, product.discountPercent);
            return (
              <div
                key={product.id}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-3xl">
                  {product.image}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">{product.name}</h3>
                  <p className="text-xs text-gray-400">{product.unit}</p>
                  <p className="mt-1 text-sm font-bold">{formatIDR(price)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <QuantityStepper
                    quantity={quantity}
                    max={product.stock}
                    size="sm"
                    onIncrement={() => setQuantity(product.id, quantity + 1)}
                    onDecrement={() => setQuantity(product.id, quantity - 1)}
                  />
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-xs text-gray-400 underline-offset-2 hover:text-red-500 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-3 font-bold">Ringkasan Belanja</h2>

            {amountToFreeDelivery > 0 && (
              <div className="mb-3 rounded-lg bg-brand/5 p-2.5 text-xs text-brand-dark">
                🚚 Belanja {formatIDR(amountToFreeDelivery)} lagi untuk{" "}
                <span className="font-semibold">gratis ongkir!</span>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ongkir</span>
                <span className="font-medium">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">Gratis</span>
                  ) : (
                    formatIDR(deliveryFee)
                  )}
                </span>
              </div>
              <div className="my-2 border-t border-dashed border-gray-200" />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatIDR(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-4 block rounded-full bg-brand py-3 text-center font-semibold text-white transition hover:bg-brand-dark"
            >
              Lanjut ke Checkout
            </Link>
            <Link
              href="/"
              className="mt-2 block text-center text-sm text-gray-400 hover:text-gray-600"
            >
              Tambah produk lain
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
