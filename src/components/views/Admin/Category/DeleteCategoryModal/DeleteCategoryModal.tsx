import InputFile from "@/components/ui/InputFile";
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
import useDeleteCategoryModal from "./useDeleteCategoryModal";
import { ICategory } from "@/types/Category";
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

  const { handleDeleteCategory, isPendingMutateDeleteCategory } =
    useDeleteCategoryModal({ onClose, refetchCategory });

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
        <ModalHeader>Delete Category</ModalHeader>
        <ModalBody>
          <p className="text-medium">
            Are you sure you want to delete this category? This action cannot be
            undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="flat"
            isDisabled={isPendingMutateDeleteCategory}
            onPress={onClose}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            // isDisabled={!selectedCategory || isPendingMutateDeleteCategory}
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
