"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Order, OrderStatus } from "@/lib/types";

const STORAGE_KEY = "astro-mart-orders";

const STATUS_FLOW: OrderStatus[] = [
  "confirmed",
  "preparing",
  "on_the_way",
  "delivered",
];

interface OrdersContextValue {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrder: (id: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

/**
 * Simulate delivery progress: as time passes since an order was created,
 * advance its status through the flow (one step every ~20s for demo).
 */
function computeStatus(order: Order): OrderStatus {
  const elapsedSec = (Date.now() - new Date(order.createdAt).getTime()) / 1000;
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

  // Recompute simulated statuses periodically.
  useEffect(() => {
    const tick = () => {
      setOrders((prev) => {
        let changed = false;
        const next = prev.map((o) => {
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

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders]
  );

  return (
    <OrdersContext.Provider value={{ orders, addOrder, getOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within an OrdersProvider");
  return ctx;
}
