import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import type { IProfile } from "@/types/Auth";

import useProfile from "../useProfile";

const schema = yup.object({
  fullname: yup
    .string()
    .trim()
    .min(3, "Fullname must be at least 3 characters long")
    .max(100, "Fullname cannot exceed 100 characters")
    .required("Please enter your fullname"),
});

type FormDataInfo = yup.InferType<typeof schema>;

interface UseInfoTabProps {
  dataProfile: IProfile;
}

const getDefaultValues = (dataProfile: IProfile): FormDataInfo => ({
  fullname: dataProfile.fullname ?? "",
});

const useInfoTab = (props: UseInfoTabProps) => {
  const { dataProfile } = props;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormDataInfo>({
    resolver: yupResolver(schema),
    defaultValues: getDefaultValues(dataProfile),
  });

  const { mutateUpdateProfile, isPendingUpdateProfile, errorMessage } =
    useProfile();

  useEffect(() => {
    reset(getDefaultValues(dataProfile));
  }, [dataProfile, reset]);

  const handleSaveInfo = (data: FormDataInfo) => {
    const fullname = data.fullname.trim();

    mutateUpdateProfile(
      { fullname },
      {
        onSuccess() {
          reset({ fullname });
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
    isPendingUpdateProfile,
    errorMessage,
  };
};

export default useInfoTab;
