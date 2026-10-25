import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import ticketServices from "@/services/ticket.service";
import type { ITicket, IUpdateTicket } from "@/types/Ticket";
import { extractErrorField, extractErrorMessage } from "@/utils/api-error";
import toast from "@/utils/toast";
import { useEffect, useState } from "react";

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

export type FormDataUpdateTicket = yup.InferType<typeof schema>;

const getDefaultValues = (ticket: ITicket | null): FormDataUpdateTicket => ({
  name: ticket?.name || "",
  price: ticket ? String(ticket.price) : "",
  quantity: ticket ? String(ticket.quantity) : "",
  description: ticket?.description || "",
});

interface UseUpdateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchTicket: () => void;
  selectedTicket: ITicket | null;
}

const useUpdateTicketModal = (props: UseUpdateTicketModalProps) => {
  const { isOpen, onClose, refetchTicket, selectedTicket } = props;
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<FormDataUpdateTicket>({
    resolver: yupResolver(schema),
    defaultValues: getDefaultValues(selectedTicket),
  });

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultValues(selectedTicket));
      setFormError(null);
    }
  }, [isOpen, selectedTicket, reset]);

  const { mutate: mutateUpdateTicket, isPending: isPendingMutateUpdateTicket } =
    useMutation({
      mutationFn: (data: FormDataUpdateTicket) => {
        if (!selectedTicket) {
          throw new Error("No ticket selected");
        }

        const payload: IUpdateTicket = {
          name: data.name,
          price: parseFloat(data.price),
          quantity: parseInt(data.quantity, 10),
          description: data.description,
        };
        return ticketServices.updateTicket(selectedTicket._id, payload);
      },
      onMutate() {
        setFormError(null);
      },
      onSuccess() {
        setFormError(null);
        toast.success("Ticket updated successfully");
        onClose();
        refetchTicket();
      },
      onError(error) {
        const details = extractErrorField(error);

        if (details.length > 0) {
          setFormError(null);
          details.forEach(detail => {
            if (!detail.field) {
              return;
            }
            setError(detail.field as keyof FormDataUpdateTicket, {
              message: detail.message,
            });
          });
          return;
        }

        setFormError(extractErrorMessage(error));
      },
    });

  const handleUpdateTicket = (data: FormDataUpdateTicket) => {
    clearErrors();
    setFormError(null);
    mutateUpdateTicket(data);
  };

  const handleClose = () => {
    setFormError(null);
    reset(getDefaultValues(selectedTicket));
    onClose();
  };

  return {
    control,
    handleSubmit,
    errors,
    formError,
    handleUpdateTicket,
    handleClose,
    isPendingMutateUpdateTicket,
  };
};

export default useUpdateTicketModal;
