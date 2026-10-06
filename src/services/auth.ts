import instance from "@/libs/axios/instance";
import endpoint from "./endpoint.constant";
import { IRegister } from "@/types/Auth";

const authServices = {
  register: (payload: IRegister) => {
    return instance.post(`${endpoint.AUTH}/register`, payload);
  },
};

export default authServices;
