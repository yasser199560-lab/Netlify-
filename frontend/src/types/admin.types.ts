export interface AdminUser {
  _id: string | number;
  name: string;
  email: string;
  role: 'admin' | 'partner' | 'customer';
  status: 'active' | 'pending' | 'frozen';
  createdAt?: string;
  updatedAt?: string;
}

export interface PartnerProfile {
  _id: string | number;
  // The backend populates this field with the full owning user record
  // (via Mongoose .populate('userId')), not a plain id — use `p._id`
  // (the PartnerProfile's own id) for admin actions, same convention
  // freeze/unfreeze already use.
  userId: { _id: string | number; name?: string; email?: string } | string | number;
  storeName: string;
  type?: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
  status?: 'active' | 'pending' | 'frozen' | 'unknown';
}

export interface AdminOrder {
  _id: string | number;
  customerId: string | number;
  partnerId: string | number;
  customerName?: string;
  partnerName?: string;
  totalAmount: number;
  paymentMethod: string;
  orderStatus: string;
  paymentStatus: string;
  createdAt?: string;
}

export interface DashboardStats {
  totalCustomers: number;
  activePartners: number;
  totalOrders: number;
  frozenAccounts: number;
}

export interface DashboardOverview {
  customers: AdminUser[];
  partners: PartnerProfile[];
}

export type ActiveTab = 'dashboard' | 'customers' | 'partners' | 'orders';