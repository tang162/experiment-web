import { request } from '@/utils';
import type {
  Equipment,
  EquipmentFilter,
  EquipmentApplication,
  CreateApplicationForm,
  RepairRequest,
  CreateRepairForm,
} from '@/types';

export interface EquipmentListResponse {
  list: Equipment[];
  total: number;
}

export interface ApplicationListResponse {
  list: EquipmentApplication[];
  total: number;
}

export interface RepairListResponse {
  list: RepairRequest[];
  total: number;
}

export const equipmentApi = {
  getEquipmentList(params: EquipmentFilter & { page?: number; pageSize?: number }) {
    return request.get<EquipmentListResponse>('/api/equipment', params);
  },

  getEquipmentDetail(id: string | number) {
    return request.get<Equipment>(`/api/equipment/${id}`);
  },

  createApplication(data: CreateApplicationForm) {
    return request.post<EquipmentApplication>('/api/equipment/applications', data);
  },

  getMyApplications(params: { status?: string; page?: number; pageSize?: number }) {
    return request.get<ApplicationListResponse>('/api/equipment/applications/my', params);
  },

  getPendingApplications(params: { page?: number; pageSize?: number }) {
    return request.get<ApplicationListResponse>('/api/equipment/applications/pending', params);
  },

  approveApplication(id: string | number) {
    return request.post(`/api/equipment/applications/${id}/approve`);
  },

  rejectApplication(id: string | number, reason: string) {
    return request.post(`/api/equipment/applications/${id}/reject`, { reason });
  },

  createRepairRequest(data: CreateRepairForm) {
    return request.post<RepairRequest>('/api/equipment/repairs', data);
  },

  getMyRepairRequests(params: { page?: number; pageSize?: number }) {
    return request.get<RepairListResponse>('/api/equipment/repairs/my', params);
  },

  uploadRepairImage(file: File) {
    return request.upload<{ url: string }>('/api/equipment/repairs/upload', { file });
  },
};
