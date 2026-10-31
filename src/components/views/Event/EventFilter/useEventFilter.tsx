import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import useCategoryOptions from "@/hooks/useCategoryOptions";
import useChangeUrl from "@/hooks/useChangeUrl";

const ONLINE_FILTER_KEYS = ["all", "online", "offline"] as const;
const FEATURED_FILTER_KEYS = ["all", "featured", "not-featured"] as const;

type OnlineFilter = (typeof ONLINE_FILTER_KEYS)[number];
type FeaturedFilter = (typeof FEATURED_FILTER_KEYS)[number];

// "all" dipetakan ke string kosong agar parameter tidak dikirim ke API,
// sehingga online & offline (atau featured & non-featured) tampil bersamaan.
const ONLINE_FILTER_QUERY: Record<OnlineFilter, string> = {
  all: "",
  online: "true",
  offline: "false",
};

const FEATURED_FILTER_QUERY: Record<FeaturedFilter, string> = {
  all: "",
  featured: "true",
  "not-featured": "false",
};

const toOnlineFilter = (value?: string | string[]): OnlineFilter =>
  value === "true" ? "online" : value === "false" ? "offline" : "all";

const toFeaturedFilter = (value?: string | string[]): FeaturedFilter =>
  value === "true" ? "featured" : value === "false" ? "not-featured" : "all";

const schema = yup.object({
  category: yup.string().optional(),
  isOnline: yup
    .string()
    .oneOf([...ONLINE_FILTER_KEYS])
    .required(),
  isFeatured: yup
    .string()
    .oneOf([...FEATURED_FILTER_KEYS])
    .required(),
});

type FormDataEventFilter = yup.InferType<typeof schema>;

const useEventFilter = () => {
  const {
    currentCategory,
    currentisOnline,
    currentisFeatured,
    handleChangeCategory,
    handleChangeisOnline,
    handleChangeisFeatured,
  } = useChangeUrl();

  const { control, setValue } = useForm<FormDataEventFilter>({
    resolver: yupResolver(schema),
    defaultValues: {
      category: (currentCategory as string) || "",
      isOnline: toOnlineFilter(currentisOnline),
      isFeatured: toFeaturedFilter(currentisFeatured),
    },
  });

  const {
    filteredCategories,
    isPendingCategories,
    isSuccessGetCategories,
    handleCategorySearch,
    handleCategoryOpen,
  } = useCategoryOptions();

  useEffect(() => {
    setValue("category", (currentCategory as string) || "");
  }, [currentCategory, isSuccessGetCategories, setValue]);

  useEffect(() => {
    setValue("isOnline", toOnlineFilter(currentisOnline));
  }, [currentisOnline, setValue]);

  useEffect(() => {
    setValue("isFeatured", toFeaturedFilter(currentisFeatured));
  }, [currentisFeatured, setValue]);

  const handleCategoryChange = (value: string) => {
    handleChangeCategory(value);
  };

  const handleChangeOnline = (value: string) => {
    const next = (value in ONLINE_FILTER_QUERY ? value : "all") as OnlineFilter;

    setValue("isOnline", next, { shouldValidate: true });
    handleChangeisOnline(ONLINE_FILTER_QUERY[next]);
  };

  const handleChangeFeatured = (value: string) => {
    const next = (
      value in FEATURED_FILTER_QUERY ? value : "all"
    ) as FeaturedFilter;

    setValue("isFeatured", next, { shouldValidate: true });
    handleChangeisFeatured(FEATURED_FILTER_QUERY[next]);
  };

  return {
    control,
    filteredCategories,
    isPendingCategories,
    isSuccessGetCategories,
    handleCategorySearch,
    handleCategoryOpen,
    handleCategoryChange,
    handleChangeOnline,
    handleChangeFeatured,
  };
};

export default useEventFilter;
