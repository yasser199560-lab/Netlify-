import apiClient from "./Ordersapi";

export interface PartnerProfile {
  _id: string;
  userId: string;
  storeName: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
}

/**
 * Resolves the logged-in user's account to their store's partner profile.
 * Must be called after login — relies on the httpOnly auth cookie, which
 * the browser attaches automatically since ordersApi's client has
 * withCredentials: true.
 */
export async function getMyPartnerProfile(): Promise<PartnerProfile> {
  const { data } = await apiClient.get<{ data: PartnerProfile }>(
    "/partners/me"
  );
  return data.data;
}