import { apiClient } from '@/lib/api/api-client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'hr' | 'manager' | 'security' | 'employee';
  office_id: string;
  permissions?: string[];
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    user: User;
    permissions: string[];
  };
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: User;
}

export type RefreshResponse = LoginResponse;

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
    return data;
  },
  
  me: async (): Promise<MeResponse> => {
    const { data } = await apiClient.get<MeResponse>('/auth/me');
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refresh: async (refreshToken: string): Promise<RefreshResponse> => {
    const { data } = await apiClient.post<RefreshResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return data;
  },
};
