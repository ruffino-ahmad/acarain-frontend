import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import ticketServices from "@/services/ticket.service";
import type { ICreateTicket } from "@/types/Ticket";
import {
  ApiErrorBody,
  extractErrorField,
  extractErrorMessage,
} from "@/utils/api-error";
import toast from "@/utils/toast";

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Ticket name must be at least 2 characters long")
    .max(100, "Ticket name cannot exceed 100 characters")
    .required("Please enter name"),
  price: yup
    .string()
    .trim()
    .required("Please enter price")
    .matches(
      /^\d+(\.\d{1,2})?$/,
      "Price must be a valid number with up to 2 decimal places"
    ),
  quantity: yup
    .string()
    .trim()
    .required("Please enter quantity")
    .test("min", "Quantity must be at least 1", value => {
      const quantity = parseInt(value || "0", 10);
      return quantity >= 1;
    }),
  description: yup
    .string()
    .trim()
    .min(3, "Description must be at least 3 characters long")
    .max(100, "Description cannot exceed 100 characters")
    .required("Please enter description"),
});

export type FormDataAddTicket = yup.InferType<typeof schema>;

interface UseAddTicketModalProps {
  eventId: string;
  onClose: () => void;
  refetchTicket: () => void;
}

const useAddTicketModal = (props: UseAddTicketModalProps) => {
  const { eventId, onClose, refetchTicket } = props;

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormDataAddTicket>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      price: "",
      quantity: "",
      description: "",
    },
  });

  const { mutate: mutateAddTicket, isPending: isPendingMutateAddTicket } =
    useMutation({
      mutationFn: (data: FormDataAddTicket) => {
        const payload: ICreateTicket = {
          name: data.name,
          price: parseFloat(data.price),
          quantity: parseInt(data.quantity, 10),
          description: data.description,
          events: eventId,
        };
        return ticketServices.createTicket(payload);
      },
      onSuccess() {
        toast.success("Ticket created successfully");
        reset();
        onClose();
        refetchTicket();
      },
      onError(error) {
        toast.error(extractErrorMessage(error));

        extractErrorField(error).forEach(detail => {
          if (!detail.field) {
            return;
          }
          setError(detail.field as keyof FormDataAddTicket, {
            message: detail.message,
          });
        });
      },
    });

  const handleAddTicket = (data: FormDataAddTicket) => {
    mutateAddTicket(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return {
    control,
    handleSubmit,
    errors,
    handleAddTicket,
    handleClose,
    isPendingMutateAddTicket,
  };
};

export default useAddTicketModal;
