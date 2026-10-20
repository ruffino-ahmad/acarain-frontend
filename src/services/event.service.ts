import instance from "@/libs/axios/instance";
import type { IApiResponse } from "@/types/Category";
import type { ICreateEvent, IEvent } from "@/types/Event";
import endpoint from "./endpoint.constant";

const eventServices = {
  getEvents: (params?: string) => {
    return instance.get<IApiResponse<IEvent[]>>(
      `${endpoint.EVENT}?${params}`,
    );
  },

  createEvent: (payload: ICreateEvent) => {
    return instance.post<IApiResponse<IEvent>>(endpoint.EVENT, payload);
  },

  deleteEvent: (id: string) => {
    return instance.delete<IApiResponse<IEvent>>(`${endpoint.EVENT}/${id}`);
  },
};

export default eventServices;