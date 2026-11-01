import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";

import eventServices from "@/services/event.service";
import orderServices from "@/services/order.service";
import ticketServices from "@/services/ticket.service";
import { extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";

export type OrderStatusAction = "completed" | "pending" | "cancelled";

const useDetailTransaction = () => {
  const { query, isReady } = useRouter();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const id = query.id as string | undefined;

  const getOrderById = async () => {
    const { data } = await orderServices.getOrderById(`${id}`);
    return data.data;
  };

  const { data: dataOrder, isLoading: isLoadingOrder } = useQuery({
    queryKey: ["Order", id],
    queryFn: getOrderById,
    enabled: isReady && !!id,
  });

  const getEventById = async () => {
    const { data } = await eventServices.getEventById(`${dataOrder?.events}`);
    return data.data;
  };

  const { data: dataEvent } = useQuery({
    queryKey: ["Event", dataOrder?.events],
    queryFn: getEventById,
    enabled: !!dataOrder?.events,
  });

  const getTicketById = async () => {
    const { data } = await ticketServices.getTicketById(`${dataOrder?.ticket}`);
    return data.data;
  };

  const { data: dataTicket } = useQuery({
    queryKey: ["Ticket", dataOrder?.ticket],
    queryFn: getTicketById,
    enabled: !!dataOrder?.ticket,
  });

  const invalidateOrder = () => {
    queryClient.invalidateQueries({ queryKey: ["Order", id] });
    queryClient.invalidateQueries({ queryKey: ["AdminTransactions"] });
  };

  const removeOrder = () => {
    queryClient.removeQueries({ queryKey: ["Order", id] });
    queryClient.invalidateQueries({ queryKey: ["AdminTransactions"] });
  };

  const { mutate: mutateUpdateStatus, isPending: isPendingUpdateStatus } =
    useMutation({
      mutationFn: (status: OrderStatusAction) => {
        if (status === "completed") {
          return orderServices.completeAdminOrder(`${id}`);
        }

        if (status === "cancelled") {
          return orderServices.cancelAdminOrder(`${id}`);
        }

        return orderServices.pendingAdminOrder(`${id}`);
      },
      onMutate() {
        setErrorMessage(null);
      },
      onSuccess(_data, status) {
        setErrorMessage(null);
        toast.success(`Transaction marked as ${status}`);
        invalidateOrder();
      },
      onError(error) {
        setErrorMessage(extractErrorMessage(error));
      },
    });

  const clearError = () => {
    setErrorMessage(null);
  };

  return {
    id,
    dataOrder,
    dataEvent,
    dataTicket,
    isLoadingOrder,
    mutateUpdateStatus,
    isPendingUpdateStatus,
    errorMessage,
    clearError,
    invalidateOrder,
    removeOrder,
  };
};

export default useDetailTransaction;
