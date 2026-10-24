import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

import type { IBanner } from "@/types/Banner";
import useDeleteBannerModal from "./useDeleteBannerModal";

interface DeleteBannerModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen?: boolean) => void;
  onClose: () => void;
  refetchBanner: () => void;
  selectedBanner: IBanner | null;
}

const DeleteBannerModal = (props: DeleteBannerModalProps) => {
  const { isOpen, onClose, onOpenChange, refetchBanner, selectedBanner } =
    props;

  const { handleDeleteBanner, isPendingMutateDeleteBanner } =
    useDeleteBannerModal({ onClose, refetchBanner });

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
        <ModalHeader>Delete Banner</ModalHeader>
        <ModalBody>
          <p className="text-medium">
            Are you sure you want to delete this banner? This action cannot be
            undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="flat"
            isDisabled={isPendingMutateDeleteBanner}
            onPress={onClose}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            isDisabled={!selectedBanner || isPendingMutateDeleteBanner}
            isLoading={isPendingMutateDeleteBanner}
            onPress={() =>
              selectedBanner && handleDeleteBanner(selectedBanner._id)
            }
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteBannerModal;
