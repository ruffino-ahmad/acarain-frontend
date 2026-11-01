import { AxiosError } from "axios";
import { signOut } from "next-auth/react";
import { getSessionExpiredRedirect } from "@/utils/auth-redirect";

interface ErrorResponseData {
  message: string;
}

const onErrorHandler = (error: Error) => {
  const { response } = error as AxiosError<ErrorResponseData>;
  const res = response?.data;

  if (response && res?.message === "Token has expired") {
    const currentPath =
      typeof window === "undefined"
        ? "/"
        : `${window.location.pathname}${window.location.search}`;

    signOut({ callbackUrl: getSessionExpiredRedirect(currentPath) });
  }
};

export { onErrorHandler };
