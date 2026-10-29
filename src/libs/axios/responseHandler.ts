import { AxiosError } from "axios";
import { signOut } from "next-auth/react";

interface ErrorResponseData {
  message: string;
}

const onErrorHandler = (error: Error) => {
  const { response } = error as AxiosError<ErrorResponseData>;
  const res = response?.data;

  if (response && res?.message === "Token has expired") {
    signOut();
  }
};

export { onErrorHandler };
