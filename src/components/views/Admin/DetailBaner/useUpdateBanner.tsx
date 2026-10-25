import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";
import type { IUpdateBanner } from "@/types/Banner";
import bannerServices from "@/services/banner.service";

const useUpdateBanner = (id: string) => {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    mutate: mutateUpdateBanner,
    isPending: isPendingUpdateBanner,
  } = useMutation({
    mutationFn: (payload: IUpdateBanner) =>
      bannerServices.updateBanner(id, payload),
    onMutate() {
      setErrorMessage(null);
    },
    onSuccess() {
      setErrorMessage(null);
      toast.success("Banner updated successfully");
      queryClient.invalidateQueries({ queryKey: ["Banner"] });
    },
    onError(error) {
      setErrorMessage(extractErrorMessage(error));
    },
  });

  return { mutateUpdateBanner, isPendingUpdateBanner, errorMessage };
};

export default useUpdateBanner;