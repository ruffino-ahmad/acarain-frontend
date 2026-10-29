import bannerServices from "@/services/banner.service";

import { useQuery } from "@tanstack/react-query";

import type { IBanner } from "@/types/Banner";
import type { IApiResponse } from "@/types/Pagination";
import { LIMIT_BANNER, LIMIT_CATEGORY, PAGE_DEFAULT } from "@/constants/list.constants";
import { IEvent } from "@/types/Event";
import eventServices from "@/services/event.service";
import { ICategory } from "@/types/Category";
import categoryServices from "@/services/category.service";

const useHome = () => {
  const getBanners = async (): Promise<IApiResponse<IBanner[]>> => {
    let params = `limit=${LIMIT_BANNER}&page=${PAGE_DEFAULT}`;
    const res = await bannerServices.getBanners(params);
    const { data } = res;
    return data;
  };

  const { data: dataBanners, isLoading: isLoadingBanners } = useQuery({
    queryKey: ["Banner"],
    queryFn: () => getBanners(),
    enabled: true,
  });

  const getEvents = async (params: string): Promise<IApiResponse<IEvent[]>> => {
    const res = await eventServices.getEvents(params);
    const { data } = res;
    return data;
  };

  const currentEventQuery = `limit=${LIMIT_BANNER}&page=${PAGE_DEFAULT}&isPublish=true`;

  const { data: dataFeaturedEvents, isLoading: isLoadingFeaturedEvents } =
    useQuery({
      queryKey: ["FeaturedEvents"],
      queryFn: () => getEvents(`${currentEventQuery}&isFeatured=true`),
      enabled: true,
    });

  const { data: dataLatestEvents, isLoading: isLoadingLatestEvents } = useQuery(
    {
      queryKey: ["LatestEvents"],
      queryFn: () => getEvents(currentEventQuery),
      enabled: true,
    }
  );

  const getCategories = async (): Promise<IApiResponse<ICategory[]>> => {
    let params = `limit=${LIMIT_CATEGORY}&page=${PAGE_DEFAULT}`;
    const res = await categoryServices.getCategories(params);
    const { data } = res;
    return data;
  };

  const { data: dataCategories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["Categories"],
    queryFn: () => getCategories(),
    enabled: true,
  });

  return {
    dataBanners,
    isLoadingBanners,
    dataFeaturedEvents,
    isLoadingFeaturedEvents,
    dataLatestEvents,
    isLoadingLatestEvents,
    dataCategories,
    isLoadingCategories,
  };
};

export default useHome;
