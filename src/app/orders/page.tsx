"use client";

import Link from "next/link";
import { useOrders } from "@/context/OrdersContext";
import { formatIDR } from "@/lib/format";
import { statusLabel } from "@/lib/orderStatus";

export default function OrdersPage() {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <span className="text-6xl">🧾</span>
        <h1 className="mt-4 text-xl font-bold">Belum ada pesanan</h1>
        <p className="mt-1 text-gray-500">
          Pesanan yang kamu buat akan muncul di sini.
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
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-extrabold">Pesanan Saya</h1>
      <div className="space-y-3">
        {orders.map((order) => {
          const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
          const delivered = order.status === "delivered";
          const paid = order.paymentStatus === "paid";
          const pending = order.paymentStatus === "pending";
          const failed = order.paymentStatus === "failed";
          const badgeText = !paid
            ? pending
              ? "Menunggu bayar"
              : "Bayar gagal"
            : statusLabel(order.status);
          const badgeClass = failed
            ? "bg-red-100 text-red-700"
            : pending
            ? "bg-amber-100 text-amber-700"
            : delivered
            ? "bg-green-100 text-green-700"
            : "bg-brand/10 text-brand-dark";
          return (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-2xl border border-gray-100 bg-white p-4 transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">#{order.id}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                >
                  {badgeText}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {itemCount} item •{" "}
                  <span className="inline-flex gap-0.5">
                    {order.items.slice(0, 4).map((i) => (
                      <span key={i.product.id}>{i.product.image}</span>
                    ))}
                    {order.items.length > 4 && "…"}
                  </span>
                </span>
                <span className="font-bold">{formatIDR(order.total)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
