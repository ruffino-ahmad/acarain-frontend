import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import * as yup from "yup";

import useCategoryOptions from "@/hooks/useCategoryOptions";
import type { IEvent } from "@/types/Event";
import { toDateTimeLocal } from "@/utils/date";
import useDetailEvent from "../useDetailEvent";

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
  isPublished: yup.boolean().required(),
  isFeatured: yup.boolean().required(),
});

type FormDataInfo = yup.InferType<typeof schema>;

interface UseInfoTabProps {
  dataEvent: IEvent;
}

const getCategoryId = (category: IEvent["category"]) =>
  typeof category === "string" ? category : category._id;

const getDefaultValues = (dataEvent: IEvent): FormDataInfo => ({
  name: dataEvent.name ?? "",
  category: dataEvent.category ? getCategoryId(dataEvent.category) : "",
  description: dataEvent.description ?? "",
  startDate: toDateTimeLocal(dataEvent.startDate),
  endDate: toDateTimeLocal(dataEvent.endDate),
  isPublished: dataEvent.isPublished ?? false,
  isFeatured: dataEvent.isFeatured ?? false,
});

const useInfoTab = (props: UseInfoTabProps) => {
  const { dataEvent } = props;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormDataInfo>({
    resolver: yupResolver(schema),
    defaultValues: getDefaultValues(dataEvent),
  });

  const watchedName = watch("name");
  const currentSlug = dataEvent.slug;
  const slugPreview =
    watchedName && watchedName !== dataEvent.name
      ? slugify(watchedName, { lower: true, strict: true, trim: true })
      : null;

  const {
    filteredCategories,
    isPendingCategories,
    handleCategorySearch,
    handleCategoryOpen,
  } = useCategoryOptions();

  const {
    mutateUpdateEvent,
    isPendingUpdateEvent,
    errorMessage,
  } = useDetailEvent();

  useEffect(() => {
    reset(getDefaultValues(dataEvent));
  }, [dataEvent, reset]);

  const handleSaveInfo = (data: FormDataInfo) => {
    mutateUpdateEvent(
      {
        name: data.name,
        category: data.category,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        isPublished: data.isPublished,
        isFeatured: data.isFeatured,
      },
      {
        onSuccess() {
          reset(data);
        },
      }
    );
  };

  return {
    control,
    handleSubmit,
    errors,
    isDirty,
    handleSaveInfo,
    isPendingUpdateEvent,
    errorMessage,
    filteredCategories,
    isPendingCategories,
    handleCategorySearch,
    handleCategoryOpen,
    currentSlug,
    slugPreview,
  };
};

export default useInfoTab;
