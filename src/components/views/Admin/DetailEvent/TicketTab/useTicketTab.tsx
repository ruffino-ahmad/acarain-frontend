import ticketServices from "@/services/ticket.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const useTicketTab = () => {
  const { query, isReady } = useRouter();

  const getTicketByEventId = async (id: string) => {
    const { data } = await ticketServices.getTicketByEventId(`${query.id}`);
    return data.data;
  };

  const {
    data: dataTicket,
    isLoading: isLoadingTicket,
    isRefetching: isRefetchingTicket,
  } = useQuery({
    queryKey: ["Ticket", query.id],
    queryFn: () => getTicketByEventId(`${query.id}`),
    enabled: isReady && !!query.id,
  });

  return {
    dataTicket,
    isLoadingTicket,
    isRefetchingTicket,
  };
};

export default useTicketTab;
