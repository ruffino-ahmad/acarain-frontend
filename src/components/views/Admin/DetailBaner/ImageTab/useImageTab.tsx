import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import uploadServices from "@/services/upload.service";
import type { UploadMimeType } from "@/types/Upload";
import { extractErrorMessage } from "@/utils/api-error";
import useUpdateBanner from "../useUpdateBanner";

const ALLOWED_MIME_TYPES: UploadMimeType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

interface UseImageTabProps {
  id: string;
}

const useImageTab = (props: UseImageTabProps) => {
  const { id } = props;

  const [pendingBlob, setPendingBlob] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | undefined>(undefined);

  const previewUrlRef = useRef<string | null>(null);
  const pendingBlobRef = useRef<string | null>(null);
  const isCommittedRef = useRef(false);


  const { mutateUpdateBanner, isPendingUpdateBanner, errorMessage } =
    useUpdateBanner(id);

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

  const uploadImageMutation = useMutation({
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
      setImageError(undefined);
    },
    onError(error) {
      setImageError(extractErrorMessage(error));
    },
  });

  const handleUploadImage = (files: FileList) => {
    const file = files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type as UploadMimeType)) {
      setImageError("Image must be a JPG, PNG, or WEBP image");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setImageError("Image must not be larger than 5 MB");
      return;
    }

    setImageError(undefined);
    uploadImageMutation.mutate(file);
  };

  const handleSaveImage = () => {
    if (!pendingBlob) return;

    mutateUpdateBanner(
      { image: pendingBlob },
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
    setImageError(undefined);
  };

  return {
    preview,
    imageError,
    pendingBlob,
    isUploadingImage: uploadImageMutation.isPending,
    isPendingUpdateBanner,
    errorMessage,
    handleUploadImage,
    handleSaveImage,
    handleCancelSelection,
  };
};

export default useImageTab;
