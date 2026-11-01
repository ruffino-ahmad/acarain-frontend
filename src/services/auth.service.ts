import instance from "@/libs/axios/instance";
import plainInstance from "@/libs/axios/plainInstance";
import endpoint from "./endpoint.constant";
import {
  IActivation,
  ILogin,
  IRefreshToken,
  IRegister,
  IUpdatePassword,
  IUpdateProfile,
} from "@/types/Auth";

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
  refresh: (payload: IRefreshToken) => {
    return plainInstance.post(`${endpoint.AUTH}/refresh`, payload);
  },
  logout: (payload: IRefreshToken) => {
    return plainInstance.post(`${endpoint.AUTH}/logout`, payload);
  },
  getProfileWithToken: (token: string) => {
    return instance.get(`${endpoint.AUTH}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getProfile: () => {
    return instance.get(`${endpoint.AUTH}/me`, {});
  },
  updateProfile: (payload: IUpdateProfile) => {
    return instance.patch(`${endpoint.AUTH}/update-profile`, payload);
  },
  updatePassword: (payload: IUpdatePassword) => {
    return instance.patch(`${endpoint.AUTH}/update-password`, payload);
  },
};

export default authServices;
