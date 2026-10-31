import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";

import eventServices from "@/services/event.service";
import type { IUpdateEvent } from "@/types/Event";
import { extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";

const useDetailEvent = () => {
  const { query, isReady } = useRouter();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const id = query.id as string | undefined;

  const getEventById = async () => {
    const { data } = await eventServices.getEventById(`${id}`);
    return data.data;
  };

  const { data: dataEvent, isLoading: isLoadingEvent } = useQuery({
    queryKey: ["Event", id],
    queryFn: getEventById,
    enabled: isReady && !!id,
  });

  const { mutate: mutateUpdateEvent, isPending: isPendingUpdateEvent } =
    useMutation({
      mutationFn: (payload: IUpdateEvent) =>
        eventServices.updateEvent(`${id}`, payload),
      onMutate() {
        setErrorMessage(null);
      },
      onSuccess() {
        setErrorMessage(null);
        toast.success("Event updated successfully");
        queryClient.invalidateQueries({ queryKey: ["Event"] });
      },
      onError(error) {
        setErrorMessage(extractErrorMessage(error));
      },
    });

  return {
    dataEvent,
    isLoadingEvent,
    id,
    mutateUpdateEvent,
    isPendingUpdateEvent,
    errorMessage,
  };
};

export default useDetailEvent;
