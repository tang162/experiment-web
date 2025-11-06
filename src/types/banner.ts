export interface Banner {
  id: string | number;
  title: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
}
