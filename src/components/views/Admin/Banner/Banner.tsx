import Image from "next/image";
import { useRouter } from "next/router";
import { Key, ReactNode, useCallback, useEffect, useState } from "react";
import { Chip, useDisclosure } from "@heroui/react";

import DataTable from "@/components/ui/DataTable";
import DropDownAction from "@/components/commons/DropdownAction";

import useChangeUrl from "@/hooks/useChangeUrl";

import useBanner from "./useBanner";

import type { IBanner } from "@/types/Banner";
import { COLUMN_LISTS_BANNER } from "./Banner.constants";
import AddBannerModal from "./AddBannerModal";
import DeleteBannerModal from "./DeleteBannerModal";

const Banner = () => {
  const { push, isReady, query } = useRouter();
  const [selectedBannerId, setSelectedBannerId] = useState<string | null>(null);
  const { dataBanner, isLoadingBanner, isRefetchingBanner, refetchBanner } =
    useBanner();

  const selectedBanner =
    dataBanner?.data.find(banner => banner._id === selectedBannerId) ?? null;

  const addBannerModal = useDisclosure();
  const deleteBannerModal = useDisclosure();
  const { setUrl } = useChangeUrl();

  useEffect(() => {
    if (isReady) {
      setUrl();
    }
  }, [isReady]);

  const renderCell = useCallback(
    (banner: IBanner, columnKey: Key) => {
      const cellValue = banner[columnKey as keyof typeof banner];

      switch (columnKey) {
        case "imageUrl":
          return typeof cellValue === "string" && cellValue ? (
            <Image
              src={`${cellValue}`}
              alt="Image"
              width={300}
              height={100}
              className="h-15 w-15 rounded-md object-cover"
              // di atas buat ubah ukuran
            />
          ) : (
            <div className="bg-default-100 text-default-500 flex h-12 w-12 items-center justify-center rounded-md text-xs font-semibold uppercase">
              {String(banner.title ?? "?").slice(0, 2)}
            </div>
          );
        case "isShow":
          return (
            <Chip
              color={cellValue === true ? "success" : "warning"}
              size="sm"
              variant="flat"
            >
              {cellValue === true ? "Published" : "Not Published"}
            </Chip>
          );
        case "actions":
          return (
            <DropDownAction
              onPressButtonDetail={() => push(`/admin/banner/${banner._id}`)}
              onPressButtonDelete={() => {
                setSelectedBannerId(banner._id);
                deleteBannerModal.onOpen();
              }}
            />
          );
        default:
          return cellValue as ReactNode;
      }
    },
    [push, deleteBannerModal]
  );
  return (
    <section>
      {Object.keys(query).length > 0 && (
        <DataTable
          buttonTopContentLabel="Create Banner"
          columns={COLUMN_LISTS_BANNER}
          data={dataBanner?.data || []}
          emptyContent="Banner is empty"
          isLoading={isLoadingBanner || isRefetchingBanner}
          renderCell={renderCell}
          onClickButtonTopContent={addBannerModal.onOpen}
          totalPages={dataBanner?.meta?.totalPages}
        />
      )}
      <AddBannerModal refetchBanner={refetchBanner} {...addBannerModal} />

      <DeleteBannerModal
        {...deleteBannerModal}
        onClose={deleteBannerModal.onClose}
        refetchBanner={refetchBanner}
        selectedBanner={selectedBanner}
      />
    </section>
  );
};

export default Banner;
