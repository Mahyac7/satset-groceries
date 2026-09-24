"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { formatIDR, discountedPrice } from "@/lib/format";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_MIN,
  DEFAULT_ETA_MINUTES,
} from "@/lib/constants";
import type { DeliveryAddress, Order } from "@/lib/types";

function makeOrderId(): string {
  return "SATSET-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { addOrder } = useOrders();

  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: "",
    phone: "",
    addressLine: "",
    note: "",
  });
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const deliveryFee =
    subtotal >= FREE_DELIVERY_MIN || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  // If cart empties (e.g. after order), bounce home — unless we're mid-redirect.
  useEffect(() => {
    if (items.length === 0 && !processing) {
      router.replace("/");
    }
  }, [items.length, processing, router]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!address.fullName.trim()) e.fullName = "Nama wajib diisi";
    if (!/^[0-9+\-\s]{8,}$/.test(address.phone.trim()))
      e.phone = "Nomor telepon tidak valid";
    if (address.addressLine.trim().length < 10)
      e.addressLine = "Alamat terlalu singkat";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "Format email tidak valid";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setApiError(null);
    if (!validate()) return;
    setProcessing(true);

    const orderId = makeOrderId();

    // Build the payment order once, so we can persist it before redirecting.
    const order: Order = {
      id: orderId,
      items,
      address,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: "Xendit",
      createdAt: new Date().toISOString(),
      status: "confirmed",
      etaMinutes: DEFAULT_ETA_MINUTES,
      paymentStatus: "pending",
    };

    // Line items for the Xendit invoice. Add delivery fee as its own line.
    const invoiceItems = items.map(({ product, quantity }) => ({
      name: product.name,
      quantity,
      price: discountedPrice(product.price, product.discountPercent),
    }));
    if (deliveryFee > 0) {
      invoiceItems.push({ name: "Ongkos kirim", quantity: 1, price: deliveryFee });
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount: total,
          items: invoiceItems,
          customerName: address.fullName,
          payerEmail: email || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.invoiceUrl) {
        setApiError(
          data.detail || data.error || "Gagal membuat pembayaran. Coba lagi."
        );
        setProcessing(false);
        return;
      }

      // Persist the order (with invoice info) so it appears in history and
      // can be verified when the user returns from Xendit.
      addOrder({
        ...order,
        xenditInvoiceId: data.invoiceId,
        xenditInvoiceUrl: data.invoiceUrl,
      });
      clearCart();

      // Redirect the user to the Xendit hosted payment page.
      window.location.href = data.invoiceUrl;
    } catch {
      setApiError("Tidak dapat terhubung ke server pembayaran. Coba lagi.");
      setProcessing(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/20 ${
      errors[field] ? "border-red-400" : "border-gray-200 focus:border-brand"
    }`;

  if (items.length === 0 && !processing) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <Link href="/cart" className="text-sm text-gray-400 hover:text-gray-600">
        ← Kembali ke keranjang
      </Link>
      <h1 className="mb-4 mt-2 text-2xl font-extrabold">Checkout</h1>

      <form onSubmit={placeOrder} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Address */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-3 flex items-center gap-2 font-bold">
              📍 Alamat Pengiriman
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Nama Penerima
                </label>
                <input
                  value={address.fullName}
                  onChange={(e) =>
                    setAddress({ ...address, fullName: e.target.value })
                  }
                  className={inputClass("fullName")}
                  placeholder="Nama lengkap"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Nomor Telepon
                </label>
                <input
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                  className={inputClass("phone")}
                  placeholder="08xxxxxxxxxx"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>
            <div className="mt-3">
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Email (untuk bukti pembayaran, opsional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass("email")}
                placeholder="nama@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="mt-3">
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Alamat Lengkap
              </label>
              <textarea
                value={address.addressLine}
                onChange={(e) =>
                  setAddress({ ...address, addressLine: e.target.value })
                }
                rows={3}
                className={inputClass("addressLine")}
                placeholder="Jalan, nomor rumah, RT/RW, kelurahan, patokan…"
              />
              {errors.addressLine && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.addressLine}
                </p>
              )}
            </div>
            <div className="mt-3">
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Catatan untuk kurir (opsional)
              </label>
              <input
                value={address.note}
                onChange={(e) =>
                  setAddress({ ...address, note: e.target.value })
                }
                className={inputClass("note")}
                placeholder="Contoh: titip ke satpam, rumah pagar hijau"
              />
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-3 flex items-center gap-2 font-bold">
              💳 Pembayaran
            </h2>
            <div className="flex items-start gap-3 rounded-xl border border-brand/20 bg-brand/5 p-4">
              <span className="text-2xl">🔒</span>
              <div className="text-sm">
                <p className="font-semibold text-brand-dark">
                  Pembayaran aman via Xendit
                </p>
                <p className="mt-1 text-gray-600">
                  Setelah menekan tombol bayar, kamu akan diarahkan ke halaman
                  pembayaran Xendit. Pilih metode favoritmu di sana:
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  {[
                    "🏦 Virtual Account",
                    "📱 E-Wallet",
                    "🔳 QRIS",
                    "💳 Kartu",
                    "🏪 Retail",
                  ].map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-white px-2.5 py-1 text-gray-600 ring-1 ring-gray-200"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-3 font-bold">Ringkasan Pesanan</h2>
            <div className="mb-3 max-h-48 space-y-2 overflow-y-auto text-sm">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between gap-2">
                  <span className="truncate text-gray-600">
                    {product.name}{" "}
                    <span className="text-gray-400">×{quantity}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-dashed border-gray-200 pt-3 text-sm">
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

            {apiError && (
              <p className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs text-red-600">
                ⚠️ {apiError}
              </p>
            )}

            <button
              type="submit"
              disabled={processing}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
            >
              {processing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Mengarahkan ke pembayaran…
                </>
              ) : (
                `Bayar ${formatIDR(total)}`
              )}
            </button>
            <p className="mt-2 text-center text-[11px] text-gray-400">
              Kamu akan diarahkan ke halaman pembayaran Xendit yang aman.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
