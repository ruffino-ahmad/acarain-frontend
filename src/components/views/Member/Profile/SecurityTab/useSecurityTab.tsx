import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import authServices from "@/services/auth.service";
import type { IUpdatePassword } from "@/types/Auth";
import { extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";

const schema = yup.object({
  currentPassword: yup
    .string()
    .min(6, "Current password must be at least 6 characters long")
    .required("Please enter your current password"),
  newPassword: yup
    .string()
    .min(6, "New password must be at least 6 characters long")
    .required("Please enter your new password"),
  confirmNewPassword: yup
    .string()
    .min(6, "Confirm new password must be at least 6 characters long")
    .oneOf([yup.ref("newPassword")], "New passwords do not match")
    .required("Please confirm your new password"),
});

type FormDataSecurity = yup.InferType<typeof schema>;

const useSecurityTab = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState<Record<keyof FormDataSecurity, boolean>>(
    {
      currentPassword: false,
      newPassword: false,
      confirmNewPassword: false,
    }
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormDataSecurity>({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const { mutate: mutateUpdatePassword, isPending: isPendingUpdatePassword } =
    useMutation({
      mutationFn: (payload: IUpdatePassword) =>
        authServices.updatePassword(payload),
      onMutate() {
        setErrorMessage(null);
      },
      onSuccess() {
        setErrorMessage(null);
        toast.success("Password updated successfully");
        reset();
      },
      onError(error) {
        setErrorMessage(extractErrorMessage(error));
      },
    });

  const handleToggleVisible = (field: keyof FormDataSecurity) => {
    setVisible(previous => ({ ...previous, [field]: !previous[field] }));
  };

  const handleSavePassword = (data: FormDataSecurity) => {
    mutateUpdatePassword(data);
  };

  return {
    control,
    handleSubmit,
    errors,
    isDirty,
    visible,
    isPendingUpdatePassword,
    errorMessage,
    handleToggleVisible,
    handleSavePassword,
  };
};

export default useSecurityTab;
