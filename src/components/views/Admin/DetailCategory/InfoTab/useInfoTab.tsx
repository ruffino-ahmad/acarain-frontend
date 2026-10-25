import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import type { ICategory } from "@/types/Category";
import useUpdateCategory from "../useUpdateCategory";

const schema = yup.object({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name cannot exceed 100 characters")
    .required("Please enter name"),
  description: yup
    .string()
    .min(3, "Description must be at least 3 characters long")
    .max(500, "Description cannot exceed 500 characters")
    .required("Please enter description"),
});

type FormDataInfo = yup.InferType<typeof schema>;

interface UseInfoTabProps {
  dataCategory: ICategory;
  id: string;
}

const useInfoTab = (props: UseInfoTabProps) => {
  const { dataCategory, id } = props;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormDataInfo>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: dataCategory.name ?? "",
      description: dataCategory.description ?? "",
    },
  });

  const {
    mutateUpdateCategory,
    isPendingUpdateCategory,
    errorMessage,
  } = useUpdateCategory(id);

  useEffect(() => {
    reset({
      name: dataCategory.name ?? "",
      description: dataCategory.description ?? "",
    });
  }, [dataCategory, reset]);

  const handleSaveInfo = (data: FormDataInfo) => {
    mutateUpdateCategory(
      { name: data.name, description: data.description },
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
    isPendingUpdateCategory,
    errorMessage,
  };
};

export default useInfoTab;
