export enum EquipmentStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  UNDER_REPAIR = 'UNDER_REPAIR',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum RepairStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum FaultType {
  HARDWARE = 'HARDWARE',
  SOFTWARE = 'SOFTWARE',
  OPERATION = 'OPERATION',
  OTHER = 'OTHER',
}

export enum UrgencyLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface Equipment {
  id: string | number;
  name: string;
  type: string;
  labId: string | number;
  labName?: string;
  model?: string;
  status: EquipmentStatus;
  description?: string;
  image?: string;
  purchaseDate?: string;
  lastMaintenanceDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EquipmentApplication {
  id: string | number;
  equipmentId: string | number;
  equipmentName?: string;
  userId: string | number;
  userName?: string;
  purpose: string;
  description: string;
  timeSlot: string;
  status: ApplicationStatus;
  rejectReason?: string;
  reviewerId?: string | number;
  reviewerName?: string;
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateApplicationForm {
  equipmentId: string | number;
  purpose: string;
  description: string;
  timeSlot: string;
}

export interface RepairRequest {
  id: string | number;
  equipmentId: string | number;
  equipmentName?: string;
  userId: string | number;
  userName?: string;
  faultType: FaultType;
  description: string;
  images?: string[];
  urgencyLevel: UrgencyLevel;
  status: RepairStatus;
  repairNumber?: string;
  assignedTo?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRepairForm {
  equipmentId: string | number;
  faultType: FaultType;
  description: string;
  images?: string[];
  urgencyLevel: UrgencyLevel;
}

export interface EquipmentFilter {
  keyword?: string;
  type?: string;
  labId?: string | number;
  status?: EquipmentStatus;
}
