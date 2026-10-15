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
import { Controller } from "react-hook-form";
import useAddCategoryModal from "./useAddCategoryModal";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (isOpen?: boolean) => void;
  refetchCategory: () => void;
}

const AddCategoryModal = (props: AddCategoryModalProps) => {
  const { isOpen, onClose, onOpenChange, refetchCategory } = props;

  const {
    control,
    handleSubmit,
    errors,
    handleAddCategory,
    handleClose,
    handleUploadIcon,
    handleDeleteIcon,
    iconPreview,
    isPendingMutateAddCategory,
    isUploadingIcon,
    isDeletingIcon,
  } = useAddCategoryModal({ onClose, refetchCategory });

  const isSubmitting =
    isPendingMutateAddCategory || isUploadingIcon || isDeletingIcon;

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
      <form onSubmit={handleSubmit(handleAddCategory)}>
        <ModalContent className="m-4">
          <ModalHeader>Add Category</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold">Information</p>
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
                    className="mb-2"
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
                    className="mb-2"
                  />
                )}
              ></Controller>
              <InputFile
                name="icon"
                label={<p className="text-sm font-bold">Icon</p>}
                isDropable
                preview={iconPreview ?? undefined}
                onUpload={handleUploadIcon}
                onDelete={handleDeleteIcon}
                isUploading={isUploadingIcon}
                isDeleting={isDeletingIcon}
                isInvalid={errors.icon !== undefined}
                errorMessage={errors.icon?.message}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              type="button"
              onPress={handleClose}
              isDisabled={isPendingMutateAddCategory}
            >
              Cancel
            </Button>
            <Button color="danger" type="submit" isDisabled={isSubmitting}>
              {isPendingMutateAddCategory ? (
                <Spinner size="sm" color="white" />
              ) : (
                "Create category"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default AddCategoryModal;
