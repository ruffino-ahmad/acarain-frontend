import orderServices from "@/services/order.service";
import { IOrder } from "@/types/Order";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const usePayment = () => {
  const router = useRouter();
  const orderId = `${router.query.order_id ?? ""}`;

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["Order", orderId],
    queryFn: async () => {
      const { data } = await orderServices.getOrderById(orderId);
      return data.data as IOrder;
    },
    enabled: router.isReady && !!orderId,
    // Status order ditentukan oleh notifikasi (webhook) Midtrans di backend,
    // dan bisa datang sebelum atau sesudah redirect ke halaman ini.
    // Karena itu lakukan polling selama status masih pending.
    refetchInterval: query =>
      query.state.data?.status === "pending" ? 2000 : false,
  });

  return {
    orderId,
    isReady: router.isReady,
    order,
    isLoading,
    isError,
  };
};

export default usePayment;
