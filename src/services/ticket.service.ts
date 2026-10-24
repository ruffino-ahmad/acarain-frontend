import instance from "@/libs/axios/instance";
import endpoint from "./endpoint.constant";
import { IApiResponse } from "@/types/Pagination";
import { ICreateTicket, ITicket, IUpdateTicket } from "@/types/Ticket";

const ticketServices = {
  getTicketByEventId: (id: string) => {
    return instance.get<IApiResponse<ITicket[]>>(
      `${endpoint.TICKET}/${id}/events`
    );
  },
  createTicket: (payload: ICreateTicket) => {
    return instance.post<IApiResponse<ITicket>>(endpoint.TICKET, payload);
  },
  updateTicket: (id: string, payload: IUpdateTicket) => {
    return instance.patch<IApiResponse<ITicket>>(
      `${endpoint.TICKET}/${id}`,
      payload
    );
  },
  deleteTicket: (id: string) => {
    return instance.delete<IApiResponse<ITicket>>(`${endpoint.TICKET}/${id}`);
  },
};

export default ticketServices;
