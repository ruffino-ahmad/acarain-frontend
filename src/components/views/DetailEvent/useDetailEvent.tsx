import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import eventServices from "@/services/event.service";
import ticketServices from "@/services/ticket.service";
import { useMemo, useState } from "react";
import { ICart, ITicket } from "@/types/Ticket";
import { defaultCart } from "./DetailEvent.constants";
import orderServices from "@/services/order.service";
import toast from "@/utils/toast";

const useDetailEvent = () => {
  const { query, isReady } = useRouter();

  const slug = query.slug as string | undefined;

  const getEventBySlug = async () => {
    const { data } = await eventServices.getEventBySlug(`${slug}`);
    return data.data;
  };

  const { data: dataDetailEvent } = useQuery({
    queryKey: ["EventBySlug", slug],
    queryFn: getEventBySlug,
    enabled: isReady,
  });

  const getTicketByEventId = async () => {
    const { data } = await ticketServices.getTicketByEventId(
      `${dataDetailEvent?._id}`
    );
    return data.data;
  };

  const { data: dataTicket } = useQuery({
    queryKey: ["Tickets", dataDetailEvent?._id],
    queryFn: getTicketByEventId,
    enabled: !!dataDetailEvent?._id,
  });

  const [cart, setCart] = useState<ICart>(defaultCart);

  const dataTicketInCart = useMemo<ITicket | null>(() => {
    if (!dataTicket) {
      return null;
    }

    return (
      dataTicket.find((ticket: ITicket) => ticket._id === cart.ticket) ?? null
    );
  }, [dataTicket, cart]);

  const handleAddToCart = (ticket: string) => {
    setCart({
      events: dataDetailEvent?._id as string,
      ticket: ticket,
      quantity: 1,
    });
  };

  const handleChangeQuantity = (type: "increment" | "decrement") => {
    if (!dataTicketInCart) return;

    if (type === "increment") {
      if (cart.quantity <= dataTicketInCart?.quantity) {
        setCart((prev: ICart) => ({
          ...prev,
          quantity: prev.quantity + 1,
        }));
      }
    } else {
      if (cart.quantity <= 1) {
        setCart(defaultCart);
      } else {
        setCart((prev: ICart) => ({
          ...prev,
          quantity: prev.quantity - 1,
        }));
      }
    }
  };

  const createOrder = async () => {
    const { data } = await orderServices.createOrder(cart);
    return data.data;
  };

  const { mutate: mutateCreateOrder, isPending: isPendingCreateOrder } =
    useMutation({
      mutationFn: createOrder,
      onError: error => {
        toast.error(error.message);
      },
      onSuccess: result => {
        const transactionToken = result.payment.token;
        (window as any).snap.pay(transactionToken);
      },
    });

  return {
    dataDetailEvent,
    dataTicket,
    dataTicketInCart,
    cart,
    handleAddToCart,
    handleChangeQuantity,
    mutateCreateOrder,
    isPendingCreateOrder,
  };
};

export default useDetailEvent;
