import instance from "@/libs/axios/instance";
import endpoint from "./endpoint.constant";

import { IApiResponse } from "@/types/Pagination";
import { ICart } from "@/types/Ticket";

const orderServices = {
  createOrder: (payload: ICart) => {
    return instance.post(endpoint.ORDER, payload);
  },
};

export default orderServices;
