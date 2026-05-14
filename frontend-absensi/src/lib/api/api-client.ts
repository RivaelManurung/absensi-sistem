import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getCookie, deleteCookie } from 'cookies-next';

const AUTH_COOKIE_NAME = 'access_token';

function getAccessToken() {
  const cookieToken = getCookie(AUTH_COOKIE_NAME);
  if (cookieToken) {
    return String(cookieToken);
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${AUTH_COOKIE_NAME}=`))
    ?.split('=')[1] ?? null;
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Try to get token from cookies
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Unpack generic backend response wrapper if needed
    // Our backend returns { code: 200, message: "...", data: ... }
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Handle 401 Unauthorized globally
      if (error.response.status === 401) {
        // Clear token and redirect if in browser
        deleteCookie(AUTH_COOKIE_NAME);
        deleteCookie('user_role');
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
