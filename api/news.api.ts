export namespace NewsApi {
  /** 查询新闻参数 */
  export interface GetNewsParams {
    /** 关键词搜索 */
    keyword?: string;
    /** 新闻标签 */
    tags?: string[];
    /** 新闻状态 */
    status?: NewsStatus;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    size?: number;
  }

  /** 新闻列表项 */
  export interface NewsListItem {
    /** 新闻ID */
    id: number;
    /** 新闻标题 */
    title: string;
    /** 封面图片 */
    coverImage: string;
    /** 新闻标签 */
    tags: string[];
    /** 新闻状态 */
    status: NewsStatus;
    /** 点赞数 */
    likes: number;
    /** 收藏数 */
    favorites: number;
    /** 作者ID */
    authorId: number;
    /** 作者姓名 */
    authorName: string;
    /** 创建时间 */
    createdAt: string;
  }

  /** 创建新闻参数 */
  export interface CreateNewsParams {
    /** 新闻标题 */
    title: string;
    /** 新闻内容 */
    content: string;
    /** 封面图片 */
    coverImage?: string;
    /** 新闻图片 */
    images?: string[];
    /** 新闻标签 */
    tags?: string[];
  }

  /** 审核新闻参数 */
  export interface ReviewNewsParams {
    /** 审核状态 */
    status: NewsStatus;
  }

  /** 新闻详情 */
  export interface NewsDetail extends Omit<NewsListItem, 'authorName'> {
    /** 新闻内容 */
    content: string;
    /** 新闻图片 */
    images: string[];
    /** 审核人ID */
    reviewerId: number;
    /** 审核时间 */
    reviewTime: string;
    /** 更新时间 */
    updatedAt: string;
  }
}

enum Api {
  /** 获取新闻列表 */
  GET_NEWS = '/news',
  /** 获取新闻详情 */
  GET_NEWS_DETAIL = '/news',
  /** 创建新闻 */
  CREATE_NEWS = '/news',
  /** 更新新闻 */
  UPDATE_NEWS = '/news',
  /** 删除新闻 */
  DELETE_NEWS = '/news',
  /** 审核新闻 */
  REVIEW_NEWS = '/news',
  /** 点赞新闻 */
  LIKE_NEWS = '/news',
}

/** 获取新闻列表 */
export async function getNewsApi(params: Partial<NewsApi.GetNewsParams>) {}

/** 获取新闻详情 */
export async function getNewsDetailApi(id: number) {}

/** 创建新闻 */
export async function createNewsApi(params: NewsApi.CreateNewsParams) {}

/** 更新新闻 */
export async function updateNewsApi(
  id: number,
  params: NewsApi.CreateNewsParams,
) {}

/** 删除新闻 */
export async function deleteNewsApi(id: number) {}

/** 审核新闻 */
export async function reviewNewsApi(
  id: number,
  params: NewsApi.ReviewNewsParams,
) {}

/** 点赞新闻 */
export async function likeNewsApi(id: number) {}
