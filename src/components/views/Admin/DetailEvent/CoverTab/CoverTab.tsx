import InlineErrorAlert from "@/components/ui/InlineErrorAlert";
import InputFile from "@/components/ui/InputFile";
import { Button, Card, CardBody, CardHeader, Skeleton } from "@heroui/react";
import Image from "next/image";

import useCoverTab from "./useCoverTab";

interface CoverTabProps {
  currentBannerUrl?: string | null;
  isLoading: boolean;
  id: string;
}

const CoverTab = (props: CoverTabProps) => {
  const { currentBannerUrl, isLoading, id } = props;

  const {
    preview,
    coverError,
    pendingBlob,
    isUploadingCover,
    isPendingUpdateEvent,
    errorMessage,
    handleUploadCover,
    handleSaveCover,
    handleCancelSelection,
  } = useCoverTab({ id });

  return (
    <Card className="w-full p-4 lg:w-1/2">
      <CardHeader className="flex-col items-center">
        <h1 className="w-full text-xl font-bold">Event Cover</h1>
        <p className="text-default-400 text-small w-full">
          Manage cover image for the event
        </p>
      </CardHeader>
      <CardBody>
        <form
          className="flex flex-col gap-4"
          onSubmit={event => {
            event.preventDefault();
            handleSaveCover();
          }}
        >
          <InlineErrorAlert
            title="Unable to update event cover"
            message={errorMessage}
          />
          <div className="flex flex-col gap-2">
            <p className="text-default-700 text-sm font-medium">
              Current Cover
            </p>
            <Skeleton
              isLoaded={!isLoading}
              className="relative aspect-video rounded-lg"
            >
              {currentBannerUrl ? (
                <Image
                  src={currentBannerUrl}
                  alt="Event cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 512px"
                  className="object-cover"
                />
              ) : (
                <div className="text-default-400 flex h-full w-full items-center justify-center p-4 text-center text-sm">
                  No cover uploaded yet
                </div>
              )}
            </Skeleton>
          </div>
          <InputFile
            name="banner"
            label={<p className="text-sm font-medium">Upload New Cover</p>}
            isDropable
            preview={preview ?? undefined}
            onUpload={handleUploadCover}
            onDelete={handleCancelSelection}
            isUploading={isUploadingCover}
            isInvalid={coverError !== undefined}
            errorMessage={coverError}
            previewClassName="aspect-video w-full max-w-md object-cover"
          />
          <Button
            color="danger"
            className="disabled:bg-default-500"
            type="submit"
            isDisabled={
              !pendingBlob || isPendingUpdateEvent || isUploadingCover
            }
          >
            {isPendingUpdateEvent ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default CoverTab;
