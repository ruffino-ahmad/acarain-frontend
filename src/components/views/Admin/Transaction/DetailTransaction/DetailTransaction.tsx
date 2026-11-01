import InlineErrorAlert from "@/components/ui/InlineErrorAlert";
import type { IOrder } from "@/types/Order";
import { cn } from "@/utils/cn";
import convertToRupiah from "@/utils/currency";
import { convertTime } from "@/utils/date";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { useRouter } from "next/router";
import { QRCodeSVG } from "qrcode.react";
import { Key, ReactNode, useState } from "react";
import type { IconType } from "react-icons";
import {
  LuBan,
  LuCalendarClock,
  LuCalendarDays,
  LuCircleCheck,
  LuEllipsisVertical,
  LuFileText,
  LuMapPin,
  LuRotateCcw,
  LuShoppingBag,
  LuTicket,
  LuTrash2,
  LuUserRound,
  LuWallet,
  LuZap,
} from "react-icons/lu";

import DeleteTransactionModal from "../DeleteTransactionModal";
import {
  STATUS_ACTION_META,
  STATUS_META,
} from "./DetailTransaction.constants";
import useDetailTransaction, { OrderStatusAction } from "./useDetailTransaction";

interface StatusBadgeProps {
  status: IOrder["status"];
}

const StatusBadge = (props: StatusBadgeProps) => {
  const { status } = props;
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        meta.badgeClassName
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      {meta.label}
    </span>
  );
};

interface StatusNoticeProps {
  status: IOrder["status"];
}

