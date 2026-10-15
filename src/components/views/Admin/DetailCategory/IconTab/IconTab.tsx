import InputFile from "@/components/ui/InputFile";
import { Card, CardBody, CardHeader, Skeleton, Button } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import uploadServices from "@/services/upload.service";
import type { UploadMimeType } from "@/types/Upload";
import { extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";
import useUpdateCategory from "../useUpdateCategory";

const ALLOWED_MIME_TYPES: UploadMimeType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

interface IconTabProps {
  currentIconUrl?: string | null;
  isLoading: boolean;
  id: string;
}

const IconTab = (props: IconTabProps) => {
  const { currentIconUrl, isLoading, id } = props;

  const [pendingBlob, setPendingBlob] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [iconError, setIconError] = useState<string | undefined>(undefined);

  const previewUrlRef = useRef<string | null>(null);
  const pendingBlobRef = useRef<string | null>(null);
  const isCommittedRef = useRef(false);

  const { mutateUpdateCategory, isPendingUpdateCategory } =
    useUpdateCategory(id);

  const applyPreview = useCallback((file: File | null) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    const next = file ? URL.createObjectURL(file) : null;
    previewUrlRef.current = next;
    setPreview(next);
  }, []);

  const clearPending = useCallback(() => {
    const blob = pendingBlobRef.current;
    if (blob && !isCommittedRef.current) {
      pendingBlobRef.current = null;
      uploadServices.deleteBlob(blob).catch(() => undefined);
    }
    setPendingBlob(null);
    applyPreview(null);
  }, [applyPreview]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      const blob = pendingBlobRef.current;
      if (blob && !isCommittedRef.current) {
        uploadServices.deleteBlob(blob).catch(() => undefined);
      }
    };
  }, []);

  const uploadIconMutation = useMutation({
    mutationFn: (file: File) => uploadServices.uploadFile(file, "categories"),
    onSuccess(blobName, file) {
      const previous = pendingBlobRef.current;
      if (previous && previous !== blobName) {
        uploadServices.deleteBlob(previous).catch(() => undefined);
      }

      isCommittedRef.current = false;
      pendingBlobRef.current = blobName;
      setPendingBlob(blobName);
      applyPreview(file);
      setIconError(undefined);
    },
    onError(error) {
      toast.error(extractErrorMessage(error));
    },
  });

  const handleUploadIcon = (files: FileList) => {
    const file = files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type as UploadMimeType)) {
      setIconError("Icon must be a JPG, PNG, or WEBP image");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setIconError("Icon must not be larger than 5 MB");
      return;
    }

    setIconError(undefined);
    uploadIconMutation.mutate(file);
  };

  const handleSaveIcon = () => {
    if (!pendingBlob) return;

    mutateUpdateCategory(
      { icon: pendingBlob },
      {
        onSuccess() {
          isCommittedRef.current = true;
          pendingBlobRef.current = null;
          setPendingBlob(null);
          applyPreview(null);
        },
      }
    );
  };

  const handleCancelSelection = () => {
    clearPending();
    setIconError(undefined);
  };

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
            isUploading={uploadIconMutation.isPending}
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
              uploadIconMutation.isPending
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