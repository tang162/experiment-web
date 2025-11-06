import type { TimeSlot } from './lab';

export enum ReservationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Reservation {
  id: string | number;
  labId: string | number;
  labName?: string;
  userId: string | number;
  userName?: string;
  date: string;
  timeSlot: TimeSlot;
  purpose: string;
  description: string;
  participantCount: number;
  status: ReservationStatus;
  rejectReason?: string;
  reviewerId?: string | number;
  reviewerName?: string;
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReservationForm {
  labId: string | number;
  date: string;
  timeSlot: TimeSlot;
  purpose: string;
  description: string;
  participantCount: number;
}

export interface ReservationFilter {
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
}
