import Image from "next/image";
import { useRouter } from "next/router";
import { Key, ReactNode, useCallback, useEffect, useState } from "react";
import { Chip, useDisclosure } from "@heroui/react";

import DataTable from "@/components/ui/DataTable";
import DropDownAction from "@/components/commons/DropdownAction";

import useChangeUrl from "@/hooks/useChangeUrl";

import { COLUMN_LISTS_TRANSACTION } from "./Transaction.constants";
import useTransaction from "./useTransaction";
import { IOrder } from "@/types/Order";
import convertToRupiah from "@/utils/currency";

const Transaction = () => {
  const { push, isReady, query } = useRouter();
  const [selectedBannerId, setSelectedBannerId] = useState<string | null>(null);
  const {
    dataTransactions,
    isLoadingTransactions,
    isRefetchingTransactions,
    refetchTransactions,
  } = useTransaction();

  const selectedTransaction =
    dataTransactions?.data.find(
      transaction => transaction._id === selectedBannerId
    ) ?? null;

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    if (isReady) {
      setUrl();
    }
  }, [isReady]);

  const renderCell = useCallback(
    (transaction: IOrder, columnKey: Key) => {
      const cellValue = transaction[columnKey as keyof typeof transaction];

      switch (columnKey) {
        case "status":
          return (
            <Chip
              color={cellValue ? "success" : "warning"}
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
                push(`/member/transaction/${transaction._id}`)
              }
              hideButtonDelete
            />
          );
        default:
          return cellValue as ReactNode;
      }
    },
    [push]
  );
  return (
    <section>
      {Object.keys(query).length > 0 && (
        <DataTable
          buttonTopContentLabel="Create Transaction"
          columns={COLUMN_LISTS_TRANSACTION}
          data={dataTransactions?.data || []}
          emptyContent="Transaction is empty"
          isLoading={isLoadingTransactions || isRefetchingTransactions}
          renderCell={renderCell}
          totalPages={dataTransactions?.meta?.totalPages}
        />
      )}
    </section>
  );
};

export default Transaction;
