import { DELAY, LIMIT_DEFAULT, PAGE_DEFAULT } from "@/constants/list.constants";
import { useRouter } from "next/router";
import useDebounce from "./useDebounce";
import { ChangeEvent } from "react";
import { set } from "react-hook-form";

const useChangeUrl = () => {
  const router = useRouter();
  const debounce = useDebounce();

  const currentLimit = router.query.limit || LIMIT_DEFAULT;
  const currentPage = router.query.page || PAGE_DEFAULT;
  const currentSearch = router.query.search || "";

  const setUrl = () => {
    router.replace({
      query: {
        limit: currentLimit,
        page: currentPage,
        search: currentSearch,
      },
    });
  };

  const handleChangePage = (page: number) => {
    router.push({
      query: {
        ...router.query,
        page,
      },
    });
  };

  const handleChangeLimit = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedLimit = e.target.value;
    router.push({
      query: {
        ...router.query,
        limit: selectedLimit,
        page: PAGE_DEFAULT,
      },
    });
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    debounce(() => {
      const search = e.target.value;
      router.push({
        query: {
          ...router.query,
          search,
          page: PAGE_DEFAULT,
        },
      });
    }, DELAY);
  };

  const handleClearSearch = () => {
    router.push({
      query: {
        ...router.query,
        search: "",
        page: PAGE_DEFAULT,
      },
    });
  };
  return {
    currentPage,
    currentLimit,
    currentSearch,

    setUrl,
    handleChangePage,
    handleChangeLimit,
    handleSearch,
    handleClearSearch,
  };
};

export default useChangeUrl;