const StatusNotice = (props: StatusNoticeProps) => {
  const { status } = props;
  const meta = STATUS_META[status];
  const Icon = meta.noticeIcon;

  return (
    <div
      role="status"
      className={cn(
        "flex w-full items-start gap-2 rounded-lg border px-3 py-2.5 text-sm lg:w-auto lg:max-w-md",
        meta.noticeClassName
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{meta.message}</span>
    </div>
  );
};

interface InfoItemProps {
  icon: IconType;
  label: string;
  emphasis?: boolean;
  children: ReactNode;
}

const InfoItem = (props: InfoItemProps) => {
  const { icon: Icon, label, emphasis = false, children } = props;

  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="size-[18px]" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
          {label}
        </p>
        <div
          className={cn(
            "mt-0.5 text-sm break-words text-slate-700",
            emphasis && "font-semibold text-slate-900"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const DetailTransaction = () => {
  const { push } = useRouter();
  const {
    id,
    dataOrder,
    dataEvent,
    dataTicket,
    isLoadingOrder,
    mutateUpdateStatus,
    isPendingUpdateStatus,
    errorMessage,
    clearError,
    removeOrder,
  } = useDetailTransaction();

  const deleteTransactionModal = useDisclosure();
  const updateStatusModal = useDisclosure();
  const [nextStatus, setNextStatus] = useState<OrderStatusAction | null>(null);

  if (isLoadingOrder) {
    return (
      <div className="flex justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <Spinner label="Loading transaction..." color="default" />
      </div>
    );
  }

  if (!dataOrder || !id) {
    return null;
  }

  const createdBy = dataOrder.createdBy;
  const customer =
    createdBy && typeof createdBy !== "string" ? createdBy : null;

  const handleOpenStatusModal = (status: OrderStatusAction) => {
    clearError();
    setNextStatus(status);
    updateStatusModal.onOpen();
  };

  const handleCloseStatusModal = () => {
    if (isPendingUpdateStatus) return;

    clearError();
    setNextStatus(null);
    updateStatusModal.onClose();
  };

  const handleConfirmStatus = () => {
    if (!nextStatus) return;

    mutateUpdateStatus(nextStatus, {
      onSuccess: () => {
        setNextStatus(null);
        updateStatusModal.onClose();
      },
    });
  };

  const handleAfterDelete = () => {
    removeOrder();
    push("/admin/transaction");
  };

  const handleDropdownAction = (key: Key) => {
    if (key === "delete-order") {
      deleteTransactionModal.onOpen();
    }
  };

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <LuShoppingBag className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Order Information
              </h1>
              <p className="text-sm text-slate-500">
                Detail of the selected transaction
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <StatusBadge status={dataOrder.status} />
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="light"
                  aria-label="Order actions"
                  className="text-slate-500"
                >
                  <LuEllipsisVertical className="size-5" aria-hidden="true" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Order actions"
                onAction={handleDropdownAction}
              >
                <DropdownItem
                  key="delete-order"
                  color="danger"
                  className="text-danger"
                  startContent={
                    <LuTrash2 className="size-4" aria-hidden="true" />
                  }
                >
                  Delete Order
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </header>

        {/* Order information */}
        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem icon={LuFileText} label="Order ID" emphasis>
              <span className="break-all">{dataOrder.orderId}</span>
            </InfoItem>
            <InfoItem icon={LuUserRound} label="Customer">
              {customer ? (
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium text-slate-900">
                    {customer.fullname}
                  </span>
                  <span className="truncate text-xs text-slate-500">
                    {customer.email}
                  </span>
                </div>
              ) : (
                "-"
              )}
            </InfoItem>
            <InfoItem icon={LuCircleCheck} label="Status">
              <span className="font-medium text-slate-900">
                {STATUS_META[dataOrder.status].label}
              </span>
            </InfoItem>
            <InfoItem icon={LuZap} label="Event">
              {dataEvent?.name ?? "-"}
            </InfoItem>
            <InfoItem icon={LuTicket} label="Ticket">
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium text-slate-900">
                  {dataTicket?.name ?? "-"}
                </span>
                <span className="text-xs text-slate-500">
                  {`${convertToRupiah(Number(dataTicket?.price))} × ${
                    dataOrder.quantity
                  }`}
                </span>
              </div>
            </InfoItem>
            <InfoItem icon={LuWallet} label="Total" emphasis>
              {convertToRupiah(Number(dataOrder.total))}
            </InfoItem>
            <InfoItem icon={LuCalendarDays} label="Event Date">
              {dataEvent
                ? `${convertTime(dataEvent.startDate)} - ${convertTime(
                    dataEvent.endDate
                  )}`
                : "-"}
            </InfoItem>
            <InfoItem icon={LuMapPin} label="Location">
              {dataEvent
                ? dataEvent.isOnline
                  ? "Online"
                  : dataEvent.location?.venueName || "Offline"
                : "-"}
            </InfoItem>
            <InfoItem icon={LuCalendarClock} label="Ordered At">
              {convertTime(dataOrder.createdAt)}
            </InfoItem>
          </div>

          {/* Vouchers */}
          {dataOrder.status === "completed" && (
            <div className="mt-6 border-t border-slate-200 pt-6">
              <h2 className="mb-4 text-xs font-medium tracking-wide text-slate-500 uppercase">
                Vouchers
              </h2>
              {dataOrder.vouchers && dataOrder.vouchers.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {dataOrder.vouchers.map(voucher => (
                    <div
                      key={voucher.voucherId}
                      className="flex min-w-0 items-center gap-4 rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <QRCodeSVG
                        value={voucher.voucherId}
                        size={96}
                        className="shrink-0"
                      />
                      <div className="flex min-w-0 flex-col gap-2">
                        <p className="text-sm font-semibold break-all text-slate-900">
                          {voucher.voucherId}
                        </p>
                        <span
                          className={cn(
                            "inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-medium",
                            voucher.isPrint
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          )}
                        >
                          {voucher.isPrint ? "Printed" : "Not printed"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No voucher generated for this order.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <footer className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50/60 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <StatusNotice status={dataOrder.status} />
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end lg:w-auto">
            {dataOrder.status === "pending" && (
              <Button
                color="success"
                size="md"
                startContent={
                  <LuCircleCheck className="size-4" aria-hidden="true" />
                }
                className="w-full font-medium sm:w-auto"
                isDisabled={isPendingUpdateStatus}
                onPress={() => handleOpenStatusModal("completed")}
              >
                Mark as Completed
              </Button>
            )}
            {dataOrder.status === "pending" && (
              <Button
                color="danger"
                variant="bordered"
                size="md"
                startContent={<LuBan className="size-4" aria-hidden="true" />}
                className="w-full font-medium sm:w-auto"
                isDisabled={isPendingUpdateStatus}
                onPress={() => handleOpenStatusModal("cancelled")}
              >
                Cancel Order
              </Button>
            )}
            {dataOrder.status === "cancelled" && (
              <Button
                color="warning"
                variant="bordered"
                size="md"
                startContent={
                  <LuRotateCcw className="size-4" aria-hidden="true" />
                }
                className="w-full font-medium sm:w-auto"
                isDisabled={isPendingUpdateStatus}
                onPress={() => handleOpenStatusModal("pending")}
              >
                Set to Pending
              </Button>
            )}
          </div>
        </footer>
      </section>

      <DeleteTransactionModal
        {...deleteTransactionModal}
        refetchTransaction={handleAfterDelete}
        selectedTransaction={dataOrder}
      />

      <Modal
        isOpen={updateStatusModal.isOpen}
        onOpenChange={nextOpen => {
          if (!nextOpen) {
            handleCloseStatusModal();
          }
        }}
        placement="center"
        isDismissable={!isPendingUpdateStatus}
      >
        <ModalContent className="m-4">
          <ModalHeader>Update Transaction Status</ModalHeader>
          <ModalBody className="gap-4">
            <p className="text-medium">
              {nextStatus ? STATUS_ACTION_META[nextStatus].confirmation : ""}
            </p>
            <InlineErrorAlert
              title="Unable to update transaction"
              message={errorMessage}
            />
          </ModalBody>
          <ModalFooter className="flex-col gap-2 sm:flex-row">
            <Button
              color="default"
              variant="flat"
              isDisabled={isPendingUpdateStatus}
              className="w-full sm:w-auto"
              onPress={handleCloseStatusModal}
            >
              Cancel
            </Button>
            <Button
              color={
                nextStatus
                  ? STATUS_ACTION_META[nextStatus].buttonColor
                  : "success"
              }
              isLoading={isPendingUpdateStatus}
              isDisabled={!nextStatus || isPendingUpdateStatus}
              className="w-full sm:w-auto"
              onPress={handleConfirmStatus}
            >
              {nextStatus ? STATUS_ACTION_META[nextStatus].label : "Confirm"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DetailTransaction;
