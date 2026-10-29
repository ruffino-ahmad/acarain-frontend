import {
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
  Skeleton,
} from "@heroui/react";
import { Controller } from "react-hook-form";
import type { ICategory } from "@/types/Category";

import useEventFilter from "./useEventFilter";

const EventFilter = () => {
  const {
    control,
    filteredCategories,
    isPendingCategories,
    handleCategorySearch,
    handleCategoryOpen,
    handleCategoryChange,
    handleChangeOnline,
    handleChangeFeatured,
    isSuccessGetCategories,
  } = useEventFilter();

  // Skeleton ditampilkan untuk semua field sekaligus agar tinggi filter tidak
  // "melompat" saat data kategori selesai dimuat.
  const isLoadingFilters = !isSuccessGetCategories;

  return (
    <div className="h-fit w-full rounded-xl border p-4 lg:sticky lg:top-20 lg:w-80">
      <h4 className="text-xl font-semibold">Filter</h4>
      <div className="mt-4 grid grid-cols-2 gap-4 lg:flex lg:flex-col">
        {isLoadingFilters ? (
          <>
            <Skeleton className="col-span-2 h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </>
        ) : (
          <>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  className="col-span-2"
                  label="Category"
                  variant="bordered"
                  placeholder="Search category"
                  items={filteredCategories}
                  defaultFilter={() => true}
                  selectedKey={field.value || null}
                  onSelectionChange={key => {
                    const value = String(key ?? "");
                    field.onChange(value);
                    handleCategoryChange(value);
                  }}
                  onInputChange={handleCategorySearch}
                  onOpenChange={handleCategoryOpen}
                  onClear={() => {
                    field.onChange("");
                    handleCategoryChange("");
                  }}
                  isClearable
                  isLoading={isPendingCategories}
                >
                  {(category: ICategory) => (
                    <AutocompleteItem
                      key={category._id}
                      textValue={category.name}
                    >
                      {category.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              )}
            />
            <Controller
              name="isOnline"
              control={control}
              render={({ field }) => (
                <Select
                  label="Event Type"
                  variant="bordered"
                  selectionMode="single"
                  disallowEmptySelection
                  selectedKeys={[field.value]}
                  onChange={e => handleChangeOnline(e.target.value)}
                >
                  <SelectItem key="all">All</SelectItem>
                  <SelectItem key="online">Online</SelectItem>
                  <SelectItem key="offline">Offline</SelectItem>
                </Select>
              )}
            />
            <Controller
              name="isFeatured"
              control={control}
              render={({ field }) => (
                <Select
                  label="Featured"
                  variant="bordered"
                  selectionMode="single"
                  disallowEmptySelection
                  selectedKeys={[field.value]}
                  onChange={e => handleChangeFeatured(e.target.value)}
                >
                  <SelectItem key="all">All</SelectItem>
                  <SelectItem key="featured">Featured</SelectItem>
                  <SelectItem key="not-featured">Not Featured</SelectItem>
                </Select>
              )}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EventFilter;
