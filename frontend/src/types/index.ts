export type Role = "customer" | "partner" | "admin";
export type AccountStatus = "pending" | "active" | "frozen";
export type StoreCategory = "Restaurant" | "Supermarket" | "Pharmacy" | "Fashion" | "Bakery";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: AccountStatus;
  token: string;
}

export interface Product {
  _id: string;
  partnerId: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  isActive: boolean;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  _id: string;
  // Populated with { _id, name } on the partner order list (getPartnerOrders);
  // still a plain id string anywhere else the Order type is used.
  customerId: string | { _id: string; name: string };
  partnerId: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: "COD" | "Whish Money";
  orderStatus: "pending" | "accepted" | "out_for_delivery" | "completed" | "cancelled";
  deliveryAddress?: string;
  createdAt: string;
}

export interface Address {
  _id: string;
  customerId: string;
  label: string;
  fullAddress: string;
  town?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface PaymentMethod {
  _id: string;
  customerId: string;
  type: "Cash" | "Whish";
  label: string;
  phoneNumber?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface PartnerProfile {
  _id: string;
  userId: string;
  storeName: string;
  description?: string;
  address: string;
  phoneNumber: string;
  category?: StoreCategory;
  rating?: number;
  deliveryTime?: string;
  coverImageUrl?: string;
}

export interface CartItem {
  productId: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  customerId: string;
  items: CartItem[];
}
