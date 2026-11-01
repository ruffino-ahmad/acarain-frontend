import InlineErrorAlert from "@/components/ui/InlineErrorAlert";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

import useDeleteTransactionModal from "./useDeleteTransactionModal";
import { IOrder } from "@/types/Order";

interface DeleteTransactionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen?: boolean) => void;
  onClose: () => void;
  refetchTransaction: () => void;
  selectedTransaction: IOrder | null;
}

const DeleteTransactionModal = (props: DeleteTransactionModalProps) => {
  const {
    isOpen,
    onClose,
    onOpenChange,
    refetchTransaction,
    selectedTransaction,
  } = props;

  const {
    handleDeleteTransaction,
    isPendingMutateDeleteTransaction,
    errorMessage,
    clearError,
  } = useDeleteTransactionModal({ onClose, refetchTransaction });

  const handleClose = () => {
    clearError();
    onClose();
  };

  const handleOpenChange = (nextOpen?: boolean) => {
    if (nextOpen === false) {
      clearError();
    }
    onOpenChange(nextOpen);
  };

  return (
    <Modal
      onOpenChange={handleOpenChange}
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
      isDismissable={false}
      isKeyboardDismissDisabled={false}
    >
      <ModalContent className="m-4">
        <ModalHeader>Delete Transaction</ModalHeader>
        <ModalBody>
          <p className="text-medium">
            Are you sure you want to delete this Transaction? This action cannot
            be undone.
          </p>
          {selectedTransaction?.status === "completed" && (
            <p className="text-warning text-small">
              This order is already completed. Deleting it will not restore the
              ticket stock and the issued vouchers will no longer be valid.
            </p>
          )}
          <InlineErrorAlert
            title="Unable to delete Transaction"
            message={errorMessage}
          />
        </ModalBody>
        <ModalFooter className="flex-col gap-2 sm:flex-row">
          <Button
            color="default"
            variant="flat"
            isDisabled={isPendingMutateDeleteTransaction}
            className="w-full sm:w-auto"
            onPress={handleClose}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            isDisabled={
              !selectedTransaction || isPendingMutateDeleteTransaction
            }
            isLoading={isPendingMutateDeleteTransaction}
            className="w-full sm:w-auto"
            onPress={() =>
              selectedTransaction &&
              handleDeleteTransaction(selectedTransaction.orderId)
            }
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteTransactionModal;
