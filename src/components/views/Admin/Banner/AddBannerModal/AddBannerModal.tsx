import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Switch,
} from "@heroui/react";
import { Controller } from "react-hook-form";

import InputFile from "@/components/ui/InputFile";

import useAddBannerModal from "./useAddBannerModal";

interface AddBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (isOpen?: boolean) => void;
  refetchBanner: () => void;
}

const AddBannerModal = (props: AddBannerModalProps) => {
  const { isOpen, onClose, onOpenChange, refetchBanner } = props;

  const {
    control,
    handleSubmit,
    errors,
    handleAddBanner,
    handleClose,
    handleUploadImage,
    handleDeleteImage,
    imagePreview,
    isPendingMutateAddBanner,
    isUploadingImage,
    isDeletingImage,
  } = useAddBannerModal({ onClose, refetchBanner });

  const isSubmitting =
    isPendingMutateAddBanner || isUploadingImage || isDeletingImage;

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
      <form onSubmit={handleSubmit(handleAddBanner)}>
        <ModalContent className="m-4">
          <ModalHeader>Add Banner</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold">Information</p>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    autoFocus
                    label="Name"
                    variant="bordered"
                    type="text"
                    isInvalid={errors.title !== undefined}
                    errorMessage={errors.title?.message}
                    className="mb-2"
                  />
                )}
              ></Controller>
              <Controller
                name="isShow"
                control={control}
                render={({ field }) => (
                  <Switch
                    isSelected={field.value}
                    onValueChange={field.onChange}
                    size="sm"
                  >
                    Published
                  </Switch>
                )}
              />
              <InputFile
                name="image"
                label={<p className="text-sm font-bold">Image</p>}
                isDropable
                preview={imagePreview ?? undefined}
                onUpload={handleUploadImage}
                onDelete={handleDeleteImage}
                isUploading={isUploadingImage}
                isDeleting={isDeletingImage}
                isInvalid={errors.image !== undefined}
                errorMessage={errors.image?.message}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              type="button"
              onPress={handleClose}
              isDisabled={
                isPendingMutateAddBanner || isUploadingImage || isDeletingImage
              }
            >
              Cancel
            </Button>
            <Button color="danger" type="submit" isDisabled={isSubmitting}>
              {isPendingMutateAddBanner ? (
                <Spinner size="sm" color="white" />
              ) : (
                "Create banner"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default AddBannerModal;
