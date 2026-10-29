import { LIMIT_LISTS } from "@/constants/list.constants";
import useChangeUrl from "@/hooks/useChangeUrl";
import { Divider, Pagination, Select, SelectItem } from "@heroui/react";

interface EventFooterProps {
  totalPages?: number;
}

const EventFooter = (props: EventFooterProps) => {
  const { totalPages = 1 } = props;
  const { currentLimit, currentPage, handleChangePage, handleChangeLimit } =
    useChangeUrl();
  return (
    <div className="flex-cols flex items-center justify-center gap-4 lg:flex-row lg:justify-between">
      <Select
        className="max-w-28"
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
      {totalPages > 1 && (
        <Pagination
          isCompact
          showControls
          color="danger"
          page={Number(currentPage)}
          total={totalPages}
          onChange={handleChangePage}
          loop
        />
      )}
    </div>
  );
};

export default EventFooter;
