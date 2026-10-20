interface ICategory {
  _id: string;
  name: string;
  description: string;
  icon: string;
  iconUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface ICreateCategory {
  name: string;
  description: string;
  icon: string;
}

type IUpdateCategory = Partial<
  Pick<ICreateCategory, "name" | "description" | "icon">
>;

interface IPaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: IPaginationMeta;
}

export type {
  ICategory,
  ICreateCategory,
  IUpdateCategory,
  IPaginationMeta,
  IApiResponse,
};