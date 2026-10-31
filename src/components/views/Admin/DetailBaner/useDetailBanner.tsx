import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";

import bannerServices from "@/services/banner.service";
import type { IUpdateBanner } from "@/types/Banner";
import { extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";

const useDetailBanner = () => {
  const { query, isReady } = useRouter();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const id = query.id as string | undefined;

  const getBannerById = async () => {
    const { data } = await bannerServices.getBannerById(`${id}`);
    return data.data;
  };

  const { data: dataBanner, isLoading: isLoadingBanner } = useQuery({
    queryKey: ["Banner", id],
    queryFn: getBannerById,
    enabled: isReady && !!id,
  });

  const { mutate: mutateUpdateBanner, isPending: isPendingUpdateBanner } =
    useMutation({
      mutationFn: (payload: IUpdateBanner) =>
        bannerServices.updateBanner(`${id}`, payload),
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

  return {
    dataBanner,
    isLoadingBanner,
    id,
    mutateUpdateBanner,
    isPendingUpdateBanner,
    errorMessage,
  };
};

export default useDetailBanner;
