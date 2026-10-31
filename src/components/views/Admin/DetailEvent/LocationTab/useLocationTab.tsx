import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import useRegionOptions from "@/hooks/useRegionOptions";
import type { IEvent } from "@/types/Event";
import useDetailEvent from "../useDetailEvent";

const schema = yup.object({
  isOnline: yup.boolean().required(),
  venueName: yup.string().optional(),
  address: yup.string().optional(),
  province: yup.string().optional(),
  regency: yup.string().optional(),
});

type FormDataLocation = yup.InferType<typeof schema>;

interface UseLocationTabProps {
  dataEvent: IEvent;
}

const getLocationValues = (dataEvent: IEvent) => ({
  venueName: dataEvent.location?.venueName ?? "",
  address: dataEvent.location?.address ?? "",
  province: dataEvent.location?.province?.id ?? "",
  regency: dataEvent.location?.regency?.id ?? "",
});

const getDefaultValues = (dataEvent: IEvent): FormDataLocation => ({
  isOnline: dataEvent.isOnline ?? false,
  ...getLocationValues(dataEvent),
});

const useLocationTab = (props: UseLocationTabProps) => {
  const { dataEvent } = props;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormDataLocation>({
    resolver: yupResolver(schema),
    defaultValues: getDefaultValues(dataEvent),
  });

  const isOnline = watch("isOnline");
  const selectedProvinceId = watch("province");

  const {
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
  } = useRegionOptions({ provinceId: selectedProvinceId, enabled: !isOnline });

  const {
    mutateUpdateEvent,
    isPendingUpdateEvent,
    errorMessage,
  } = useDetailEvent();

  useEffect(() => {
    reset(getDefaultValues(dataEvent));
  }, [dataEvent, reset]);

  const handleToggleOnline = (value: boolean) => {
    setValue("isOnline", value, { shouldValidate: true, shouldDirty: true });

    if (value) {
      resetRegionSearch();
    }
  };

  const handleProvinceChange = (value: string) => {
    setValue("province", value, { shouldValidate: true, shouldDirty: true });
    setValue("regency", "", { shouldDirty: true });
  };

  const handleSaveLocation = (data: FormDataLocation) => {
    const existingLocation = dataEvent.location;
    const provinceItem = provinceList?.find(
      province => String(province.id) === data.province
    );
    const regencyItem = regencyList?.find(
      regency => String(regency.id) === data.regency
    );

    mutateUpdateEvent(
      {
        isOnline: data.isOnline,
        ...(data.isOnline
          ? {}
          : {
              location: {
                ...(data.venueName ? { venueName: data.venueName } : {}),
                ...(data.address ? { address: data.address } : {}),
                ...(data.province
                  ? {
                      province: {
                        id: data.province,
                        name:
                          provinceItem?.name ??
                          existingLocation?.province?.name ??
                          "",
                      },
                    }
                  : {}),
                ...(data.regency
                  ? {
                      regency: {
                        id: data.regency,
                        name:
                          regencyItem?.name ??
                          existingLocation?.regency?.name ??
                          "",
                      },
                    }
                  : {}),
              },
            }),
      },
      {
        onSuccess() {
          reset(
            data.isOnline
              ? { ...data, ...getLocationValues(dataEvent) }
              : data
          );
        },
      }
    );
  };

  return {
    control,
    handleSubmit,
    errors,
    isDirty,
    isOnline,
    selectedProvinceId,
    filteredProvinces,
    filteredRegencies,
    isPendingProvinces,
    isPendingRegencies,
    isPendingUpdateEvent,
    errorMessage,
    handleSaveLocation,
    handleToggleOnline,
    handleProvinceChange,
    handleProvinceSearch,
    handleRegencySearch,
    handleProvinceOpen,
    handleRegencyOpen,
  };
};

export default useLocationTab;
