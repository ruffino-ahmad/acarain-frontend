import environment from "@/config/environment";
import { SessionExtended } from "@/types/Auth";
import axios from "axios";
import { getSession } from "next-auth/react";

const headers = {
  "Content-Type": "application/json",
};

const instance = axios.create({
  baseURL: environment.API_URL,
  headers,
  timeout: 60 * 1000, // 60 seconds
});

instance.interceptors.request.use(
  async request => {
    const session: SessionExtended | null = await getSession();
    if (session?.accessToken) {
      request.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return request;
  },
  error => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  Response => {
    return Response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;
