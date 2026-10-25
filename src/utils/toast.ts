import { addToast } from "@heroui/react";

const ERROR_TIMEOUT = 8000;
const DEFAULT_ERROR_TITLE = "Something went wrong";

const toast = {
  success: (message: string) => addToast({ color: "success", title: message }),
  error: (message: string, description?: string) => {
    const safeMessage = message.trim() || DEFAULT_ERROR_TITLE;
    const safeDescription = description?.trim();

    return addToast({
      color: "danger",
      title: safeDescription ? safeMessage : DEFAULT_ERROR_TITLE,
      description: safeDescription || safeMessage,
      timeout: ERROR_TIMEOUT,
    });
  },
  info: (message: string) => addToast({ color: "primary", title: message }),
  warning: (message: string) => addToast({ color: "warning", title: message }),
};

export default toast;