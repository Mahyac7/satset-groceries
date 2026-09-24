import type { OrderStatus } from "./types";

export const ORDER_STEPS: {
  status: OrderStatus;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    status: "confirmed",
    label: "Pesanan Dikonfirmasi",
    icon: "✅",
    description: "Pesananmu diterima dan sedang diteruskan ke toko terdekat.",
  },
  {
    status: "preparing",
    label: "Sedang Disiapkan",
    icon: "📦",
    description: "Tim kami sedang mengemas belanjaanmu.",
  },
  {
    status: "on_the_way",
    label: "Dalam Perjalanan",
    icon: "🏍️",
    description: "Kurir sedang menuju alamatmu.",
  },
  {
    status: "delivered",
    label: "Tiba di Tujuan",
    icon: "🎉",
    description: "Pesanan telah sampai. Selamat menikmati!",
  },
];

export function statusIndex(status: OrderStatus): number {
  return ORDER_STEPS.findIndex((s) => s.status === status);
}

export function statusLabel(status: OrderStatus): string {
  return ORDER_STEPS.find((s) => s.status === status)?.label ?? status;
}
