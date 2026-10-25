import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import type { ICategory } from "@/types/Category";
import useUpdateCategory from "../useUpdateBanner";
import { IBanner } from "@/types/Banner";
import useUpdateBanner from "../useUpdateBanner";

const schema = yup.object({
  title: yup.string().required("Please enter title"),
  isShow: yup.boolean().required("Please enter show status"),
  image: yup.string().required("Please select a image"),
});

type FormDataInfo = yup.InferType<typeof schema>;

interface UseInfoTabProps {
  dataBanner: IBanner;
  id: string;
}

const useInfoTab = (props: UseInfoTabProps) => {
  const { dataBanner, id } = props;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormDataInfo>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: dataBanner.title ?? "",
      isShow: dataBanner.isShow ?? false,
      image: dataBanner.image ?? "",
    },
  });

  const { mutateUpdateBanner, isPendingUpdateBanner, errorMessage } =
    useUpdateBanner(id);

  useEffect(() => {
    reset({
      title: dataBanner.title ?? "",
      isShow: dataBanner.isShow ?? false,
      image: dataBanner.image ?? "",
    });
  }, [dataBanner, reset]);

  const handleSaveInfo = (data: FormDataInfo) => {
    mutateUpdateBanner(
      { title: data.title, isShow: data.isShow, image: data.image },
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
    isPendingUpdateBanner,
    errorMessage,
  };
};

export default useInfoTab;
