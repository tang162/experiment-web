export interface LabNews {
  id: string | number;
  title: string;
  content: string;
  type: string;
  tags?: string[];
  images?: string[];
  authorId?: string | number;
  authorName?: string;
  viewCount?: number;
  likeCount?: number;
  isLiked?: boolean;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface NewsFilter {
  type?: string;
  tags?: string[];
  keyword?: string;
}
