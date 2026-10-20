import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import useDebounce from "@/hooks/useDebounce";
import regionServices from "@/services/region.service";

interface UseRegionOptionsProps {
  provinceId?: string;
  enabled?: boolean;
}

const useRegionOptions = (props: UseRegionOptionsProps) => {
  const { provinceId, enabled = true } = props;

  const [provinceSearch, setProvinceSearch] = useState("");
  const [regencySearch, setRegencySearch] = useState("");

  const debounceProvince = useDebounce();
  const debounceRegency = useDebounce();

  useEffect(() => {
    setRegencySearch("");
  }, [provinceId]);

  const { data: provinceList, isPending: isPendingProvinces } = useQuery({
    queryKey: ["Region", "provinces"],
    queryFn: async () => {
      const res = await regionServices.getProvinces();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: regencyList, isPending: isPendingRegencies } = useQuery({
    queryKey: ["Region", "regencies", provinceId],
    queryFn: async () => {
      const res = await regionServices.getRegencies(Number(provinceId));
      return res.data.data[0]?.regencies ?? [];
    },
    enabled: Boolean(provinceId) && enabled,
    staleTime: 5 * 60 * 1000,
  });

  const filteredProvinces = useMemo(
    () =>
      (provinceList ?? []).filter(province =>
        province.name.toLowerCase().includes(provinceSearch)
      ),
    [provinceList, provinceSearch]
  );

  const filteredRegencies = useMemo(
    () =>
      (regencyList ?? []).filter(regency =>
        regency.name.toLowerCase().includes(regencySearch)
      ),
    [regencyList, regencySearch]
  );

  const handleProvinceSearch = (value: string) => {
    debounceProvince(() => setProvinceSearch(value.trim().toLowerCase()), 300);
  };

  const handleRegencySearch = (value: string) => {
    debounceRegency(() => setRegencySearch(value.trim().toLowerCase()), 300);
  };

  const handleProvinceOpen = (isOpen: boolean) => {
    if (isOpen) setProvinceSearch("");
  };

  const handleRegencyOpen = (isOpen: boolean) => {
    if (isOpen) setRegencySearch("");
  };

  const resetRegionSearch = () => {
    setProvinceSearch("");
    setRegencySearch("");
  };

  return {
    provinceList,
    regencyList,
    filteredProvinces,
    filteredRegencies,
    isPendingProvinces,
    isPendingRegencies,
    handleProvinceSearch,
    handleRegencySearch,
    handleProvinceOpen,
    handleRegencyOpen,
    resetRegionSearch,
  };
};

export default useRegionOptions;
