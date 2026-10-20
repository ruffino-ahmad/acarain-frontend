import DropDownAction from "@/components/commons/DropdownAction";
import DataTable from "@/components/ui/DataTable";
import { ITicket } from "@/types/Ticket";
import convertToRupiah from "@/utils/currency";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  useDisclosure,
} from "@heroui/react";
import { Key, ReactNode, useCallback } from "react";
import { COLUMN_LISTS_TICKET } from "./TicketTab.constants";
import useTicketTab from "./useTicketTab";

const TicketTab = () => {
  const { dataTicket, isLoadingTicket, isRefetchingTicket } =
    useTicketTab();
  const addTickeyModal = useDisclosure();
  const deleteTicketModal = useDisclosure();
  const updateTicketModal = useDisclosure();

  const renderCell = useCallback((ticket: ITicket, columnKey: Key) => {
    const cellValue = ticket[columnKey as keyof typeof ticket];

    switch (columnKey) {
      case "price":
        return `${convertToRupiah(Number(cellValue))}`;
      case "actions":
        return (
          <DropDownAction
            onPressButtonDetail={() => {
              updateTicketModal.onOpen();
            }}
            onPressButtonDelete={() => {
              deleteTicketModal.onOpen();
            }}
          />
        );
      default:
        return cellValue as ReactNode;
    }
  }, []);
  return (
    <Card className="w-full p-4">
      <CardHeader className="items-center justify-between">
        <div className="flex flex-col items-center">
          <h1 className="w-full text-xl font-bold">Event Tickets</h1>
          <p className="text-default-400 text-small w-full">
            Manage tickets for the event
          </p>
        </div>
        <Button color="danger">Add New Ticket</Button>
      </CardHeader>
      <CardBody className="pt-0">
        <DataTable
          columns={COLUMN_LISTS_TICKET}
          data={dataTicket || []}
          emptyContent="Ticket is empty"
          isLoading={isLoadingTicket || isRefetchingTicket}
          renderCell={renderCell}
          totalPages={1}
          showSearch={false}
          showLimit={false}
        />
      </CardBody>
    </Card>
  );
};

export default TicketTab;
