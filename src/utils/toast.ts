import { addToast } from "@heroui/react";

const toast = {
  success: (message: string) => addToast({ color: "success", title: message }),
  error: (message: string) => addToast({ color: "danger", title: message }),
  info: (message: string) => addToast({ color: "primary", title: message }),
  warning: (message: string) => addToast({ color: "warning", title: message }),
};

export default toast;