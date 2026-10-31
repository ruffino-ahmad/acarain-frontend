import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import useChangeUrl from "@/hooks/useChangeUrl";
import eventServices from "@/services/event.service";

import type { IEvent } from "@/types/Event";
import { IApiResponse } from "@/types/Pagination";

const useEvent = () => {
  const router = useRouter();
  const {
    currentLimit,
    currentPage,
    currentSearch,
    currentCategory,
    currentisOnline,
    currentisFeatured,
    currentisPublished,
  } = useChangeUrl();

  const getEvents = async (): Promise<IApiResponse<IEvent[]>> => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }
    if (currentCategory) {
      params += `&category=${String(currentCategory)}`;
    }
    if (currentisOnline === "true" || currentisOnline === "false") {
      params += `&isOnline=${String(currentisOnline)}`;
    }
    if (currentisFeatured === "true" || currentisFeatured === "false") {
      params += `&isFeatured=${String(currentisFeatured)}`;
    }

    if (currentisPublished === "true" || currentisPublished === "false") {
      params += `&isPublished=${String(currentisPublished)}`;
    }

    const res = await eventServices.getEvents(params);
    return res.data;
  };

  const {
    data: dataEvents,
    isLoading: isLoadingEvents,
    isRefetching: isRefetchingEvents,
    refetch: refetchEvent,
  } = useQuery({
    queryKey: [
      "Events",
      currentPage,
      currentLimit,
      currentSearch,
      currentCategory,
      currentisOnline,
      currentisFeatured,
      currentisPublished,
    ],
    queryFn: () => getEvents(),
    enabled: router.isReady && !!currentPage && !!currentLimit,
  });

  return {
    dataEvents,
    isLoadingEvents,
    isRefetchingEvents,
    refetchEvent,
  };
};

export default useEvent;
