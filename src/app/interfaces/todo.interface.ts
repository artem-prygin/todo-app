export interface TodoInterface {
  id: string;
  title: string;
  createdAt: number;
  expiredAt: number;
  isFavourite?: boolean;
}
