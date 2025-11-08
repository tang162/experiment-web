export interface PaginationParam {
  /** 关键词搜索 */
  keyword?: string;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}
export interface SearchFilter {
  /** 关键词搜索 */
  keyword?: string;
}

/**公共基础接口 */
export interface BaseEntity {
  /** id  */
  id: number;
  /** 创建时间 */
  createdAt?: string;
  /** 更新时间 */
  updatedAt?: string;
}

/** 分页数据 */
export interface PaginationData<T> {
  /** 数据列表 */
  list: T[];
  /** 总页数 */
  total: number;
}

export interface Options {
  /** 选项ID */
  id: string;
  /** 选项名称 */
  name: string;
}

export type OptionsRults = Partial<Options>;
