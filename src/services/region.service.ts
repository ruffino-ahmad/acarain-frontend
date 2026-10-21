import instance from "@/libs/axios/instance";
import type { IProvinceDetail, IRegion } from "@/types/Region";
import endpoint from "./endpoint.constant";
import { IApiResponse } from "@/types/Pagination";

const regionServices = {
  getProvinces: () => {
    return instance.get<IApiResponse<IRegion[]>>(endpoint.REGION);
  },

  getRegencies: (provinceId: number) => {
    return instance.get<IApiResponse<IProvinceDetail[]>>(
      `${endpoint.REGION}/${provinceId}/province`
    );
  },
};

export default regionServices;
