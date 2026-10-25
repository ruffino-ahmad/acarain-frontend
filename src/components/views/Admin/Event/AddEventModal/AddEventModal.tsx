import InlineErrorAlert from "@/components/ui/InlineErrorAlert";
import InputFile from "@/components/ui/InputFile";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Switch,
  Textarea,
} from "@heroui/react";
import { Controller } from "react-hook-form";

import useAddEventModal from "./useAddEventModal";

interface AddEventModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen?: boolean) => void;
  onClose: () => void;
  refetchEvent: () => void;
}

const AddEventModal = (props: AddEventModalProps) => {
  const { isOpen, onClose, onOpenChange, refetchEvent } = props;

  const {
    control,
    handleSubmit,
    errors,
    formError,
    handleAddEvent,
    handleClose,
    handleUploadBanner,
    handleDeleteBanner,
    handleToggleOnline,
    handleProvinceChange,
    bannerPreview,
    categoryList,
    filteredProvinces,
    filteredRegencies,
    handleProvinceSearch,
    handleRegencySearch,
    handleProvinceOpen,
    handleRegencyOpen,
    slugPreview,
    isOnline,
    selectedProvinceId,
    isPendingMutateAddEvent,
    isUploadingBanner,
    isPendingProvinces,
    isPendingRegencies,
  } = useAddEventModal({ onClose, refetchEvent });

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
      <form onSubmit={handleSubmit(handleAddEvent)}>
        <ModalContent className="m-4">
          <ModalHeader>Add Event</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <InlineErrorAlert
                title="Unable to create event"
                message={formError}
              />
              <p className="text-sm font-bold">Information</p>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Name"
                    variant="bordered"
                    type="text"
                    isInvalid={errors.name !== undefined}
                    errorMessage={errors.name?.message}
                  />
                )}
              />
              <Input
                label="Slug"
                variant="bordered"
                value={slugPreview}
                placeholder="auto-generated-from-name"
                description="Generated automatically from the event name"
                isReadOnly
              />
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Category"
                    variant="bordered"
                    selectedKeys={field.value ? [field.value] : []}
                    onSelectionChange={keys =>
                      field.onChange(Array.from(keys)[0] ?? "")
                    }
                    isInvalid={errors.category !== undefined}
                    errorMessage={errors.category?.message}
                  >
                    {(categoryList ?? []).map(category => (
                      <SelectItem key={category._id} textValue={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
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
              />
              <p className="text-sm font-bold">Schedule</p>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Start Date"
                    variant="bordered"
                    type="datetime-local"
                    placeholder=" "
                    isInvalid={errors.startDate !== undefined}
                    errorMessage={errors.startDate?.message}
                  />
                )}
              />
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="End Date"
                    variant="bordered"
                    type="datetime-local"
                    placeholder=" "
                    isInvalid={errors.endDate !== undefined}
                    errorMessage={errors.endDate?.message}
                  />
                )}
              />
              <p className="text-sm font-bold">Status</p>
              <div className="flex flex-col gap-3">
                <Controller
                  name="isPublish"
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
                <Controller
                  name="isFeatured"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      isSelected={field.value}
                      onValueChange={field.onChange}
                      size="sm"
                    >
                      Featured
                    </Switch>
                  )}
                />
                <Controller
                  name="isOnline"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      isSelected={field.value}
                      onValueChange={handleToggleOnline}
                      size="sm"
                    >
                      Online Event
                    </Switch>
                  )}
                />
              </div>
              {!isOnline && (
                <>
                  <p className="text-sm font-bold">Location</p>
                  <Controller
                    name="venueName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Venue Name"
                        variant="bordered"
                        type="text"
                        isInvalid={errors.venueName !== undefined}
                        errorMessage={errors.venueName?.message}
                      />
                    )}
                  />
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Address"
                        variant="bordered"
                        type="text"
                        isInvalid={errors.address !== undefined}
                        errorMessage={errors.address?.message}
                      />
                    )}
                  />
                  <Controller
                    name="province"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        label="Province"
                        variant="bordered"
                        items={filteredProvinces}
                        defaultFilter={() => true}
                        selectedKey={field.value || null}
                        onSelectionChange={key =>
                          handleProvinceChange(String(key ?? ""))
                        }
                        onInputChange={handleProvinceSearch}
                        onOpenChange={handleProvinceOpen}
                        onClear={() => handleProvinceChange("")}
                        isClearable
                        isDisabled={isPendingProvinces}
                        isInvalid={errors.province !== undefined}
                        errorMessage={errors.province?.message}
                      >
                        {province => (
                          <AutocompleteItem
                            key={String(province.id)}
                            textValue={province.name}
                          >
                            {province.name}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    )}
                  />
                  <Controller
                    name="regency"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        key={selectedProvinceId || "regency"}
                        label="City / Regency"
                        variant="bordered"
                        items={filteredRegencies}
                        defaultFilter={() => true}
                        selectedKey={field.value || null}
                        onSelectionChange={key =>
                          field.onChange(String(key ?? ""))
                        }
                        onInputChange={handleRegencySearch}
                        onOpenChange={handleRegencyOpen}
                        onClear={() => field.onChange("")}
                        isClearable
                        isDisabled={!selectedProvinceId || isPendingRegencies}
                        isInvalid={errors.regency !== undefined}
                        errorMessage={errors.regency?.message}
                      >
                        {regency => (
                          <AutocompleteItem
                            key={String(regency.id)}
                            textValue={regency.name}
                          >
                            {regency.name}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    )}
                  />
                </>
              )}
              <InputFile
                name="banner"
                label={<p className="text-sm font-bold">Banner</p>}
                isDropable
                preview={bannerPreview ?? undefined}
                onUpload={handleUploadBanner}
                onDelete={handleDeleteBanner}
                isUploading={isUploadingBanner}
                isInvalid={errors.banner !== undefined}
                errorMessage={errors.banner?.message}
                previewClassName="aspect-video w-full max-w-md object-cover"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              type="button"
              onPress={handleClose}
              isDisabled={isPendingMutateAddEvent}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              type="submit"
              isDisabled={isPendingMutateAddEvent || isUploadingBanner}
            >
              {isPendingMutateAddEvent ? (
                <Spinner size="sm" color="white" />
              ) : (
                "Create event"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default AddEventModal;