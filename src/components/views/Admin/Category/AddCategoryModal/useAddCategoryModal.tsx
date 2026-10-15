import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import categoryServices from "@/services/category.service";
import uploadServices from "@/services/upload.service";
import type { UploadMimeType } from "@/types/Upload";
import toast from "@/utils/toast";
import { ApiErrorBody, extractErrorMessage } from "@/utils/api-error";

const ALLOWED_MIME_TYPES: UploadMimeType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const schema = yup.object({
  name: yup.string().required("Please enter name"),
  description: yup.string().required("Please enter description"),
  icon: yup.string().required("Please select a image"),
});

export type FormDataAddCategory = yup.InferType<typeof schema>;


interface UseAddCategoryModalProps {
  onClose: () => void;
  refetchCategory: () => void;
}

const useAddCategoryModal = (props: UseAddCategoryModalProps) => {
  const { onClose, refetchCategory } = props;

  const [iconPreview, setIconPreview] = useState<string | null>(null);
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
  } = useForm<FormDataAddCategory>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
    },
  });

  const applyPreview = useCallback((file: File | null) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    const next = file ? URL.createObjectURL(file) : null;
    previewUrlRef.current = next;
    setIconPreview(next);
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const uploadIconMutation = useMutation({
    mutationFn: (file: File) => uploadServices.uploadFile(file, "categories"),
    async onSuccess(blobName, file) {
      const previous = uploadedBlobRef.current;
      if (previous && previous !== blobName) {
        await uploadServices.deleteBlob(previous).catch(() => undefined);
      }

      uploadedBlobRef.current = blobName;
      applyPreview(file);
      setValue("icon", blobName, { shouldValidate: true, shouldDirty: true });
    },
    onError(error) {
      toast.error(extractErrorMessage(error));
    },
  });

  const deleteIconMutation = useMutation({
    mutationFn: (blobName: string) => uploadServices.deleteBlob(blobName),
    onSuccess(_, blobName) {
      if (uploadedBlobRef.current === blobName) {
        uploadedBlobRef.current = null;
      }
      applyPreview(null);
      setValue("icon", "", { shouldValidate: false });
    },
    onError(error) {
      toast.error(extractErrorMessage(error));
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: (payload: FormDataAddCategory) =>
      categoryServices.createCategory({
        name: payload.name,
        description: payload.description,
        icon: payload.icon,
      }),
    onSuccess() {
      isCommittedRef.current = true;
      uploadedBlobRef.current = null;
      toast.success("Category created successfully");
      reset();
      applyPreview(null);
      onClose();
      refetchCategory();
    },
    onError(error) {
      toast.error(extractErrorMessage(error));

      const details = (error as AxiosError<ApiErrorBody>)?.response?.data?.data;
      if (!Array.isArray(details)) return;

      details.forEach(detail => {
        if (!detail.field) return;
        setError(detail.field as keyof FormDataAddCategory, {
          message: detail.message,
        });
      });
    },
  });

  const handleUploadIcon = (files: FileList) => {
    const file = files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type as UploadMimeType)) {
      setError("icon", { message: "Icon must be a JPG, PNG, or WEBP image" });
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("icon", { message: "Icon must not be larger than 5 MB" });
      return;
    }

    clearErrors("icon");
    uploadIconMutation.mutate(file);
  };

  const handleDeleteIcon = () => {
    const current = getValues("icon");
    if (!current) return;
    deleteIconMutation.mutate(current);
  };

  const handleAddCategory = (data: FormDataAddCategory) => {
    createCategoryMutation.mutate(data);
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
    handleAddCategory,
    handleClose,
    handleUploadIcon,
    handleDeleteIcon,
    iconPreview,
    isPendingMutateAddCategory: createCategoryMutation.isPending,
    isUploadingIcon: uploadIconMutation.isPending,
    isDeletingIcon: deleteIconMutation.isPending,
  };
};

export default useAddCategoryModal;