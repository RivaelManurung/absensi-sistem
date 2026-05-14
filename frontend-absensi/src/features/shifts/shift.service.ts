import { apiClient } from '@/lib/api/api-client';
import { Shift } from './types/shift.type';
import { ShiftFormValues } from './schemas/shift.schema';

export interface PaginatedResponse<T> {
  code: number;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface SingleResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const shiftService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Shift>> => {
    const { data } = await apiClient.get('/admin/shifts', { params });
    return data;
  },

  getById: async (id: string): Promise<SingleResponse<Shift>> => {
    const { data } = await apiClient.get(`/admin/shifts/${id}`);
    return data;
  },

  create: async (payload: ShiftFormValues): Promise<SingleResponse<Shift>> => {
    const { data } = await apiClient.post('/admin/shifts', payload);
    return data;
  },

  update: async (id: string, payload: Partial<ShiftFormValues>): Promise<SingleResponse<Shift>> => {
    const { data } = await apiClient.put(`/admin/shifts/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/shifts/${id}`);
  }
};
