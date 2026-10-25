import { AxiosError } from "axios";

export interface ApiErrorBody {
  message?: string;
  code?: number;
  data?: {
    field: string;
    message: string;
  }[];
}

export const getErrorStatus = (error: unknown): number | undefined => {
  const axiosError = error as AxiosError<ApiErrorBody>;

  return axiosError?.response?.status ?? axiosError?.response?.data?.code;
};

export const extractErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<ApiErrorBody>;
  const body = axiosError?.response?.data;

  if (Array.isArray(body?.data) && body.data.length > 0) {
    return body.data.map(item => item.message).join(", ");
  }

  return body?.message || axiosError?.message || "Something went wrong";
};

export const extractErrorField = (error: unknown) => {
  const details = (error as AxiosError<ApiErrorBody>)?.response?.data?.data;
  return Array.isArray(details) ? details : [];
};
