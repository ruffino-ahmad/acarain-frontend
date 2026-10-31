import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import uploadServices from "@/services/upload.service";
import type { UploadMimeType } from "@/types/Upload";
import { extractErrorMessage } from "@/utils/api-error";
import useDetailCategory from "../useDetailCategory";

const ALLOWED_MIME_TYPES: UploadMimeType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const useIconTab = () => {
  const [pendingBlob, setPendingBlob] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [iconError, setIconError] = useState<string | undefined>(undefined);

  const previewUrlRef = useRef<string | null>(null);
  const pendingBlobRef = useRef<string | null>(null);
  const isCommittedRef = useRef(false);

  const {
    mutateUpdateCategory,
    isPendingUpdateCategory,
    errorMessage,
  } = useDetailCategory();

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
      setIconError(extractErrorMessage(error));
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

  return {
    preview,
    iconError,
    pendingBlob,
    isUploadingIcon: uploadIconMutation.isPending,
    isPendingUpdateCategory,
    errorMessage,
    handleUploadIcon,
    handleSaveIcon,
    handleCancelSelection,
  };
};

export default useIconTab;
