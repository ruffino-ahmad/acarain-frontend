import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import categoryServices from "@/services/category.service";
import type { IUpdateCategory } from "@/types/Category";
import { extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";

const useUpdateCategory = (id: string) => {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    mutate: mutateUpdateCategory,
    isPending: isPendingUpdateCategory,
  } = useMutation({
    mutationFn: (payload: IUpdateCategory) =>
      categoryServices.updateCategory(id, payload),
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

  return { mutateUpdateCategory, isPendingUpdateCategory, errorMessage };
};

export default useUpdateCategory;