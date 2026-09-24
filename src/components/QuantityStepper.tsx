"use client";

interface Props {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  max?: number;
  size?: "sm" | "md";
}

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  max,
  size = "md",
}: Props) {
  const btn =
    size === "sm"
      ? "h-8 w-8 text-base"
      : "h-9 w-9 text-lg";
  return (
    <div className="flex items-center gap-1 rounded-full bg-brand/10 p-0.5">
      <button
        type="button"
        onClick={onDecrement}
        aria-label="Kurangi"
        className={`${btn} flex items-center justify-center rounded-full font-bold text-brand transition hover:bg-white`}
      >
        −
      </button>
      <span className="min-w-6 text-center text-sm font-bold text-brand">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label="Tambah"
        disabled={max !== undefined && quantity >= max}
        className={`${btn} flex items-center justify-center rounded-full font-bold text-brand transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40`}
      >
        +
      </button>
    </div>
  );
}
