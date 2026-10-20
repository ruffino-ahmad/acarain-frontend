import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import * as yup from "yup";

import useDebounce from "@/hooks/useDebounce";
import categoryServices from "@/services/category.service";
import eventServices from "@/services/event.service";
import regionServices from "@/services/region.service";
import uploadServices from "@/services/upload.service";
import type { ICreateEvent } from "@/types/Event";
import type { UploadMimeType } from "@/types/Upload";
import { extractErrorField, extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";

const ALLOWED_MIME_TYPES: UploadMimeType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const schema = yup.object({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name cannot exceed 100 characters")
    .required("Please enter name"),
  category: yup.string().required("Please select a category"),
  description: yup
    .string()
    .min(3, "Description must be at least 3 characters long")
    .max(500, "Description cannot exceed 500 characters")
    .required("Please enter description"),
  banner: yup.string().required("Please select a banner"),
  startDate: yup.string().required("Please select a start date"),
  endDate: yup
    .string()
    .required("Please select an end date")
    .test(
      "is-after-start",
      "End date must be after the start date",
      function (value) {
        const { startDate } = this.parent;
        if (!value || !startDate) return true;
        return new Date(value).getTime() > new Date(startDate).getTime();
      }
    ),
  venueName: yup.string().optional(),
  address: yup.string().optional(),
  province: yup.string().optional(),
  regency: yup.string().optional(),
  isPublish: yup.boolean().required(),
  isFeatured: yup.boolean().required(),
  isOnline: yup.boolean().required(),
});

export type FormDataAddEvent = yup.InferType<typeof schema>;

interface UseAddEventModalProps {
  onClose: () => void;
  refetchEvent: () => void;
}

const useAddEventModal = (props: UseAddEventModalProps) => {
  const { onClose, refetchEvent } = props;

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [provinceSearch, setProvinceSearch] = useState("");
  const [regencySearch, setRegencySearch] = useState("");
  const previewUrlRef = useRef<string | null>(null);
  const uploadedBlobRef = useRef<string | null>(null);

  const debounceProvince = useDebounce();
  const debounceRegency = useDebounce();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<FormDataAddEvent>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      banner: "",
      startDate: "",
      endDate: "",
      venueName: "",
      address: "",
      province: "",
      regency: "",
      isPublish: false,
      isFeatured: false,
      isOnline: false,
    },
  });

  const eventName = watch("name");
  const isOnline = watch("isOnline");
  const selectedProvinceId = watch("province");

  const slugPreview = eventName
    ? slugify(eventName, { lower: true, strict: true, trim: true })
    : "";

  const applyPreview = useCallback((file: File | null) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    const next = file ? URL.createObjectURL(file) : null;
    previewUrlRef.current = next;
    setBannerPreview(next);
  }, []);

  const disposePendingBlob = useCallback(() => {
    const blob = uploadedBlobRef.current;
    if (blob) {
      uploadedBlobRef.current = null;
      uploadServices.deleteBlob(blob).catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      disposePendingBlob();
    };
  }, [disposePendingBlob]);

  const { data: categoryList } = useQuery({
    queryKey: ["Category", "select"],
    queryFn: async () => {
      const res = await categoryServices.getCategories("limit=100&page=1");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: provinceList, isPending: isPendingProvinces } = useQuery({
    queryKey: ["Region", "provinces"],
    queryFn: async () => {
      const res = await regionServices.getProvinces();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: regencyList, isPending: isPendingRegencies } = useQuery({
    queryKey: ["Region", "regencies", selectedProvinceId],
    queryFn: async () => {
      const res = await regionServices.getRegencies(Number(selectedProvinceId));
      return res.data.data[0]?.regencies ?? [];
    },
    enabled: Boolean(selectedProvinceId) && !isOnline,
    staleTime: 5 * 60 * 1000,
  });

  const filteredProvinces = useMemo(
    () =>
      (provinceList ?? []).filter(province =>
        province.name.toLowerCase().includes(provinceSearch)
      ),
    [provinceList, provinceSearch]
  );

  const filteredRegencies = useMemo(
    () =>
      (regencyList ?? []).filter(regency =>
        regency.name.toLowerCase().includes(regencySearch)
      ),
    [regencyList, regencySearch]
  );

  const handleProvinceSearch = (value: string) => {
    debounceProvince(() => setProvinceSearch(value.trim().toLowerCase()), 300);
  };

  const handleRegencySearch = (value: string) => {
    debounceRegency(() => setRegencySearch(value.trim().toLowerCase()), 300);
  };

  const handleProvinceOpen = (isOpen: boolean) => {
    if (isOpen) setProvinceSearch("");
  };

  const handleRegencyOpen = (isOpen: boolean) => {
    if (isOpen) setRegencySearch("");
  };

  const uploadBannerMutation = useMutation({
    mutationFn: (file: File) => uploadServices.uploadFile(file, "banners"),
    onSuccess(blobName, file) {
      disposePendingBlob();
      uploadedBlobRef.current = blobName;
      applyPreview(file);
      setValue("banner", blobName, { shouldValidate: true });
    },
    onError(error) {
      toast.error(extractErrorMessage(error));
    },
  });

  const handleUploadBanner = (files: FileList) => {
    const file = files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type as UploadMimeType)) {
      setError("banner", {
        message: "Banner must be a JPG, PNG, or WEBP image",
      });
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("banner", { message: "Banner must not be larger than 5 MB" });
      return;
    }

    clearErrors("banner");
    uploadBannerMutation.mutate(file);
  };

  const handleDeleteBanner = () => {
    disposePendingBlob();
    applyPreview(null);
    setValue("banner", "", { shouldValidate: false });
  };

  const handleToggleOnline = (value: boolean) => {
    setValue("isOnline", value, { shouldValidate: true });

    if (value) {
      setValue("venueName", "");
      setValue("address", "");
      setValue("province", "");
      setValue("regency", "");
      setProvinceSearch("");
      setRegencySearch("");
    }
  };

  const handleProvinceChange = (value: string) => {
    setValue("province", value, { shouldValidate: true });
    setValue("regency", "");
    setRegencySearch("");
  };

  const addEventService = async (payload: FormDataAddEvent) => {
    const province = provinceList?.find(
      item => String(item.id) === payload.province
    );
    const regency = regencyList?.find(
      item => String(item.id) === payload.regency
    );

    const data: ICreateEvent = {
      name: payload.name,
      category: payload.category,
      description: payload.description,
      banner: payload.banner,
      startDate: payload.startDate,
      endDate: payload.endDate,
      isFeatured: payload.isFeatured,
      isOnline: payload.isOnline,
      isPublish: payload.isPublish,
      location: payload.isOnline
        ? {}
        : {
            ...(payload.venueName ? { venueName: payload.venueName } : {}),
            ...(payload.address ? { address: payload.address } : {}),
            ...(province
              ? {
                  province: {
                    id: String(province.id),
                    name: province.name,
                  },
                }
              : {}),
            ...(regency
              ? {
                  regency: {
                    id: String(regency.id),
                    name: regency.name,
                  },
                }
              : {}),
          },
    };

    await eventServices.createEvent(data);
  };

  const { mutate: mutateAddEvent, isPending: isPendingMutateAddEvent } =
    useMutation({
      mutationFn: addEventService,
      onSuccess() {
        uploadedBlobRef.current = null;
        toast.success("Event created successfully");
        setProvinceSearch("");
        setRegencySearch("");
        reset();
        applyPreview(null);
        onClose();
        refetchEvent();
      },
      onError(error) {
        toast.error(extractErrorMessage(error));

        extractErrorField(error).forEach(detail => {
          if (!detail.field) return;
          setError(detail.field as keyof FormDataAddEvent, {
            message: detail.message,
          });
        });
      },
    });

  const handleAddEvent = (data: FormDataAddEvent) => {
    mutateAddEvent(data);
  };

  const handleClose = () => {
    disposePendingBlob();
    setProvinceSearch("");
    setRegencySearch("");
    reset();
    applyPreview(null);
    onClose();
  };

  return {
    control,
    handleSubmit,
    errors,
    handleAddEvent,
    handleClose,
    handleUploadBanner,
    handleDeleteBanner,
    handleToggleOnline,
    handleProvinceChange,
    bannerPreview,
    categoryList,
    filteredProvinces,
    filteredRegencies,
    handleProvinceSearch,
    handleRegencySearch,
    handleProvinceOpen,
    handleRegencyOpen,
    slugPreview,
    isOnline,
    selectedProvinceId,
    isPendingMutateAddEvent,
    isUploadingBanner: uploadBannerMutation.isPending,
    isPendingProvinces,
    isPendingRegencies,
  };
};

export default useAddEventModal;
