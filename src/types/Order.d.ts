interface IOrderVoucher {
  voucherId: string;
  isPrint: boolean;
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
  createdAt?: string;
  updatedAt?: string;
}

export type { IOrder, IOrderVoucher };
