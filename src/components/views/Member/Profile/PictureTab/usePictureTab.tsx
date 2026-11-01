import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import uploadServices from "@/services/upload.service";
import type { UploadMimeType } from "@/types/Upload";
import { extractErrorMessage } from "@/utils/api-error";

import useProfile from "../useProfile";

const ALLOWED_MIME_TYPES: UploadMimeType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const usePictureTab = () => {
  const [pendingBlob, setPendingBlob] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pictureError, setPictureError] = useState<string | undefined>(
    undefined
  );

  const previewUrlRef = useRef<string | null>(null);
  const pendingBlobRef = useRef<string | null>(null);
  const isCommittedRef = useRef(false);

  const { mutateUpdateProfile, isPendingUpdateProfile, errorMessage } =
    useProfile();

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

  const uploadPictureMutation = useMutation({
    mutationFn: (file: File) =>
      uploadServices.uploadFile(file, "profile-pictures"),
    onSuccess(blobName, file) {
      const previous = pendingBlobRef.current;
      if (previous && previous !== blobName) {
        uploadServices.deleteBlob(previous).catch(() => undefined);
      }

      isCommittedRef.current = false;
      pendingBlobRef.current = blobName;
      setPendingBlob(blobName);
      applyPreview(file);
      setPictureError(undefined);
    },
    onError(error) {
      setPictureError(extractErrorMessage(error));
    },
  });

  const handleUploadPicture = (files: FileList) => {
    const file = files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type as UploadMimeType)) {
      setPictureError("Profile picture must be a JPG, PNG, or WEBP image");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setPictureError("Profile picture must not be larger than 5 MB");
      return;
    }

    setPictureError(undefined);
    uploadPictureMutation.mutate(file);
  };

  const handleSavePicture = () => {
    if (!pendingBlob) return;

    mutateUpdateProfile(
      { profilePicture: pendingBlob },
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
    setPictureError(undefined);
  };

  return {
    preview,
    pictureError,
    pendingBlob,
    isUploadingPicture: uploadPictureMutation.isPending,
    isPendingUpdateProfile,
    errorMessage,
    handleUploadPicture,
    handleSavePicture,
    handleCancelSelection,
  };
};

export default usePictureTab;
