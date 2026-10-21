import DataTable from "@/components/ui/DataTable";
import {
  useDisclosure,
} from "@heroui/react";
import Image from "next/image";
import {  useRouter } from "next/router";
import { Key, ReactNode, useCallback, useEffect, useState } from "react";
import { COLUMN_LISTS_CATEGORY } from "./Category.constants";
import useCategory from "./useCategory";
import type { ICategory } from "@/types/Category";
import AddCategoryModal from "./AddCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import useChangeUrl from "@/hooks/useChangeUrl";
import DropDownAction from "@/components/commons/DropdownAction";

const Category = () => {
  const { push, isReady, query } = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const {
    dataCategory,
    isLoadingCategory,
    isRefetchingCategory,
    refetchCategory,
  } = useCategory();

  const selectedCategory =
    dataCategory?.data.find(category => category._id === selectedCategoryId) ??
    null;

  const addCategoryModal = useDisclosure();
  const deleteCategoryModal = useDisclosure();
  const { setUrl } = useChangeUrl();

  useEffect(() => {
    if (isReady) {
      setUrl();
    }
  }, [isReady]);

  const renderCell = useCallback(
    (category: ICategory, columnKey: Key) => {
      const cellValue = category[columnKey as keyof typeof category];

      switch (columnKey) {
        case "iconUrl":
          return typeof cellValue === "string" && cellValue ? (
            <Image
              src={`${cellValue}`}
              alt="Icon"
              width={100}
              height={100}
              className="h-15 w-15 rounded-md object-cover"
              // di atas buat ubah ukuran
            />
          ) : (
            <div className="bg-default-100 text-default-500 flex h-12 w-12 items-center justify-center rounded-md text-xs font-semibold uppercase">
              {String(category.name ?? "?").slice(0, 2)}
            </div>
          );
        case "actions":
          return (
            <DropDownAction
              onPressButtonDetail={() =>
                push(`/admin/category/${category._id}`)
              }
              onPressButtonDelete={() => {
                setSelectedCategoryId(category._id);
                deleteCategoryModal.onOpen();
              }}
            />
          );
        default:
          return cellValue as ReactNode;
      }
    },
    [push, deleteCategoryModal]
  );
  return (
    <section>
      {Object.keys(query).length > 0 && (
        <DataTable
          buttonTopContentLabel="Create Category"
          columns={COLUMN_LISTS_CATEGORY}
          data={dataCategory?.data || []}
          emptyContent="Category is empty"
          isLoading={isLoadingCategory || isRefetchingCategory}
          renderCell={renderCell}
          onClickButtonTopContent={addCategoryModal.onOpen}
          totalPages={dataCategory?.meta?.totalPages}
        />
      )}
      <AddCategoryModal
        refetchCategory={refetchCategory}
        {...addCategoryModal}
      />

      <DeleteCategoryModal
        {...deleteCategoryModal}
        onClose={deleteCategoryModal.onClose}
        refetchCategory={refetchCategory}
        selectedCategory={selectedCategory}
      />
    </section>
  );
};

export default Category;
