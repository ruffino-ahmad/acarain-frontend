import InputFile from "@/components/ui/InputFile";
import { Card, CardBody, CardHeader, Skeleton, Button } from "@heroui/react";
import Image from "next/image";

import useIconTab from "./useIconTab";

interface IconTabProps {
  currentIconUrl?: string | null;
  isLoading: boolean;
  id: string;
}

const IconTab = (props: IconTabProps) => {
  const { currentIconUrl, isLoading, id } = props;

  const {
    preview,
    iconError,
    pendingBlob,
    isUploadingIcon,
    isPendingUpdateCategory,
    handleUploadIcon,
    handleSaveIcon,
    handleCancelSelection,
  } = useIconTab({ id });

  return (
    <Card className="w-full p-4 lg:w-1/2">
      <CardHeader className="flex-col items-center">
        <h1 className="w-full text-xl font-bold">Category Icon</h1>
        <p className="text-default-400 text-small w-full">
          Manage icon for the category
        </p>
      </CardHeader>
      <CardBody>
        <form
          className="flex flex-col gap-4"
          onSubmit={event => {
            event.preventDefault();
            handleSaveIcon();
          }}
        >
          <div className="flex flex-col gap-2">
            <p className="text-default-700 text-sm font-medium">Current Icon</p>
            <Skeleton
              isLoaded={!isLoading}
              className="aspect-square rounded-lg"
            >
              {currentIconUrl ? (
                <Image
                  src={currentIconUrl}
                  alt="Category icon"
                  fill
                  sizes="256px"
                  className="object-contain"
                />
              ) : (
                <div className="text-default-400 flex h-full w-full items-center justify-center p-4 text-center text-sm">
                  No icon uploaded yet
                </div>
              )}
            </Skeleton>
          </div>
          <InputFile
            name="icon"
            label={<p className="text-sm font-medium">Upload New Icon</p>}
            isDropable
            preview={preview ?? undefined}
            onUpload={handleUploadIcon}
            onDelete={handleCancelSelection}
            isUploading={isUploadingIcon}
            isInvalid={iconError !== undefined}
            errorMessage={iconError}
          />
          <Button
            color="danger"
            className="disabled:bg-default-500"
            type="submit"
            isDisabled={
              !pendingBlob ||
              isPendingUpdateCategory ||
              isUploadingIcon
            }
          >
            {isPendingUpdateCategory ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default IconTab;
