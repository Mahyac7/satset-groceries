"use client";

import { CartProvider } from "@/context/CartContext";
import { OrdersProvider } from "@/context/OrdersContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OrdersProvider>
      <CartProvider>{children}</CartProvider>
    </OrdersProvider>
  );
}
