import { useMutation } from "@tanstack/react-query";
import { extractErrorMessage } from "@/utils/api-error";
import bannerServices from "@/services/banner.service";
import toast from "@/utils/toast";

interface UseDeleteBannerModalProps {
  onClose: () => void;
  refetchBanner: () => void;
}

const useDeleteBannerModal = (props: UseDeleteBannerModalProps) => {
  const { onClose, refetchBanner } = props;

  const {
    mutate: mutateDeleteBanner,
    isPending: isPendingMutateDeleteBanner,
  } = useMutation({
    mutationFn: (id: string) => bannerServices.deleteBanner(id),
    onSuccess: () => {
      toast.success("Banner deleted successfully");
      onClose();
      refetchBanner();
    },
    onError(error) {
      toast.error(extractErrorMessage(error));
    },
  });

  const handleDeleteBanner = (id: string) => {
    return mutateDeleteBanner(id);
  };

  return {
    handleDeleteBanner,
    isPendingMutateDeleteBanner,
  };
};

export default useDeleteBannerModal;
