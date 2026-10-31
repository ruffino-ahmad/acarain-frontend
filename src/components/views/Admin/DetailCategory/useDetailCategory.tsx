import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";

import categoryServices from "@/services/category.service";
import type { IUpdateCategory } from "@/types/Category";
import { extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";

const useDetailCategory = () => {
  const { query, isReady } = useRouter();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const id = query.id as string | undefined;

  const getCategoryById = async () => {
    const { data } = await categoryServices.getCategoryById(`${id}`);
    return data.data;
  };

  const { data: dataCategory, isLoading: isLoadingCategory } = useQuery({
    queryKey: ["Category", id],
    queryFn: getCategoryById,
    enabled: isReady && !!id,
  });

  const { mutate: mutateUpdateCategory, isPending: isPendingUpdateCategory } =
    useMutation({
      mutationFn: (payload: IUpdateCategory) =>
        categoryServices.updateCategory(`${id}`, payload),
      onMutate() {
        setErrorMessage(null);
      },
      onSuccess() {
        setErrorMessage(null);
        toast.success("Category updated successfully");
        queryClient.invalidateQueries({ queryKey: ["Category"] });
      },
      onError(error) {
        setErrorMessage(extractErrorMessage(error));
      },
    });

  return {
    dataCategory,
    isLoadingCategory,
    id,
    mutateUpdateCategory,
    isPendingUpdateCategory,
    errorMessage,
  };
};

export default useDetailCategory;
