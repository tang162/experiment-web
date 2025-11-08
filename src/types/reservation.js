import type { TimeSlot } from "./lab";

export enum ReservationStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
  COMPLETED = 3,
  CANCELLED = 4,
}

export interface Reservation {
  id: string | number;
  labId: string | number;
  labName?: string;
  userId: string | number;
  userName?: string;
  date: string;
  timeSlot: number;
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
