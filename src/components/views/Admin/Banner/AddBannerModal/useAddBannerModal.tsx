import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import uploadServices from "@/services/upload.service";
import type { UploadMimeType } from "@/types/Upload";
import toast from "@/utils/toast";
import { extractErrorField, extractErrorMessage } from "@/utils/api-error";
import bannerServices from "@/services/banner.service";

const ALLOWED_MIME_TYPES: UploadMimeType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const schema = yup.object({
  title: yup.string().required("Please enter title"),
  isShow: yup.boolean().required("Please enter show status"),
  image: yup.string().required("Please select a image"),
});

export type FormDataAddBanner = yup.InferType<typeof schema>;

interface UseAddBannerModalProps {
  onClose: () => void;
  refetchBanner: () => void;
}

const useAddBannerModal = (props: UseAddBannerModalProps) => {
  const { onClose, refetchBanner } = props;

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const uploadedBlobRef = useRef<string | null>(null);
  const isCommittedRef = useRef(false);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<FormDataAddBanner>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      isShow: false,
      image: "",
    },
  });

  const applyPreview = useCallback((file: File | null) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    const next = file ? URL.createObjectURL(file) : null;
    previewUrlRef.current = next;
    setImagePreview(next);
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => uploadServices.uploadFile(file, "banners"),
    async onSuccess(blobName, file) {
      const previous = uploadedBlobRef.current;
      if (previous && previous !== blobName) {
        await uploadServices.deleteBlob(previous).catch(() => undefined);
      }

      uploadedBlobRef.current = blobName;
      applyPreview(file);
      setValue("image", blobName, { shouldValidate: true, shouldDirty: true });
    },
    onError(error) {
      toast.error(extractErrorMessage(error));
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: (blobName: string) => uploadServices.deleteBlob(blobName),
    onSuccess(_, blobName) {
      if (uploadedBlobRef.current === blobName) {
        uploadedBlobRef.current = null;
      }
      applyPreview(null);
      setValue("image", "", { shouldValidate: false });
    },
    onError(error) {
      toast.error(extractErrorMessage(error));
    },
  });

  const createBannerMutation = useMutation({
    mutationFn: (payload: FormDataAddBanner) =>
      bannerServices.createBanner({
        title: payload.title,
        isShow: payload.isShow,
        image: payload.image,
      }),
    onSuccess() {
      isCommittedRef.current = true;
      uploadedBlobRef.current = null;
      toast.success("Banner created successfully");
      reset();
      applyPreview(null);
      onClose();
      refetchBanner();
    },
    onError(error) {
      toast.error(extractErrorMessage(error));

      extractErrorField(error).forEach(detail => {
        if (!detail.field) return;
        setError(detail.field as keyof FormDataAddBanner, {
          message: detail.message,
        });
      });
    },
  });

  const handleUploadImage = (files: FileList) => {
    const file = files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type as UploadMimeType)) {
      setError("image", { message: "Image must be a JPG, PNG, or WEBP image" });
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("image", { message: "Image must not be larger than 5 MB" });
      return;
    }

    clearErrors("image");
    uploadImageMutation.mutate(file);
  };

  const handleDeleteImage = () => {
    const current = getValues("image");
    if (!current) return;
    deleteImageMutation.mutate(current);
  };

  const handleAddBanner = (data: FormDataAddBanner) => {
    createBannerMutation.mutate(data);
  };

  const handleClose = () => {
    const pending = uploadedBlobRef.current;
    if (pending && !isCommittedRef.current) {
      uploadedBlobRef.current = null;
      uploadServices.deleteBlob(pending).catch(() => undefined);
    }

    reset();
    applyPreview(null);
    onClose();
  };

  return {
    control,
    handleSubmit,
    errors,
    handleAddBanner,
    handleClose,
    handleUploadImage,
    handleDeleteImage,
    imagePreview,
    isPendingMutateAddBanner: createBannerMutation.isPending,
    isUploadingImage: uploadImageMutation.isPending,
    isDeletingImage: deleteImageMutation.isPending,
  };
};

export default useAddBannerModal;