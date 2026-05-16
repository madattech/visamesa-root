import apiClient from './api';
import {API_ENDPOINTS} from '../config/api';
import {
  Case,
  Appointment,
  CheckAvailabilityRequest,
  BookResultRequest,
} from '../types';

export const appointmentService = {
  async getPendingCases(userId: string): Promise<Case[]> {
    const response = await apiClient.get<Case[]>(
      API_ENDPOINTS.pendingAppointments(userId),
    );
    return response.data;
  },

  async getAllCases(userId: string): Promise<Case[]> {
    const response = await apiClient.get<Case[]>(
      API_ENDPOINTS.allCases(userId),
    );
    return response.data;
  },

  async getAppointmentStatus(caseId: string): Promise<Appointment> {
    const response = await apiClient.get<Appointment>(
      API_ENDPOINTS.appointmentStatus(caseId),
    );
    return response.data;
  },

  async checkAvailability(data: CheckAvailabilityRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.checkAvailability, data);
  },

  async recordBookingResult(data: BookResultRequest): Promise<void> {
    await apiClient.post(API_ENDPOINTS.bookResult, data);
  },
};
