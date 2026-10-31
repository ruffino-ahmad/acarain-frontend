import { IEvent } from "./Event";

type ITicketEvent = Pick<IEvent, "_id" | "name" | "description">;

interface ITicket {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  events: ITicketEvent | null;
  createdAt?: string;
  updatedAt?: string;
}

interface ICreateTicket {
  name: string;
  description: string;
  price: number;
  quantity: number;
  events: string;
}

interface ICart {
  events: string;
  ticket: string;
  quantity: number;
}

type IUpdateTicket = Partial<Pick<ICreateTicket>>;

export type { ICreateTicket, IUpdateTicket, ITicket, ITicketEvent, ICart };
