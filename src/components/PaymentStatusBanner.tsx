"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Order } from "@/lib/types";

interface Props {
  order: Order;
  /** Whether the user just returned from Xendit with ?payment=success */
  justReturnedSuccess: boolean;
  onPaid: (paidAt: string) => void;
  onFailed: () => void;
}

/**
 * Shows the payment state of an order and, for pending orders, verifies the
 * Xendit invoice status via /api/invoice-status (Option A: no webhook/DB).
 */
export function PaymentStatusBanner({
  order,
  justReturnedSuccess,
  onPaid,
  onFailed,
}: Props) {
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const verify = useCallback(async () => {
    if (!order.xenditInvoiceId) return;
    setChecking(true);
    setCheckError(null);
    try {
      const res = await fetch(
        `/api/invoice-status?id=${encodeURIComponent(order.xenditInvoiceId)}`
      );
      const data = await res.json();
      if (!res.ok) {
        setCheckError(data.error || "Gagal mengecek status pembayaran.");
        return;
      }
      if (data.paid) {
        onPaid(new Date().toISOString());
      } else if (data.status === "EXPIRED") {
        onFailed();
      }
      // PENDING: leave as-is; user can re-check or continue paying.
    } catch {
      setCheckError("Tidak dapat terhubung ke server. Coba lagi.");
    } finally {
      setChecking(false);
    }
  }, [order.xenditInvoiceId, onPaid, onFailed]);

  // Auto-verify when the user just came back from Xendit, then poll a few times.
  useEffect(() => {
    if (order.paymentStatus !== "pending") return;
    if (!justReturnedSuccess) return;

    verify();
    let count = 0;
    pollRef.current = setInterval(() => {
      count += 1;
      if (count > 5) {
        if (pollRef.current) clearInterval(pollRef.current);
        return;
      }
      verify();
    }, 3000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [justReturnedSuccess, order.paymentStatus]);

  // Stop polling once no longer pending.
  useEffect(() => {
    if (order.paymentStatus !== "pending" && pollRef.current) {
      clearInterval(pollRef.current);
    }
  }, [order.paymentStatus]);

  if (order.paymentStatus === "paid") {
    return (
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-green-800">
        <span className="text-2xl">✅</span>
        <div>
          <p className="font-bold">Pembayaran berhasil</p>
          <p className="text-sm">
            Pesananmu sudah dibayar dan sedang kami proses. Terima kasih!
          </p>
        </div>
      </div>
    );
  }

  if (order.paymentStatus === "failed") {
    return (
      <div className="mb-4 rounded-2xl bg-red-50 p-4 text-red-700">
        <div className="flex items-center gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-bold">Pembayaran gagal / kedaluwarsa</p>
            <p className="text-sm">
              Invoice pembayaran ini tidak berhasil. Silakan buat pesanan baru.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // pending
  return (
    <div className="mb-4 rounded-2xl bg-amber-50 p-4 text-amber-800">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⏳</span>
        <div className="flex-1">
          <p className="font-bold">Menunggu pembayaran</p>
          <p className="text-sm">
            Selesaikan pembayaranmu untuk memproses pesanan.
          </p>
        </div>
      </div>
      {checkError && (
        <p className="mt-2 text-xs text-red-600">⚠️ {checkError}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {order.xenditInvoiceUrl && (
          <a
            href={order.xenditInvoiceUrl}
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Bayar sekarang
          </a>
        )}
        <button
          onClick={verify}
          disabled={checking}
          className="rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-60"
        >
          {checking ? "Mengecek…" : "Cek status pembayaran"}
        </button>
      </div>
    </div>
  );
}
