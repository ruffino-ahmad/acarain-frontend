import instance from "@/libs/axios/instance";
import endpoint from "./endpoint.constant";
import type {
  ICategory,
  ICreateCategory,
  IUpdateCategory,
} from "@/types/Category";
import { IApiResponse } from "@/types/Pagination";

const categoryServices = {
  getCategories: (params?: string) => {
    return instance.get<IApiResponse<ICategory[]>>(
      `${endpoint.CATEGORY}?${params}`
    );
  },

  getCategoryById: (id: string) => {
    return instance.get<IApiResponse<ICategory>>(`${endpoint.CATEGORY}/${id}`);
  },

  createCategory: (payload: ICreateCategory) => {
    return instance.post<IApiResponse<ICategory>>(endpoint.CATEGORY, payload);
  },

  deleteCategory: (id: string) => {
    return instance.delete<IApiResponse<ICategory>>(
      `${endpoint.CATEGORY}/${id}`
    );
  },

  updateCategory: (id: string, payload: IUpdateCategory) => {
    return instance.patch<IApiResponse<ICategory>>(
      `${endpoint.CATEGORY}/${id}`,
      payload
    );
  },
};

export default categoryServices;
