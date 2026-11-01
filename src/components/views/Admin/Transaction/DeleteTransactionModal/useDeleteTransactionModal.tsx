import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

import orderServices from "@/services/order.service";
import { extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";

interface UseDeleteTransactionModalProps {
  onClose: () => void;
  refetchTransaction: () => void;
}

const useDeleteTransactionModal = (props: UseDeleteTransactionModalProps) => {
  const { onClose, refetchTransaction } = props;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    mutate: mutateDeleteTransaction,
    isPending: isPendingMutateDeleteTransaction,
  } = useMutation({
    mutationFn: (id: string) => orderServices.deleteAdminOrder(id),
    onMutate: () => {
      setErrorMessage(null);
    },
    onSuccess: () => {
      setErrorMessage(null);
      toast.success("Transaction deleted successfully");
      onClose();
      refetchTransaction();
    },
    onError(error) {
      setErrorMessage(extractErrorMessage(error));
    },
  });

  const handleDeleteTransaction = (id: string) => {
    return mutateDeleteTransaction(id);
  };

  const clearError = () => {
    setErrorMessage(null);
  };

  return {
    handleDeleteTransaction,
    isPendingMutateDeleteTransaction,
    errorMessage,
    clearError,
  };
};

export default useDeleteTransactionModal;
