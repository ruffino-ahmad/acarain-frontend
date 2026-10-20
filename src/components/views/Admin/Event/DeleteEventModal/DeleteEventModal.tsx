import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

import type { IEvent } from "@/types/Event";
import useDeleteEventModal from "./useDeleteEventModal";

interface DeleteEventModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen?: boolean) => void;
  onClose: () => void;
  refetchEvent: () => void;
  selectedEvent: IEvent | null;
}

const DeleteEventModal = (props: DeleteEventModalProps) => {
  const { isOpen, onClose, onOpenChange, refetchEvent, selectedEvent } = props;

  const { handleDeleteEvent, isPendingMutateDeleteEvent } =
    useDeleteEventModal({ onClose, refetchEvent });

  return (
    <Modal
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
      isDismissable={false}
      isKeyboardDismissDisabled
      hideCloseButton
    >
      <ModalContent className="m-4">
        <ModalHeader>Delete Event</ModalHeader>
        <ModalBody>
          <p className="text-medium">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedEvent?.name}</span>? This
            action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="flat"
            type="button"
            isDisabled={isPendingMutateDeleteEvent}
            onPress={onClose}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            type="button"
            isDisabled={!selectedEvent}
            isLoading={isPendingMutateDeleteEvent}
            onPress={() =>
              selectedEvent && handleDeleteEvent(selectedEvent._id)
            }
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteEventModal;