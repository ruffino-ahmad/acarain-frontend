import bannerServices from "@/services/banner.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const useDetailBanner = () => {
  const { query, isReady } = useRouter();

  const getBannerById = async (id: string) => {
    const { data } = await bannerServices.getBannerById(id);
    return data.data;
  };

  const { data: dataBanner, isLoading: isLoadingBanner } = useQuery({
    queryKey: ["Banner", query.id],
    queryFn: () => getBannerById(`${query.id}`),
    enabled: isReady && !!query.id,
  });

  return {
    dataBanner,
    isLoadingBanner,
    id: query.id as string | undefined,
  };
};

export default useDetailBanner;
