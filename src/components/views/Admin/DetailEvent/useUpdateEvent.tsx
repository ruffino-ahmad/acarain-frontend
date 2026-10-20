import { useMutation, useQueryClient } from "@tanstack/react-query";

import eventServices from "@/services/event.service";
import type { IUpdateEvent } from "@/types/Event";
import { extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";

const useUpdateEvent = (id: string) => {
  const queryClient = useQueryClient();

  const { mutate: mutateUpdateEvent, isPending: isPendingUpdateEvent } =
    useMutation({
      mutationFn: (payload: IUpdateEvent) =>
        eventServices.updateEvent(id, payload),
      onSuccess() {
        toast.success("Event updated successfully");
        queryClient.invalidateQueries({ queryKey: ["Event"] });
      },
      onError(error) {
        toast.error(extractErrorMessage(error));
      },
    });

  return { mutateUpdateEvent, isPendingUpdateEvent };
};

export default useUpdateEvent;
