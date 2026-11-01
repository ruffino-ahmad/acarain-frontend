import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import authServices from "@/services/auth.service";
import type { IProfile, IUpdateProfile } from "@/types/Auth";
import { extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";

const PROFILE_QUERY_KEY = ["profile"] as const;

const useProfile = () => {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getProfile = async (): Promise<IProfile> => {
    const { data } = await authServices.getProfile();
    return data.data;
  };

  const { data: dataProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
  });

  const updateProfile = async (payload: IUpdateProfile) => {
    const { data } = await authServices.updateProfile(payload);
    return data.data;
  };

  const { mutate: mutateUpdateProfile, isPending: isPendingUpdateProfile } =
    useMutation({
      mutationFn: (payload: IUpdateProfile) => updateProfile(payload),
      onMutate() {
        setErrorMessage(null);
      },
      onSuccess() {
        setErrorMessage(null);
        toast.success("Profile updated successfully");
        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      },
      onError(error) {
        setErrorMessage(extractErrorMessage(error));
      },
    });

  const clearError = () => {
    setErrorMessage(null);
  };

  return {
    dataProfile,
    isLoadingProfile,
    mutateUpdateProfile,
    isPendingUpdateProfile,
    errorMessage,
    clearError,
  };
};

export default useProfile;
