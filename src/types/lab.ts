export enum LabStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
}

export enum TimeSlot {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
}

export interface Lab {
  id: string | number;
  name: string;
  department: string;
  capacity: number;
  equipmentTypes: string[];
  status: LabStatus;
  description?: string;
  images?: string[];
  location?: string;
  rating?: number;
  viewCount?: number;
  favoriteCount?: number;
  isFavorite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LabFilter {
  department?: string;
  minCapacity?: number;
  maxCapacity?: number;
  equipmentType?: string;
  status?: LabStatus;
  keyword?: string;
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
