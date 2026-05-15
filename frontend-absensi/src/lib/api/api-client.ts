import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const AUTH_COOKIE_NAME = 'access_token';
const REFRESH_COOKIE_NAME = 'refresh_token';
const ROLE_COOKIE_NAME = 'user_role';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

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
        const originalRequest = error.config as RetryableRequestConfig | undefined;
        const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') || originalRequest?.url?.includes('/auth/refresh');
        const refreshToken = getCookie(REFRESH_COOKIE_NAME);

        if (originalRequest && !originalRequest._retry && !isAuthEndpoint && refreshToken) {
          originalRequest._retry = true;
          return axios
            .post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/auth/refresh`,
              { refresh_token: String(refreshToken) },
              { headers: { 'Content-Type': 'application/json' } }
            )
            .then((refreshResponse) => {
              const data = refreshResponse.data?.data;
              if (!data?.access_token) {
                return Promise.reject(error);
              }

              setCookie(AUTH_COOKIE_NAME, data.access_token, { maxAge: 60 * 60 * 12 });
              if (data.refresh_token) setCookie(REFRESH_COOKIE_NAME, data.refresh_token, { maxAge: 60 * 60 * 24 * 7 });
              if (data.user?.role) setCookie(ROLE_COOKIE_NAME, data.user.role, { maxAge: 60 * 60 * 12 });

              originalRequest.headers.set?.("Authorization", `Bearer ${data.access_token}`);
              originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
              return apiClient(originalRequest);
            })
            .catch(() => {
              clearAuthAndRedirect();
              return Promise.reject(error);
            });
        }

        clearAuthAndRedirect();
      }
    }
    return Promise.reject(error);
  }
);

function clearAuthAndRedirect() {
  deleteCookie(AUTH_COOKIE_NAME);
  deleteCookie(REFRESH_COOKIE_NAME);
  deleteCookie(ROLE_COOKIE_NAME);
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}
