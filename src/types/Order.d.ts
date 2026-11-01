interface IOrderVoucher {
  voucherId: string;
  isPrint: boolean;
}

interface IOrderCreatedBy {
  _id: string;
  fullname: string;
  username: string;
  email: string;
}

interface IOrder {
  _id: string;
  orderId: string;
  quantity: number;
  total: number;
  status: "pending" | "completed" | "cancelled";
  payment: {
    token: string;
    redirect_url: string;
  };
  vouchers?: IOrderVoucher[];
  events: string;
  ticket: string;
  createdBy: string | IOrderCreatedBy;
  createdAt?: string;
  updatedAt?: string;
}

export type { IOrder, IOrderVoucher, IOrderCreatedBy };
