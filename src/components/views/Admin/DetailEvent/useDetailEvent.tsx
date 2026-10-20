import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import eventServices from "@/services/event.service";

const useDetailEvent = () => {
  const { query, isReady } = useRouter();

  const getEventById = async (id: string) => {
    const { data } = await eventServices.getEventById(`${query.id}`);
    return data.data;
  };

  const { data: dataEvent, isLoading: isLoadingEvent } = useQuery({
    queryKey: ["Event", query.id],
    queryFn: () => getEventById(`${query.id}`),
    enabled: isReady && !!query.id,
  });

  return {
    dataEvent,
    isLoadingEvent,
    id: query.id as string | undefined,
  };
};

export default useDetailEvent;
