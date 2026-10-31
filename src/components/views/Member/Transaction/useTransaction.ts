import useChangeUrl from "@/hooks/useChangeUrl";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import orderServices from "@/services/order.service";

import type { IApiResponse } from "@/types/Pagination";
import type { IOrder } from "@/types/Order";

const useTransaction = () => {
  const router = useRouter();
  const { currentLimit, currentPage, currentSearch } = useChangeUrl();

  const getMemberTransactions = async (): Promise<IApiResponse<IOrder[]>> => {
    const params = `limit=${currentLimit}&page=${currentPage}&search=${currentSearch}`;
    const res = await orderServices.getMemberOrder(params);
    const { data } = res;
    return data;
  };

  const {
    data: dataTransactions,
    isLoading: isLoadingTransactions,
    isRefetching: isRefetchingTransactions,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ["MemberTransactions", currentPage, currentLimit, currentSearch],
    queryFn: () => getMemberTransactions(),
    enabled: router.isReady && !!currentPage && !!currentLimit,
  });

  return {
    dataTransactions,
    isLoadingTransactions,
    isRefetchingTransactions,
    refetchTransactions,
  };
};

export default useTransaction;
