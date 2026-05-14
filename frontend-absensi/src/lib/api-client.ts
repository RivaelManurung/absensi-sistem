import axios from "axios";
import Cookies from "js-cookie";
import { env } from "./env";

const AUTH_COOKIE_NAME = "access_token";

function getAccessToken() {
  const cookieToken = Cookies.get(AUTH_COOKIE_NAME);
  if (cookieToken) {
    return cookieToken;
  }

  if (typeof document === "undefined") {
    return null;
  }

  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${AUTH_COOKIE_NAME}=`))
    ?.split("=")[1] ?? null;
}

const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized globally
      Cookies.remove(AUTH_COOKIE_NAME);
      Cookies.remove("user_role");
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
