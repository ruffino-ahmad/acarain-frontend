import instance from "@/libs/axios/instance";
import endpoint from "./endpoint.constant";
import { IApiResponse } from "@/types/Pagination";
import type { IBanner, ICreateBanner, IUpdateBanner } from "@/types/Banner";

const bannerServices = {
  getBanners: (params?: string) => {
    return instance.get<IApiResponse<IBanner[]>>(
      `${endpoint.BANNER}?${params}`
    );
  },

  getBannerById: (id: string) => {
    return instance.get<IApiResponse<IBanner>>(`${endpoint.BANNER}/${id}`);
  },

  createBanner: (payload: ICreateBanner) => {
    return instance.post<IApiResponse<IBanner>>(endpoint.BANNER, payload);
  },

  deleteBanner: (id: string) => {
    return instance.delete<IApiResponse<IBanner>>(`${endpoint.BANNER}/${id}`);
  },

  updateBanner: (id: string, payload: IUpdateBanner) => {
    return instance.patch<IApiResponse<IBanner>>(
      `${endpoint.BANNER}/${id}`,
      payload
    );
  },
};

export default bannerServices;
