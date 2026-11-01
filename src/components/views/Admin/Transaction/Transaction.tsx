import { useRouter } from "next/router";
import { Key, ReactNode, useCallback, useEffect, useState } from "react";
import { Chip, useDisclosure } from "@heroui/react";

import DataTable from "@/components/ui/DataTable";
import DropDownAction from "@/components/commons/DropdownAction";

import useChangeUrl from "@/hooks/useChangeUrl";

import { COLUMN_LISTS_TRANSACTION } from "./Transaction.constants";
import useTransaction from "./useTransaction";
import DeleteTransactionModal from "./DeleteTransactionModal";
import { IOrder } from "@/types/Order";
import convertToRupiah from "@/utils/currency";

const Transaction = () => {
  const { push, isReady, query } = useRouter();
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const {
    dataTransactions,
    isLoadingTransactions,
    isRefetchingTransactions,
    refetchTransactions,
  } = useTransaction();

  const deleteTransactionModal = useDisclosure();

  const selectedTransaction =
    dataTransactions?.data.find(
      transaction => transaction._id === selectedTransactionId
    ) ?? null;

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    if (isReady) {
      setUrl();
    }
  }, [isReady]);

  const handleCloseDeleteModal = () => {
    deleteTransactionModal.onClose();
    setSelectedTransactionId(null);
  };

  const renderCell = useCallback(
    (transaction: IOrder, columnKey: Key) => {
      const cellValue = transaction[columnKey as keyof typeof transaction];

      switch (columnKey) {
        case "createdBy": {
          const createdBy = transaction.createdBy;

          return typeof createdBy === "string"
            ? createdBy
            : (createdBy?.fullname ?? "-");
        }
        case "status":
          return (
            <Chip
              color={
                cellValue === "completed"
                  ? "success"
                  : cellValue === "cancelled"
                    ? "danger"
                    : "warning"
              }
              size="sm"
              variant="flat"
            >
              {cellValue as ReactNode}
            </Chip>
          );
        case "total":
          return convertToRupiah(Number(cellValue));
        case "actions":
          return (
            <DropDownAction
              onPressButtonDetail={() =>
                push(`/admin/transaction/${transaction.orderId}`)
              }
              onPressButtonDelete={() => {
                setSelectedTransactionId(transaction._id);
                deleteTransactionModal.onOpen();
              }}
            />
          );
        default:
          return cellValue as ReactNode;
      }
    },
    [deleteTransactionModal, push]
  );

  return (
    <section>
      {Object.keys(query).length > 0 && (
        <DataTable
          columns={COLUMN_LISTS_TRANSACTION}
          data={dataTransactions?.data || []}
          emptyContent="Transaction is empty"
          isLoading={isLoadingTransactions || isRefetchingTransactions}
          renderCell={renderCell}
          totalPages={dataTransactions?.meta?.totalPages}
        />
      )}
      <DeleteTransactionModal
        {...deleteTransactionModal}
        onClose={handleCloseDeleteModal}
        refetchTransaction={refetchTransactions}
        selectedTransaction={selectedTransaction}
      />
    </section>
  );
};

export default Transaction;
