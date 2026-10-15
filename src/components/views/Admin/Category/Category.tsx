import DataTable from "@/components/ui/DataTable";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import Image from "next/image";
import { Router, useRouter } from "next/router";
import { Key, ReactNode, useCallback, useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { COLUMN_LISTS_CATEGORY } from "./Category.constant";
import useCategory from "./useCategory";
import type { ICategory } from "@/types/Category";
import AddCategoryModal from "./AddCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";

const Category = () => {
  const { push, isReady, query } = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const {
    setURL,
    dataCategory,
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
    handleClearSearch,
    isLoadingCategory,
    isRefetchingCategory,
    refetchCategory,
  } = useCategory();

  const addCategoryModal = useDisclosure();
  const deleteCategoryModal = useDisclosure();

  useEffect(() => {
    if (isReady) {
      setURL();
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
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <CiMenuKebab className="text-default-700" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="detail-category-button"
                  onPress={() => push(`/admin/category/${category._id}`)}
                >
                  Detail Category
                </DropdownItem>
                <DropdownItem
                  key="delete-category"
                  className="text-danger-500"
                  onPress={() => {
                    setSelectedCategory(category);
                    deleteCategoryModal.onOpen();
                  }}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
          currentPage={Number(currentPage)}
          data={dataCategory?.data || []}
          emptyContent="Category is empty"
          isLoading={isLoadingCategory || isRefetchingCategory}
          limit={String(currentLimit)}
          onChangeLimit={handleChangeLimit}
          onChangePage={handleChangePage}
          onChangeSearch={handleChangeSearch}
          onClearSearch={handleClearSearch}
          renderCell={renderCell}
          onClickButtonTopContent={addCategoryModal.onOpen}
          totalPages={dataCategory?.pagination?.totalPages}
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
