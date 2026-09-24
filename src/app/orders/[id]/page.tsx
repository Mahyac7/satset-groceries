"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useOrders } from "@/context/OrdersContext";
import { formatIDR, discountedPrice } from "@/lib/format";
import { ORDER_STEPS, statusIndex } from "@/lib/orderStatus";

export default function OrderDetailPage() {
  const params = useParams();
  const search = useSearchParams();
  const isNew = search.get("new") === "1";
  const id = String(params.id);
  const { orders, getOrder } = useOrders();

  const order = getOrder(id);

  // Orders live in localStorage; on first client render `orders` may be empty.
  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-gray-400">
        Memuat pesanan…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <span className="text-6xl">🤔</span>
        <h1 className="mt-4 text-xl font-bold">Pesanan tidak ditemukan</h1>
        <Link
          href="/orders"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          Lihat semua pesanan
        </Link>
      </div>
    );
  }

  const currentStep = statusIndex(order.status);
  const delivered = order.status === "delivered";

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {isNew && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-green-800">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-bold">Pesanan berhasil dibuat!</p>
            <p className="text-sm">
              Terima kasih sudah belanja di Satset. Pantau pengiriman di
              bawah.
            </p>
          </div>
        </div>
      )}

      <Link href="/orders" className="text-sm text-gray-400 hover:text-gray-600">
        ← Semua pesanan
      </Link>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold">Pesanan #{order.id}</h1>
        <span className="text-sm text-gray-400">
          {new Date(order.createdAt).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      </div>

      {/* Tracking */}
      <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">Status Pengiriman</h2>
          {!delivered && (
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-dark">
              ⏱️ Estimasi ~{order.etaMinutes} menit
            </span>
          )}
        </div>

        <ol className="relative space-y-6">
          {ORDER_STEPS.map((step, idx) => {
            const done = idx <= currentStep;
            const active = idx === currentStep;
            return (
              <li key={step.status} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-base transition ${
                      done
                        ? "bg-brand text-white"
                        : "bg-gray-100 text-gray-400"
                    } ${active && !delivered ? "ring-4 ring-brand/20" : ""}`}
                  >
                    {step.icon}
                  </div>
                  {idx < ORDER_STEPS.length - 1 && (
                    <div
                      className={`mt-1 h-8 w-0.5 ${
                        idx < currentStep ? "bg-brand" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
                <div className="pb-1">
                  <p
                    className={`font-semibold ${
                      done ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                    {active && !delivered && (
                      <span className="ml-2 inline-block animate-pulse text-xs font-normal text-brand">
                        ● sedang berlangsung
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Delivery address */}
      <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-5">
        <h2 className="mb-2 font-bold">📍 Dikirim ke</h2>
        <p className="font-medium">{order.address.fullName}</p>
        <p className="text-sm text-gray-500">{order.address.phone}</p>
        <p className="mt-1 text-sm text-gray-500">{order.address.addressLine}</p>
        {order.address.note && (
          <p className="mt-1 text-sm text-gray-400">
            Catatan: {order.address.note}
          </p>
        )}
      </section>

      {/* Items */}
      <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-5">
        <h2 className="mb-3 font-bold">🧾 Rincian Pesanan</h2>
        <div className="space-y-3">
          {order.items.map(({ product, quantity }) => {
            const price = discountedPrice(product.price, product.discountPercent);
            return (
              <div key={product.id} className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50 text-2xl">
                  {product.image}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-gray-400">
                    {quantity} × {formatIDR(price)}
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  {formatIDR(price * quantity)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 space-y-2 border-t border-dashed border-gray-200 pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>{formatIDR(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Ongkir</span>
            <span>
              {order.deliveryFee === 0 ? (
                <span className="text-green-600">Gratis</span>
              ) : (
                formatIDR(order.deliveryFee)
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Pembayaran</span>
            <span>{order.paymentMethod}</span>
          </div>
          <div className="my-1 border-t border-dashed border-gray-200" />
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{formatIDR(order.total)}</span>
          </div>
        </div>
      </section>

      <Link
        href="/"
        className="mt-4 block rounded-full border border-brand py-3 text-center font-semibold text-brand transition hover:bg-brand hover:text-white"
      >
        Belanja lagi
      </Link>
    </div>
  );
}
