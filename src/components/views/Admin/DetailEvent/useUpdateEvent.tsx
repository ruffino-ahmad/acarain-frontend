import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import eventServices from "@/services/event.service";
import type { IUpdateEvent } from "@/types/Event";
import { extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";

const useUpdateEvent = (id: string) => {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: mutateUpdateEvent, isPending: isPendingUpdateEvent } =
    useMutation({
      mutationFn: (payload: IUpdateEvent) =>
        eventServices.updateEvent(id, payload),
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

  return { mutateUpdateEvent, isPendingUpdateEvent, errorMessage };
};

export default useUpdateEvent;
