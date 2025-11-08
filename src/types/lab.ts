// Re-export from API module for consistency
export type { LabApi } from "@/api/modules/lab";

// Legacy enums for backward compatibility
export enum LabStatus {
  AVAILABLE = 0,
  MAINTENANCE = 1,
  DISABLED = 2,
}

export enum TimeSlot {
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
  EVENING = "EVENING",
}

// Legacy Lab interface for backward compatibility
export interface Lab {
  id: string | number;
  name: string;
  department: string;
  capacity: number;
  equipmentTypes?: string[];
  equipmentList?: string[];
  status: LabStatus | number;
  description?: string;
  images?: string[];
  location?: string;
  rating?: number;
  tags?: string[];
  viewCount?: number;
  favoriteCount?: number;
  isFavorite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Legacy LabFilter interface for backward compatibility
export interface LabFilter {
  department?: string;
  minCapacity?: number;
  maxCapacity?: number;
  equipmentType?: string;
  status?: LabStatus | number;
  keyword?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
}

export interface LabReview {
  id: string | number;
  labId: string | number;
  userId: string | number;
  userName?: string;
  rating: number;
  equipmentRating: number;
  environmentRating: number;
  serviceRating: number;
  comment?: string;
  createdAt?: string;
}
