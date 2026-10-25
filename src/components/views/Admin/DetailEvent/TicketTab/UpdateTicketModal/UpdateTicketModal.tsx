import InlineErrorAlert from "@/components/ui/InlineErrorAlert";
import type { ITicket } from "@/types/Ticket";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
} from "@heroui/react";
import { Controller } from "react-hook-form";

import useUpdateTicketModal from "./useUpdateTicketModal";

interface UpdateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (isOpen?: boolean) => void;
  refetchTicket: () => void;
  selectedTicket: ITicket | null;
}

const UpdateTicketModal = (props: UpdateTicketModalProps) => {
  const { isOpen, onClose, onOpenChange, refetchTicket, selectedTicket } =
    props;

  const {
    control,
    handleSubmit,
    errors,
    formError,
    handleUpdateTicket,
    handleClose,
    isPendingMutateUpdateTicket,
  } = useUpdateTicketModal({ isOpen, onClose, refetchTicket, selectedTicket });

  const handleOpenChange = (nextOpen?: boolean) => {
    if (nextOpen === false) {
      handleClose();
      return;
    }
    onOpenChange(nextOpen);
  };

  return (
    <Modal
      onOpenChange={handleOpenChange}
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
    >
      <form onSubmit={handleSubmit(handleUpdateTicket)}>
        <ModalContent className="m-4">
          <ModalHeader>Update Ticket</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <InlineErrorAlert
                title="Unable to update ticket"
                message={formError}
              />
              <p className="text-sm font-bold">Information</p>
              <div className="flex flex-col gap-4">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      autoFocus
                      label="Name"
                      variant="bordered"
                      type="text"
                      isInvalid={errors.name !== undefined}
                      errorMessage={errors.name?.message}
                    />
                  )}
                ></Controller>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Price"
                      variant="bordered"
                      type="number"
                      min={0}
                      isInvalid={errors.price !== undefined}
                      errorMessage={errors.price?.message}
                    />
                  )}
                ></Controller>
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Quantity"
                      variant="bordered"
                      type="number"
                      min={1}
                      isInvalid={errors.quantity !== undefined}
                      errorMessage={errors.quantity?.message}
                    />
                  )}
                ></Controller>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label="Description"
                      variant="bordered"
                      isInvalid={errors.description !== undefined}
                      errorMessage={errors.description?.message}
                    />
                  )}
                ></Controller>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              type="button"
              onPress={handleClose}
              isDisabled={isPendingMutateUpdateTicket}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              type="submit"
              isDisabled={isPendingMutateUpdateTicket || !selectedTicket}
            >
              {isPendingMutateUpdateTicket ? (
                <Spinner size="sm" color="white" />
              ) : (
                "Update ticket"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default UpdateTicketModal;
