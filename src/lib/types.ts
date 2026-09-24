export interface Category {
  id: string;
  name: string;
  icon: string; // emoji for lightweight, dependency-free icons
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number; // in IDR
  unit: string; // e.g. "500 g", "1 pcs", "1 L"
  image: string; // emoji used as a placeholder product image
  description: string;
  stock: number;
  discountPercent?: number; // optional promo
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  note?: string;
}

export type OrderStatus =
  | "confirmed"
  | "preparing"
  | "on_the_way"
  | "delivered";

export interface Order {
  id: string;
  items: CartItem[];
  address: DeliveryAddress;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  createdAt: string; // ISO string
  status: OrderStatus;
  etaMinutes: number;
}
