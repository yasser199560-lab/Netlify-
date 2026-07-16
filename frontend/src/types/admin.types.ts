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

export interface AdminOrderItem {
  productId?: string;
  title: string;
  price: number;
  quantity: number;
}

export interface AdminOrder {
  _id: string | number;
  customerId: string | number;
  partnerId: string | number;
  customerEmail?: string;
  partnerName?: string;
  items: AdminOrderItem[];
  totalAmount: number;
  paymentMethod: string;
  orderStatus: string;
  deliveryAddress?: string;
  createdAt?: string;
}

// The five statuses the business actually tracks, plus "all" for no filter.
// Backend enum values on the left, shown to the person using the friendlier
// labels in ORDER_STATUS_LABELS (e.g. "accepted" reads as "Preparing").
export type OrderStatusFilter = 'all' | 'pending' | 'accepted' | 'out_for_delivery' | 'completed' | 'cancelled';

export const ORDER_STATUS_LABELS: Record<OrderStatusFilter, string> = {
  all: 'All',
  pending: 'Pending',
  accepted: 'Preparing',
  out_for_delivery: 'On Delivery',
  completed: 'Delivered',
  cancelled: 'Cancelled',
};

export type DateFilter = 'all' | 'today' | 'last7' | 'last30' | 'month' | 'custom';

export const DATE_FILTER_LABELS: Record<DateFilter, string> = {
  all: 'All time',
  today: 'Today',
  last7: 'Last 7 Days',
  last30: 'Last 30 Days',
  month: 'This Month',
  custom: 'Custom Range',
};

export interface OrderFilterState {
  status: OrderStatusFilter;
  dateFilter: DateFilter;
  startDate: string;
  endDate: string;
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

export interface AdminMe {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatarUrl?: string;
}

export type ActiveTab = 'dashboard' | 'customers' | 'partners' | 'orders' | 'profile';