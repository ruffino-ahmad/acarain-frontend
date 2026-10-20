import { LIMIT_LISTS } from "@/constants/list.constants";
import useChangeUrl from "@/hooks/useChangeUrl";
import { cn } from "@/utils/cn";
import {
  Button,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Key, ReactNode, useMemo } from "react";
import { CiSearch } from "react-icons/ci";

interface DataTableProps<T> {
  columns: Record<string, unknown>[];
  data: T[];
  renderCell: (item: T, columnKey: Key) => ReactNode;
  buttonTopContentLabel?: string;
  onClickButtonTopContent?: () => void;
  totalPages?: number;
  emptyContent: string;
  isLoading?: boolean;
}

const DataTable = <T,>(props: DataTableProps<T>) => {
  const {
    currentLimit,
    currentPage,
    handleChangePage,
    handleChangeLimit,
    handleSearch,
    handleClearSearch,
  } = useChangeUrl();

  const {
    columns,
    data,
    emptyContent,
    renderCell,
    buttonTopContentLabel,
    onClickButtonTopContent,
    totalPages,
    isLoading,
  } = props;
  const resolvedTotalPages = totalPages ?? 0;

  const TopContent = useMemo(() => {
    return (
      <div className="flex flex-col-reverse items-start justify-between gap-y-4 lg:flex-row lg:items-center">
        <Input
          isClearable
          className="w-full sm:max-w-[24%]"
          placeholder="Search by name"
          startContent={<CiSearch />}
          onClear={handleClearSearch}
          onChange={handleSearch}
        />
        {buttonTopContentLabel && (
          <Button color="danger" onPress={onClickButtonTopContent}>
            {buttonTopContentLabel}
          </Button>
        )}
      </div>
    );
  }, [
    buttonTopContentLabel,
    handleSearch,
    handleClearSearch,
    onClickButtonTopContent,
  ]);

  const BottomContent = useMemo(() => {
    return (
      <div className="flex items-center justify-center lg:justify-between">
        <Select
          className="hidden max-w-36 lg:block"
          size="md"
          selectedKeys={[`${currentLimit}`]}
          selectionMode="single"
          onChange={handleChangeLimit}
          startContent={<p className="text-small">Show:</p>}
          disallowEmptySelection
        >
          {LIMIT_LISTS.map(item => (
            <SelectItem key={String(item.value)}>{item.label}</SelectItem>
          ))}
        </Select>
        {resolvedTotalPages > 1 && (
          <Pagination
            isCompact
            showControls
            color="danger"
            page={Number(currentPage)}
            total={resolvedTotalPages}
            onChange={handleChangePage}
            loop
          />
        )}
      </div>
    );
  }, [
    currentLimit,
    currentPage,
    resolvedTotalPages,
    handleChangeLimit,
    handleChangePage,
  ]);
  return (
    <Table
      topContent={TopContent}
      topContentPlacement="outside"
      bottomContent={BottomContent}
      bottomContentPlacement="outside"
      classNames={{
        base: "max-w-full",
        wrapper: cn({ "overflow-x-hidden": isLoading }),
        loadingWrapper: "z-10",
      }}
    >
      <TableHeader columns={columns}>
        {column => (
          <TableColumn key={column.uid as Key}>
            {column.name as string}
          </TableColumn>
        )}
      </TableHeader>

      <TableBody
        items={data}
        emptyContent={emptyContent}
        isLoading={isLoading}
        loadingContent={
          <div className="bg-foreground-700/30 flex h-full w-full items-center justify-center backdrop-blur-sm">
            <Spinner color="danger" />
          </div>
        }
      >
        {item => (
          <TableRow key={String((item as Record<string, unknown>)._id)}>
            {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DataTable;
