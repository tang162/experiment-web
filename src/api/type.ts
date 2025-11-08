export interface PaginationParam {
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
