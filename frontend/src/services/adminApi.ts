import api from '../api/axiosInstance';
import {
  AdminUser,
  PartnerProfile,
  AdminOrder,
  DashboardStats,
  DashboardOverview,
} from '../types/admin.types';

export const adminApi = {
  getStats: async (): Promise<DashboardStats> => (await api.get('/admin/stats')).data.data,
  getOverview: async (): Promise<DashboardOverview> => (await api.get('/admin/overview')).data.data,

  getCustomers: async (): Promise<AdminUser[]> => (await api.get('/admin/customers')).data.data,
  freezeCustomer: async (id: string | number) => (await api.patch(`/admin/customers/${id}/freeze`)).data.data,
  unfreezeCustomer: async (id: string | number) => (await api.patch(`/admin/customers/${id}/unfreeze`)).data.data,
  deleteCustomer: async (id: string | number) => (await api.delete(`/admin/customers/${id}`)).data,

  getPartners: async (): Promise<PartnerProfile[]> => (await api.get('/admin/partners')).data.data,
  freezePartner: async (id: string | number) => (await api.patch(`/admin/partners/${id}/freeze`)).data.data,
  unfreezePartner: async (id: string | number) => (await api.patch(`/admin/partners/${id}/unfreeze`)).data.data,
  deletePartner: async (id: string | number) => (await api.delete(`/admin/partners/${id}`)).data,
  approvePartner: async (userId: string | number) => (await api.patch(`/admin/partners/${userId}/approve`)).data,

  getOrders: async (): Promise<AdminOrder[]> => (await api.get('/admin/orders')).data.data,
};