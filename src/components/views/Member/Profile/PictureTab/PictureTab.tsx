import InlineErrorAlert from "@/components/ui/InlineErrorAlert";
import InputFile from "@/components/ui/InputFile";
import type { IProfile } from "@/types/Auth";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@heroui/react";

import usePictureTab from "./usePictureTab";

interface PictureTabProps {
  dataProfile: IProfile;
}

const PictureTab = (props: PictureTabProps) => {
  const { dataProfile } = props;

  const {
    preview,
    pictureError,
    pendingBlob,
    isUploadingPicture,
    isPendingUpdateProfile,
    errorMessage,
    handleUploadPicture,
    handleSavePicture,
    handleCancelSelection,
  } = usePictureTab();

  const currentPicture = dataProfile.profilePictureUrl ?? undefined;

  return (
    <Card className="w-full max-w-2xl p-4 sm:p-6">
      <CardHeader className="flex-col items-start gap-1 px-0 pt-0">
        <h2 className="text-xl font-bold">Profile Picture</h2>
        <p className="text-default-400 text-small">
          Upload a photo so other members can recognize you.
        </p>
      </CardHeader>
      <CardBody className="gap-4 px-0 pb-0">
        <form
          className="flex flex-col gap-4"
          onSubmit={event => {
            event.preventDefault();
            handleSavePicture();
          }}
        >
          <InlineErrorAlert
            title="Unable to update profile picture"
            message={errorMessage}
          />

          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Avatar
              src={preview ?? currentPicture}
              name={dataProfile.fullname}
              showFallback
              className="size-24 shrink-0 text-large sm:size-28"
            />
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium">Current photo</p>
              <p className="text-default-400 text-xs">
                JPG, PNG or WEBP. Maximum size 5 MB.
              </p>
            </div>
          </div>

          <InputFile
            name="profilePicture"
            label={<p className="text-sm font-medium">Upload New Photo</p>}
            isDropable
            preview={preview ?? undefined}
            onUpload={handleUploadPicture}
            onDelete={handleCancelSelection}
            isUploading={isUploadingPicture}
            isInvalid={pictureError !== undefined}
            errorMessage={pictureError}
            previewClassName="aspect-square w-full max-w-48 rounded-full object-cover"
          />

          <Button
            color="danger"
            className="disabled:bg-default-500 w-full sm:w-auto sm:self-end"
            type="submit"
            isDisabled={
              !pendingBlob || isPendingUpdateProfile || isUploadingPicture
            }
          >
            {isPendingUpdateProfile ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default PictureTab;
