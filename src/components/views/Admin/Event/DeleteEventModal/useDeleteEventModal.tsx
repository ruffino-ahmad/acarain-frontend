import { useMutation } from "@tanstack/react-query";

import eventServices from "@/services/event.service";
import { extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";

interface UseDeleteEventModalProps {
  onClose: () => void;
  refetchEvent: () => void;
}

const useDeleteEventModal = (props: UseDeleteEventModalProps) => {
  const { onClose, refetchEvent } = props;

  const {
    mutate: mutateDeleteEvent,
    isPending: isPendingMutateDeleteEvent,
  } = useMutation({
    mutationFn: (id: string) => eventServices.deleteEvent(id),
    onSuccess() {
      toast.success("Event deleted successfully");
      onClose();
      refetchEvent();
    },
    onError(error) {
      toast.error(extractErrorMessage(error));
    },
  });

  const handleDeleteEvent = (id: string) => {
    return mutateDeleteEvent(id);
  };

  return { handleDeleteEvent, isPendingMutateDeleteEvent };
};

export default useDeleteEventModal;