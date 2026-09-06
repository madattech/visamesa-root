import apiClient from '@/services/api';
import {API_ENDPOINTS} from '@/config/api';
import type {
  PublicSupportTicketInput,
  SupportTicketInput,
  SupportTicketResponse,
} from '@/features/support/types/SupportContext';

export async function submitSupportTicket(
  input: SupportTicketInput,
): Promise<SupportTicketResponse> {
  const response = await apiClient.post<SupportTicketResponse>(
    API_ENDPOINTS.supportTickets,
    input,
  );

  return response.data;
}

export async function submitPublicSupportTicket(
  input: PublicSupportTicketInput,
): Promise<SupportTicketResponse> {
  const response = await apiClient.post<SupportTicketResponse>(
    API_ENDPOINTS.publicSupportTickets,
    input,
  );

  return response.data;
}
