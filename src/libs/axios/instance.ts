import environment from "@/config/environment";
import axios from "axios";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

interface CustomSession extends Session {
  accessToken?: string;
}

const headers = {
  "Content-Type": "application/json",
};

const instance = axios.create({
  baseURL: environment.API_URL,
  headers,
  timeout: 60 * 1000, // 60 seconds
});

instance.interceptors.request.use(
  async (request) => {
    const session: CustomSession | null = await getSession();
    if (session?.accessToken) {
      request.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (Response) => {
    return Response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default instance;
