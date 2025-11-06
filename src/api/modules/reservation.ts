import { request } from '@/utils';
import type { Reservation, CreateReservationForm, ReservationFilter } from '@/types';

export interface ReservationListResponse {
  list: Reservation[];
  total: number;
}

export const reservationApi = {
  createReservation(data: CreateReservationForm) {
    return request.post<Reservation>('/api/reservations', data);
  },

  getMyReservations(params: ReservationFilter & { page?: number; pageSize?: number }) {
    return request.get<ReservationListResponse>('/api/reservations/my', params);
  },

  getPendingReviews(params: { page?: number; pageSize?: number }) {
    return request.get<ReservationListResponse>('/api/reservations/pending-reviews', params);
  },

  cancelReservation(id: string | number) {
    return request.post(`/api/reservations/${id}/cancel`);
  },

  approveReservation(id: string | number) {
    return request.post(`/api/reservations/${id}/approve`);
  },

  rejectReservation(id: string | number, reason: string) {
    return request.post(`/api/reservations/${id}/reject`, { reason });
  },

  checkTimeSlotAvailability(labId: string | number, date: string, timeSlot: string) {
    return request.get<{ available: boolean }>('/api/reservations/check-availability', {
      labId,
      date,
      timeSlot,
    });
  },
};
