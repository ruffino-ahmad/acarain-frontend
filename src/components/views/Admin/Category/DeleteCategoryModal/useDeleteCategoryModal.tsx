import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

import categoryServices from "@/services/category.service";
import { extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";

interface UseDeleteCategoryModalProps {
  onClose: () => void;
  refetchCategory: () => void;
}

const useDeleteCategoryModal = (props: UseDeleteCategoryModalProps) => {
  const { onClose, refetchCategory } = props;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    mutate: mutateDeleteCategory,
    isPending: isPendingMutateDeleteCategory,
  } = useMutation({
    mutationFn: (id: string) => categoryServices.deleteCategory(id),
    onMutate: () => {
      setErrorMessage(null);
    },
    onSuccess: () => {
      setErrorMessage(null);
      toast.success("Category deleted successfully");
      onClose();
      refetchCategory();
    },
    onError(error) {
      setErrorMessage(extractErrorMessage(error));
    },
  });

  const handleDeleteCategory = (id: string) => {
    return mutateDeleteCategory(id);
  };

  const clearError = () => {
    setErrorMessage(null);
  };

  return {
    handleDeleteCategory,
    isPendingMutateDeleteCategory,
    errorMessage,
    clearError,
  };
};

export default useDeleteCategoryModal;
