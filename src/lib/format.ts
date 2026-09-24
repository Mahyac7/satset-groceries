/** Format a number as Indonesian Rupiah, e.g. 15000 -> "Rp15.000". */
export function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Apply an optional discount percentage to a base price. */
export function discountedPrice(price: number, discountPercent?: number): number {
  if (!discountPercent) return price;
  return Math.round(price * (1 - discountPercent / 100));
}
