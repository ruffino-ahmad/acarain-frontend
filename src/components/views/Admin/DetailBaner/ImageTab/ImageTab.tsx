import InlineErrorAlert from "@/components/ui/InlineErrorAlert";
import InputFile from "@/components/ui/InputFile";
import { Card, CardBody, CardHeader, Skeleton, Button } from "@heroui/react";
import Image from "next/image";

import useImageTab from "./useImageTab";

interface ImageTabProps {
  currentImageUrl?: string | null;
  isLoading: boolean;
  id: string;
}

const ImageTab = (props: ImageTabProps) => {
  const { currentImageUrl, isLoading, id } = props;

  const {
    preview,
    imageError,
    pendingBlob,
    isUploadingImage,
    isPendingUpdateBanner,
    errorMessage,
    handleUploadImage,
    handleSaveImage,
    handleCancelSelection,
  } = useImageTab({ id });

  return (
    <Card className="w-full p-4 lg:w-1/2">
      <CardHeader className="flex-col items-center">
        <h1 className="w-full text-xl font-bold">Banner Image</h1>
        <p className="text-default-400 text-small w-full">
          Manage image for the banner
        </p>
      </CardHeader>
      <CardBody>
        <form
          className="flex flex-col gap-4"
          onSubmit={event => {
            event.preventDefault();
            handleSaveImage();
          }}
        >
          <InlineErrorAlert
            title="Unable to update category image"
            message={errorMessage}
          />
          <div className="flex flex-col gap-2">
            <p className="text-default-700 text-sm font-medium">Current Image</p>
            <Skeleton
              isLoaded={!isLoading}
              className="relative mx-auto aspect-square w-full max-w-96 rounded-lg"
            >
              {currentImageUrl ? (
                <Image
                  src={currentImageUrl}
                  alt="Banner image"
                  fill
                  sizes="384px"
                  className="object-contain"
                />
              ) : (
                <div className="text-default-400 flex h-full w-full items-center justify-center p-4 text-center text-sm">
                  No image uploaded yet
                </div>
              )}
            </Skeleton>
          </div>
          <InputFile
            name="image"
            label={<p className="text-sm font-medium">Upload New Image</p>}
            isDropable
            preview={preview ?? undefined}
            onUpload={handleUploadImage}
            onDelete={handleCancelSelection}
            isUploading={isUploadingImage}
            isInvalid={imageError !== undefined}
            errorMessage={imageError}
            previewClassName="mx-auto aspect-square w-full max-w-40 object-contain"
          />
          <Button
            color="danger"
            className="disabled:bg-default-500"
            type="submit"
            isDisabled={
              !pendingBlob || isPendingUpdateBanner || isUploadingImage
            }
          >
            {isPendingUpdateBanner ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default ImageTab;
