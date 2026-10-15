import { useMutation, useQueryClient } from "@tanstack/react-query";

import categoryServices from "@/services/category.service";
import type { IUpdateCategory } from "@/types/Category";
import { extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";

const useUpdateCategory = (id: string) => {
  const queryClient = useQueryClient();

  const {
    mutate: mutateUpdateCategory,
    isPending: isPendingUpdateCategory,
  } = useMutation({
    mutationFn: (payload: IUpdateCategory) =>
      categoryServices.updateCategory(id, payload),
    onSuccess() {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["Category"] });
    },
    onError(error) {
      toast.error(extractErrorMessage(error));
    },
  });

  return { mutateUpdateCategory, isPendingUpdateCategory };
};

export default useUpdateCategory;