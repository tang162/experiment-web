export namespace EvaluationApi {
  /** 查询评价参数 */
  export interface GetEvaluationsParams {
    /** 实验室ID */
    labId?: number;
    /** 用户ID */
    userId?: number;
    /** 评分范围 */
    ratingRange?: [number, number];
    /** 页码 */
    page?: number;
    /** 每页数量 */
    size?: number;
  }

  /** 评价列表项 */
  export interface EvaluationListItem {
    /** 评价ID */
    id: number;
    /** 实验室ID */
    labId: number;
    /** 实验室名称 */
    labName: string;
    /** 用户ID */
    userId: number;
    /** 用户姓名 */
    username: string;
    /** 总体评分 */
    overallRating: number;
    /** 设备评分 */
    equipmentRating: number;
    /** 环境评分 */
    environmentRating: number;
    /** 服务评分 */
    serviceRating: number;
    /** 评价内容 */
    comment: string;
    /** 创建时间 */
    createdAt: string;
  }

  /** 创建评价参数 */
  export interface CreateEvaluationParams {
    /** 实验室ID */
    labId: number;
    /** 总体评分 */
    overallRating: number;
    /** 设备评分 */
    equipmentRating: number;
    /** 环境评分 */
    environmentRating: number;
    /** 服务评分 */
    serviceRating: number;
    /** 评价内容 */
    comment?: string;
  }

  /** 评价统计 */
  export interface EvaluationStats {
    /** 评价总数 */
    total: number;
    /** 平均总体评分 */
    averageOverallRating: number;
    /** 平均设备评分 */
    averageEquipmentRating: number;
    /** 平均环境评分 */
    averageEnvironmentRating: number;
    /** 平均服务评分 */
    averageServiceRating: number;
    /** 评分分布 */
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  }

  /** 评价详情 */
  export interface EvaluationDetail
    extends Omit<EvaluationListItem, 'labName' | 'username'> {
    /** 更新时间 */
    updatedAt: string;
  }
}

enum Api {
  /** 获取评价列表 */
  GET_EVALUATIONS = '/evaluations',
  /** 获取评价详情 */
  GET_EVALUATION_DETAIL = '/evaluations',
  /** 创建评价 */
  CREATE_EVALUATION = '/evaluations',
  /** 更新评价 */
  UPDATE_EVALUATION = '/evaluations',
  /** 删除评价 */
  DELETE_EVALUATION = '/evaluations',
  /** 获取评价统计 */
  GET_EVALUATION_STATS = '/evaluations/stats',
}

/** 获取评价列表 */
export async function getEvaluationsApi(
  params: Partial<EvaluationApi.GetEvaluationsParams>,
) {}

/** 获取评价详情 */
export async function getEvaluationDetailApi(id: number) {}

/** 创建评价 */
export async function createEvaluationApi(
  params: EvaluationApi.CreateEvaluationParams,
) {}

/** 更新评价 */
export async function updateEvaluationApi(
  id: number,
  params: EvaluationApi.CreateEvaluationParams,
) {}

/** 删除评价 */
export async function deleteEvaluationApi(id: number) {}

/** 获取评价统计 */
export async function getEvaluationStatsApi(labId: number) {}
