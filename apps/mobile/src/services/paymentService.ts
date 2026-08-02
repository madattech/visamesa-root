import { API_ENDPOINTS } from '@/config/api';
import apiClient from '@/services/api';
import { EntitlementsResponse } from '@/types/entitlements';

export const paymentService = {
  async getEntitlements(): Promise<EntitlementsResponse> {
    const response = await apiClient.get<EntitlementsResponse>(
      API_ENDPOINTS.paymentEntitlements,
    );
    return response.data;
  },

  async syncCheckoutSession(sessionId: string): Promise<EntitlementsResponse> {
    const response = await apiClient.post<EntitlementsResponse>(
      API_ENDPOINTS.paymentCheckoutSync,
      {sessionId},
    );
    return response.data;
  },
};
