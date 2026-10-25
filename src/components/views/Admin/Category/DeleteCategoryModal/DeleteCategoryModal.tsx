import InlineErrorAlert from "@/components/ui/InlineErrorAlert";
import type { ICategory } from "@/types/Category";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

import useDeleteCategoryModal from "./useDeleteCategoryModal";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen?: boolean) => void;
  onClose: () => void;
  refetchCategory: () => void;
  selectedCategory: ICategory | null;
}

const DeleteCategoryModal = (props: DeleteCategoryModalProps) => {
  const { isOpen, onClose, onOpenChange, refetchCategory, selectedCategory } =
    props;

  const {
    handleDeleteCategory,
    isPendingMutateDeleteCategory,
    errorMessage,
    clearError,
  } = useDeleteCategoryModal({ onClose, refetchCategory });

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
        <ModalHeader>Delete Category</ModalHeader>
        <ModalBody>
          <p className="text-medium">
            Are you sure you want to delete this category? This action cannot be
            undone.
          </p>
          <InlineErrorAlert
            title="Unable to delete category"
            message={errorMessage}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="flat"
            isDisabled={isPendingMutateDeleteCategory}
            onPress={handleClose}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            isDisabled={!selectedCategory || isPendingMutateDeleteCategory}
            isLoading={isPendingMutateDeleteCategory}
            onPress={() =>
              selectedCategory && handleDeleteCategory(selectedCategory._id)
            }
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteCategoryModal;
