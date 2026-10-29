import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import useDebounce from "@/hooks/useDebounce";
import categoryServices from "@/services/category.service";

const CATEGORY_FETCH_LIMIT = 100;

const useCategoryOptions = () => {
  const [categorySearch, setCategorySearch] = useState("");

  const debounceCategory = useDebounce();

  const {
    data: categoryList,
    isPending: isPendingCategories,
    isSuccess: isSuccessGetCategories,
  } = useQuery({
    queryKey: ["Category", "options"],
    queryFn: async () => {
      const res = await categoryServices.getCategories(
        `limit=${CATEGORY_FETCH_LIMIT}&page=1`
      );
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const filteredCategories = useMemo(
    () =>
      (categoryList ?? []).filter(category =>
        category.name.toLowerCase().includes(categorySearch)
      ),
    [categoryList, categorySearch]
  );

  const handleCategorySearch = (value: string) => {
    debounceCategory(() => setCategorySearch(value.trim().toLowerCase()), 300);
  };

  const handleCategoryOpen = (isOpen: boolean) => {
    if (isOpen) setCategorySearch("");
  };

  const resetCategorySearch = () => setCategorySearch("");

  return {
    categoryList,
    filteredCategories,
    isPendingCategories,
    isSuccessGetCategories,
    handleCategorySearch,
    handleCategoryOpen,
    resetCategorySearch,
  };
};

export default useCategoryOptions;
