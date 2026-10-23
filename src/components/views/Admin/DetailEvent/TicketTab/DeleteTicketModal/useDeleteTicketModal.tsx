import { useMutation } from "@tanstack/react-query";

import ticketServices from "@/services/ticket.service";
import { extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";

interface UseDeleteTicketModalProps {
  onClose: () => void;
  refetchTicket: () => void;
}

const deleteTicket = async (id: string) => {
  const res = await ticketServices.deleteTicket(id);
  return res;
};

const useDeleteTicketModal = (props: UseDeleteTicketModalProps) => {
  const { onClose, refetchTicket } = props;

  const {
    mutate: mutateDeleteTicket,
    isPending: isPendingMutateDeleteTicket,
  } = useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      toast.success("Ticket deleted successfully");
      onClose();
      refetchTicket();
    },
    onError(error) {
      toast.error(extractErrorMessage(error));
    },
  });

  const handleDeleteTicket = (id: string) => {
    return mutateDeleteTicket(id);
  };

  return {
    handleDeleteTicket,
    isPendingMutateDeleteTicket,
  };
};

export default useDeleteTicketModal;
