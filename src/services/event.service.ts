import instance from "@/libs/axios/instance";
import type { IApiResponse } from "@/types/Category";
import type { ICreateEvent, IEvent, IUpdateEvent } from "@/types/Event";
import endpoint from "./endpoint.constant";

const eventServices = {
  getEvents: (params?: string) => {
    return instance.get<IApiResponse<IEvent[]>>(
      `${endpoint.EVENT}?${params}`,
    );
  },

  getEventById: (id: string) => {
    return instance.get<IApiResponse<IEvent>>(`${endpoint.EVENT}/${id}`);
  },

  createEvent: (payload: ICreateEvent) => {
    return instance.post<IApiResponse<IEvent>>(endpoint.EVENT, payload);
  },

  updateEvent: (id: string, payload: IUpdateEvent) => {
    return instance.patch<IApiResponse<IEvent>>(
      `${endpoint.EVENT}/${id}`,
      payload,
    );
  },

  deleteEvent: (id: string) => {
    return instance.delete<IApiResponse<IEvent>>(`${endpoint.EVENT}/${id}`);
  },
};

export default eventServices;