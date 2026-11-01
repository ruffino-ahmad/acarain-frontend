import environment from "@/config/environment";
import axios from "axios";

// Tanpa interceptor sesi. Dipakai dari server next-auth (refresh & logout):
// kalau memakai `instance`, interceptornya memanggil getSession() lagi
// sehingga callback jwt terpanggil berulang tanpa henti.
const plainInstance = axios.create({
  baseURL: environment.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60 * 1000, // 60 seconds
});

export default plainInstance;
