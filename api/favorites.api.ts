export namespace FavoritesApi {
  /** 查询收藏参数 */
  export interface GetFavoritesParams {
    /** 实验室ID */
    labId?: number;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    size?: number;
  }

  /** 收藏列表项 */
  export interface FavoritesListItem {
    /** 收藏ID */
    id: number;
    /** 实验室ID */
    labId: number;
    /** 实验室名称 */
    labName: string;
    /** 实验室位置 */
    location: string;
    /** 实验室容量 */
    capacity: number;
    /** 实验室状态 */
    status: number;
    /** 收藏时间 */
    createdAt: string;
  }

  /** 收藏详情 */
  export interface FavoritesDetail {
    /** 收藏ID */
    id: number;
    /** 实验室信息 */
    lab: {
      id: number;
      name: string;
      location: string;
      capacity: number;
      status: number;
      rating: number;
    };
    /** 收藏时间 */
    createdAt: string;
  }
}

enum Api {
  /** 获取收藏列表 */
  GET_FAVORITES = '/favorites',
  /** 添加收藏 */
  ADD_FAVORITE = '/favorites',
  /** 取消收藏 */
  REMOVE_FAVORITE = '/favorites',
  /** 检查是否收藏 */
  CHECK_FAVORITE = '/favorites/check',
}

/** 获取收藏列表 */
export async function getFavoritesApi(
  params: Partial<FavoritesApi.GetFavoritesParams>,
) {}

/** 添加收藏 */
export async function addFavoriteApi(labId: number) {}

/** 取消收藏 */
export async function removeFavoriteApi(labId: number) {}

/** 检查是否收藏 */
export async function checkFavoriteApi(labId: number) {}
