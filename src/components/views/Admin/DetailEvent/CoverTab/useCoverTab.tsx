import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import uploadServices from "@/services/upload.service";
import type { UploadMimeType } from "@/types/Upload";
import { extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";
import useUpdateEvent from "../useUpdateEvent";

const ALLOWED_MIME_TYPES: UploadMimeType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

interface UseCoverTabProps {
  id: string;
}

const useCoverTab = (props: UseCoverTabProps) => {
  const { id } = props;

  const [pendingBlob, setPendingBlob] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | undefined>(undefined);

  const previewUrlRef = useRef<string | null>(null);
  const pendingBlobRef = useRef<string | null>(null);
  const isCommittedRef = useRef(false);

  const {
    mutateUpdateEvent,
    isPendingUpdateEvent,
    errorMessage,
  } = useUpdateEvent(id);

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

  const uploadCoverMutation = useMutation({
    mutationFn: (file: File) => uploadServices.uploadFile(file, "banners"),
    onSuccess(blobName, file) {
      const previous = pendingBlobRef.current;
      if (previous && previous !== blobName) {
        uploadServices.deleteBlob(previous).catch(() => undefined);
      }

      isCommittedRef.current = false;
      pendingBlobRef.current = blobName;
      setPendingBlob(blobName);
      applyPreview(file);
      setCoverError(undefined);
    },
    onError(error) {
      toast.error(extractErrorMessage(error));
    },
  });

  const handleUploadCover = (files: FileList) => {
    const file = files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type as UploadMimeType)) {
      setCoverError("Cover must be a JPG, PNG, or WEBP image");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setCoverError("Cover must not be larger than 5 MB");
      return;
    }

    setCoverError(undefined);
    uploadCoverMutation.mutate(file);
  };

  const handleSaveCover = () => {
    if (!pendingBlob) return;

    mutateUpdateEvent(
      { banner: pendingBlob },
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
    setCoverError(undefined);
  };

  return {
    preview,
    coverError,
    pendingBlob,
    isUploadingCover: uploadCoverMutation.isPending,
    isPendingUpdateEvent,
    errorMessage,
    handleUploadCover,
    handleSaveCover,
    handleCancelSelection,
  };
};

export default useCoverTab;
