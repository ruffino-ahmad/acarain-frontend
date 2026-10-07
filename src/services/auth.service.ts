import instance from "@/libs/axios/instance";
import endpoint from "./endpoint.constant";
import { IActivation, ILogin, IRegister } from "@/types/Auth";

const authServices = {
  register: (payload: IRegister) => {
    return instance.post(`${endpoint.AUTH}/register`, payload);
  },
  activation: (payload: IActivation) => {
    return instance.post(`${endpoint.AUTH}/activation`, payload);
  },
  login: (payload: ILogin) => {
    return instance.post(`${endpoint.AUTH}/login`, payload);
  },
  getProfileWithToken: (token: string) => {
    return instance.get(`${endpoint.AUTH}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default authServices;
