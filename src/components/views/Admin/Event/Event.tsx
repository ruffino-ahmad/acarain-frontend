import DataTable from "@/components/ui/DataTable";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Key, ReactNode, useCallback, useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";

import useChangeUrl from "@/hooks/useChangeUrl";
import type { IEvent } from "@/types/Event";
import { formatDateTime } from "@/utils/date";
import { COLUMN_LISTS_EVENT } from "./Event.constants";
import AddEventModal from "./AddEventModal";
import DeleteEventModal from "./DeleteEventModal";
import useEvent from "./useEvent";
import DropDownAction from "@/components/commons/DropdownAction";

const Event = () => {
  const { push, isReady, query } = useRouter();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const { dataEvents, isLoadingEvents, isRefetchingEvents, refetchEvent } =
    useEvent();

  const selectedEvent =
    dataEvents?.data.find(event => event._id === selectedEventId) ?? null;

  const { setUrl } = useChangeUrl();

  const addEventModal = useDisclosure();
  const deleteEventModal = useDisclosure();

  useEffect(() => {
    if (isReady) {
      setUrl();
    }
  }, [isReady]);

  const renderCell = useCallback(
    (event: IEvent, columnKey: Key) => {
      const cellValue = event[columnKey as keyof typeof event];

      switch (columnKey) {
        case "bannerUrl":
          return typeof cellValue === "string" && cellValue ? (
            <Image
              src={cellValue}
              alt="Banner"
              width={144}
              height={81}
              className="aspect-video w-36 rounded-lg object-cover"
            />
          ) : (
            <div className="bg-default-100 text-default-500 flex aspect-video w-36 items-center justify-center rounded-lg text-xs font-semibold uppercase">
              {String(event.name ?? "?").slice(0, 2)}
            </div>
          );
        case "startDate":
        case "endDate":
          return formatDateTime(cellValue as string);
        case "isPublish":
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
              onPressButtonDetail={() => push(`/admin/event/${event._id}`)}
              onPressButtonDelete={() => {
                setSelectedEventId(event._id);
                deleteEventModal.onOpen();
              }}
            />
          );
        default:
          return cellValue as ReactNode;
      }
    },
    [push, deleteEventModal]
  );

  return (
    <section>
      {Object.keys(query).length > 0 && (
        <DataTable
          buttonTopContentLabel="Create Event"
          columns={COLUMN_LISTS_EVENT}
          data={dataEvents?.data || []}
          emptyContent="Event is empty"
          isLoading={isLoadingEvents || isRefetchingEvents}
          renderCell={renderCell}
          onClickButtonTopContent={addEventModal.onOpen}
          totalPages={dataEvents?.meta?.totalPages}
        />
      )}
      <AddEventModal refetchEvent={refetchEvent} {...addEventModal} />

      <DeleteEventModal
        {...deleteEventModal}
        onClose={deleteEventModal.onClose}
        refetchEvent={refetchEvent}
        selectedEvent={selectedEvent}
      />
    </section>
  );
};

export default Event;
