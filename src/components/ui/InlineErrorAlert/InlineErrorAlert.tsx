import { cn } from "@/utils/cn";
import { Alert } from "@heroui/react";

interface InlineErrorAlertProps {
  title?: string;
  message?: string | null;
  className?: string;
}

const InlineErrorAlert = (props: InlineErrorAlertProps) => {
  const { title = "Something went wrong", message, className } = props;

  if (!message) return null;

  return (
    <Alert
      color="danger"
      variant="flat"
      title={title}
      description={message}
      className={cn("text-sm", className)}
    />
  );
};

export default InlineErrorAlert;
