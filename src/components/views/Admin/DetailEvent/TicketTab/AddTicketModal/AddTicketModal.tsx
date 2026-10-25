import InlineErrorAlert from "@/components/ui/InlineErrorAlert";
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
import useAddTicketModal from "./useAddTicketModal";

interface AddTicketModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (isOpen?: boolean) => void;
  refetchTicket: () => void;
}

const AddTicketModal = (props: AddTicketModalProps) => {
  const { eventId, isOpen, onClose, onOpenChange, refetchTicket } = props;

  const {
    control,
    handleSubmit,
    errors,
    formError,
    handleAddTicket,
    handleClose,
    isPendingMutateAddTicket,
  } = useAddTicketModal({ eventId, onClose, refetchTicket });

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
      <form onSubmit={handleSubmit(handleAddTicket)}>
        <ModalContent className="m-4">
          <ModalHeader>Add Ticket</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <InlineErrorAlert
                title="Unable to create ticket"
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
              isDisabled={isPendingMutateAddTicket}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              type="submit"
              isDisabled={isPendingMutateAddTicket}
            >
              {isPendingMutateAddTicket ? (
                <Spinner size="sm" color="white" />
              ) : (
                "Create ticket"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default AddTicketModal;
