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

export type { IPaginationMeta, IApiResponse };
