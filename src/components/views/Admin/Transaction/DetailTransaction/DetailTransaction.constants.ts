import type { IconType } from "react-icons";
import {
  LuCircleAlert,
  LuCircleCheck,
  LuCircleX,
  LuClock,
  LuInfo,
} from "react-icons/lu";

import type { IOrder } from "@/types/Order";

import type { OrderStatusAction } from "./useDetailTransaction";

interface StatusMeta {
  label: string;
  icon: IconType;
  noticeIcon: IconType;
  badgeClassName: string;
  noticeClassName: string;
  message: string;
}

export const STATUS_META: Record<IOrder["status"], StatusMeta> = {
  pending: {
    label: "Pending",
    icon: LuClock,
    noticeIcon: LuInfo,
    badgeClassName: "bg-amber-50 text-amber-700 ring-amber-200",
    noticeClassName: "border-amber-200 bg-amber-50 text-amber-800",
    message: "This order is currently in pending status.",
  },
  completed: {
    label: "Completed",
    icon: LuCircleCheck,
    noticeIcon: LuCircleCheck,
    badgeClassName: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    noticeClassName: "border-emerald-200 bg-emerald-50 text-emerald-800",
    message: "This order has been completed successfully.",
  },
  cancelled: {
    label: "Cancelled",
    icon: LuCircleX,
    noticeIcon: LuCircleAlert,
    badgeClassName: "bg-red-50 text-red-700 ring-red-200",
    noticeClassName: "border-red-200 bg-red-50 text-red-800",
    message: "This order has been cancelled.",
  },
};

interface StatusActionMeta {
  label: string;
  buttonColor: "success" | "danger" | "warning";
  confirmation: string;
}

export const STATUS_ACTION_META: Record<OrderStatusAction, StatusActionMeta> = {
  completed: {
    label: "Completed",
    buttonColor: "success",
    confirmation:
      "Mark this transaction as completed? Voucher codes will be generated for the buyer.",
  },
  cancelled: {
    label: "Cancelled",
    buttonColor: "danger",
    confirmation:
      "Cancel this transaction? The ticket stock will be returned to the event.",
  },
  pending: {
    label: "Pending",
    buttonColor: "warning",
    confirmation:
      "Reopen this transaction as pending? The ticket stock will be deducted again.",
  },
};
