/** Flat delivery fee in IDR when the free-delivery threshold isn't met. */
export const DELIVERY_FEE = 10000;

/** Minimum subtotal (IDR) for free delivery. */
export const FREE_DELIVERY_MIN = 50000;

/** Simulated delivery ETA in minutes. */
export const DEFAULT_ETA_MINUTES = 15;

export const PAYMENT_METHODS = [
  { id: "cod", label: "Bayar di Tempat (COD)", icon: "💵" },
  { id: "ewallet", label: "E-Wallet (GoPay/OVO/Dana)", icon: "📱" },
  { id: "transfer", label: "Transfer Bank / VA", icon: "🏦" },
  { id: "card", label: "Kartu Kredit/Debit", icon: "💳" },
] as const;
