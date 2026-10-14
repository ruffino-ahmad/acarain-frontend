import instance from "@/libs/axios/instance";
import endpoint from "./endpoint.constant";

const categoryServices = {
  getCategories: (params?: string) => {
    return instance.get(`${endpoint.CATEGORY}?${params}`);
  },
};

export default categoryServices;
