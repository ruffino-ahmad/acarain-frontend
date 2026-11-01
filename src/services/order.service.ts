import instance from "@/libs/axios/instance";
import endpoint from "./endpoint.constant";

import { IApiResponse } from "@/types/Pagination";
import { ICart } from "@/types/Ticket";
import { IOrder } from "@/types/Order";

const orderServices = {
  createOrder: (payload: ICart) => {
    return instance.post(endpoint.ORDER, payload);
  },
  getOrderById: (id: string) => {
    return instance.get<IApiResponse<IOrder>>(`${endpoint.ORDER}/${id}`);
  },
  getMemberOrders: (params: string) => {
    return instance.get<IApiResponse<IOrder[]>>(
      `${endpoint.ORDER}/history?${params}`
    );
  },
  getAdminOrders: (params: string) => {
    return instance.get<IApiResponse<IOrder[]>>(
      `${endpoint.ORDER}?${params}`
    );
  },
  completeAdminOrder: (id: string) => {
    return instance.patch<IApiResponse<IOrder>>(
      `${endpoint.ORDER}/${id}/completed`
    );
  },
  pendingAdminOrder: (id: string) => {
    return instance.patch<IApiResponse<IOrder>>(
      `${endpoint.ORDER}/${id}/pending`
    );
  },
  cancelAdminOrder: (id: string) => {
    return instance.patch<IApiResponse<IOrder>>(
      `${endpoint.ORDER}/${id}/cancelled`
    );
  },
  deleteAdminOrder: (id: string) => {
    return instance.delete<IApiResponse<IOrder>>(`${endpoint.ORDER}/${id}`);
  },
};

export default orderServices;
