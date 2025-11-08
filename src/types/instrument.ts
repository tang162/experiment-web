// Re-export from API module for consistency
export type { InstrumentApi } from "@/api/modules/instrument.api";

// 仪器状态枚举
export enum InstrumentStatus {
  NORMAL = 0, // 正常
  DISABLED = 1, // 停用
  MAINTENANCE = 2, // 维护中
  FAULT = 3, // 故障
  BORROWED = 4, // 借出
}

// 故障类型枚举
export enum FaultType {
  HARDWARE = 0, // 硬件故障
  SOFTWARE = 1, // 软件故障
  OPERATION = 2, // 操作错误
  OTHER = 3, // 其他
}

// 紧急程度枚举
export enum UrgencyLevel {
  LOW = 0, // 低
  MEDIUM = 1, // 中
  HIGH = 2, // 高
  URGENT = 3, // 紧急
}

// 维修状态枚举
export enum RepairStatus {
  PENDING = 0, // 待处理
  IN_PROGRESS = 1, // 维修中
  COMPLETED = 3, // 已完成
}

// 仪器状态标签映射
export const INSTRUMENT_STATUS_MAP: Record<number, { label: string; color: string }> = {
  [InstrumentStatus.NORMAL]: { label: "正常", color: "success" },
  [InstrumentStatus.DISABLED]: { label: "停用", color: "info" },
  [InstrumentStatus.MAINTENANCE]: { label: "维护中", color: "warning" },
  [InstrumentStatus.FAULT]: { label: "故障", color: "danger" },
  [InstrumentStatus.BORROWED]: { label: "借出", color: "primary" },
};

// 故障类型标签映射
export const FAULT_TYPE_MAP: Record<number, { label: string; color: string }> = {
  [FaultType.HARDWARE]: { label: "硬件故障", color: "danger" },
  [FaultType.SOFTWARE]: { label: "软件故障", color: "warning" },
  [FaultType.OPERATION]: { label: "操作错误", color: "info" },
  [FaultType.OTHER]: { label: "其他", color: "default" },
};

// 紧急程度标签映射
export const URGENCY_LEVEL_MAP: Record<number, { label: string; color: string }> = {
  [UrgencyLevel.LOW]: { label: "低", color: "info" },
  [UrgencyLevel.MEDIUM]: { label: "中", color: "warning" },
  [UrgencyLevel.HIGH]: { label: "高", color: "danger" },
  [UrgencyLevel.URGENT]: { label: "紧急", color: "danger" },
};

// 维修状态标签映射
export const REPAIR_STATUS_MAP: Record<number, { label: string; color: string }> = {
  [RepairStatus.PENDING]: { label: "待处理", color: "warning" },
  [RepairStatus.IN_PROGRESS]: { label: "维修中", color: "primary" },
  [RepairStatus.COMPLETED]: { label: "已完成", color: "success" },
};
