import { useMutation } from "@tanstack/react-query";
import categoryServices from "@/services/category.service";
import { ApiErrorBody, extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";
import { on } from "events";
import useAddCategoryModal from "../AddCategoryModal/useAddCategoryModal";

interface UseDeleteCategoryModalProps {
  onClose: () => void;
  refetchCategory: () => void;
}

const useDeleteCategoryModal = (props: UseDeleteCategoryModalProps) => {
  const { onClose, refetchCategory } = props;

  const {
    mutate: mutateDeleteCategory,
    isPending: isPendingMutateDeleteCategory,
  } = useMutation({
    mutationFn: (id: string) => categoryServices.deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted successfully");
      onClose();
      refetchCategory();
    },
    onError(error) {
      toast.error(extractErrorMessage(error));
    },
  });

  const handleDeleteCategory = (id: string) => {
    return mutateDeleteCategory(id);
  };

  return {
    handleDeleteCategory,
    isPendingMutateDeleteCategory,
  };
};

export default useDeleteCategoryModal;
