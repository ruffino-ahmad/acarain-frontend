import { DELAY, LIMIT_DEFAULT, PAGE_DEFAULT } from "@/constants/list.constants";
import { useRouter } from "next/router";
import useDebounce from "./useDebounce";
import { ChangeEvent } from "react";

const useChangeUrl = () => {
  const router = useRouter();
  const debounce = useDebounce();

  const currentLimit = router.query.limit || LIMIT_DEFAULT;
  const currentPage = router.query.page || PAGE_DEFAULT;
  const currentSearch = router.query.search || "";
  const currentCategory = router.query.category;
  const currentisOnline = router.query.isOnline;
  const currentisFeatured = router.query.isFeatured;
  const currentisPublished = router.query.isPublished;

  const setUrl = () => {
    router.replace({
      query: {
        limit: currentLimit,
        page: currentPage,
        search: currentSearch,
      },
    });
  };

  const setUrlExplore = () => {
    router.replace({
      query: {
        limit: currentLimit,
        page: currentPage,
        search: currentSearch,
        category: currentCategory ?? "",
        isOnline: currentisOnline ?? "",
        isFeatured: currentisFeatured ?? "",
        isPublished: currentisPublished ?? "",
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

  const handleChangeCategory = (category: string) => {
    router.push({
      query: {
        ...router.query,
        category,
        page: PAGE_DEFAULT,
      },
    });
  };

  const handleChangeisOnline = (isOnline: string) => {
    router.push({
      query: {
        ...router.query,
        isOnline,
        page: PAGE_DEFAULT,
      },
    });
  };

  const handleChangeisFeatured = (isFeatured: string) => {
    router.push({
      query: {
        ...router.query,
        isFeatured,
        page: PAGE_DEFAULT,
      },
    });
  };

  const handleChangeisPublished = (isPublished: string) => {
    router.push({
      query: {
        ...router.query,
        isPublished,
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
    setUrl,
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleSearch,
    handleClearSearch,

    setUrlExplore,
    currentCategory,
    currentisOnline,
    currentisFeatured,
    currentisPublished,
    handleChangeCategory,
    handleChangeisOnline,
    handleChangeisFeatured,
    handleChangeisPublished,
  };
};

export default useChangeUrl;
