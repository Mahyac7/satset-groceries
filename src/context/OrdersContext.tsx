"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Order, OrderStatus } from "@/lib/types";

const STORAGE_KEY = "satset-orders";

const STATUS_FLOW: OrderStatus[] = [
  "confirmed",
  "preparing",
  "on_the_way",
  "delivered",
];

interface OrdersContextValue {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, patch: Partial<Order>) => void;
  getOrder: (id: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

/**
 * Simulate delivery progress: as time passes since an order was created,
 * advance its status through the flow (one step every ~20s for demo).
 */
function computeStatus(order: Order): OrderStatus {
  // Delivery clock starts when payment is confirmed (paidAt), falling back to createdAt.
  const startTime = new Date(order.paidAt ?? order.createdAt).getTime();
  const elapsedSec = (Date.now() - startTime) / 1000;
  const stepSec = 20;
  const index = Math.min(
    Math.floor(elapsedSec / stepSec),
    STATUS_FLOW.length - 1
  );
  return STATUS_FLOW[index];
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setOrders(JSON.parse(raw) as Order[]);
    } catch {
      // ignore
    }
  }, []);

  // Recompute simulated delivery statuses periodically.
  // Delivery only progresses once the payment is completed (paid).
  useEffect(() => {
    const tick = () => {
      setOrders((prev) => {
        let changed = false;
        const next = prev.map((o) => {
          if (o.paymentStatus !== "paid") return o;
          const status = computeStatus(o);
          if (status !== o.status) {
            changed = true;
            return { ...o, status };
          }
          return o;
        });
        return changed ? next : prev;
      });
    };
    tick();
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const updateOrder = useCallback((id: string, patch: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...patch } : o))
    );
  }, []);

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders]
  );

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrder, getOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within an OrdersProvider");
  return ctx;
}
