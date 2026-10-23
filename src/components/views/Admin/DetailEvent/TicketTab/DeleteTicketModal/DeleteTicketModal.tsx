import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { ITicket } from "@/types/Ticket";
import useDeleteTicketModal from "./useDeleteTicketModal";

interface DeleteTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (isOpen?: boolean) => void;
  refetchTicket: () => void;
  selectedTicket?: ITicket | null;
}

const DeleteTicketModal = (props: DeleteTicketModalProps) => {
  const { isOpen, onClose, onOpenChange, refetchTicket, selectedTicket } =
    props;

  const { handleDeleteTicket, isPendingMutateDeleteTicket } =
    useDeleteTicketModal({ onClose, refetchTicket });

  return (
    <Modal
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
      isDismissable={false}
      isKeyboardDismissDisabled={false}
    >
      <ModalContent className="m-4">
        <ModalHeader>Delete Ticket</ModalHeader>
        <ModalBody>
          <p className="text-medium">
            Are you sure you want to delete this ticket? This action cannot be
            undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="flat"
            isDisabled={isPendingMutateDeleteTicket}
            onPress={onClose}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            isDisabled={!selectedTicket}
            isLoading={isPendingMutateDeleteTicket}
            onPress={() =>
              selectedTicket && handleDeleteTicket(selectedTicket._id)
            }
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteTicketModal;
