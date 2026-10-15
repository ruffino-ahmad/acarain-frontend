import { AxiosError } from "axios";

export interface ApiErrorBody {
  message?: string;
  data?: {
    field: string;
    message: string;
  }[];
}

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
