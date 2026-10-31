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
  getMemberOrder: (params: string) => {
    return instance.get<IApiResponse<IOrder[]>>(
      `${endpoint.ORDER}/history?${params}`
    );
  },
};

export default orderServices;
