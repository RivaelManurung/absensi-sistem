import { apiClient } from '@/lib/api/api-client';
import { Office } from './types/office.type';
import { OfficeFormValues } from './schemas/office.schema';

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

export const officeService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Office>> => {
    const { data } = await apiClient.get('/admin/offices', { params });
    return data;
  },

  getById: async (id: string): Promise<SingleResponse<Office>> => {
    const { data } = await apiClient.get(`/admin/offices/${id}`);
    return data;
  },

  create: async (payload: OfficeFormValues): Promise<SingleResponse<Office>> => {
    const { data } = await apiClient.post('/admin/offices', payload);
    return data;
  },

  update: async (id: string, payload: Partial<OfficeFormValues>): Promise<SingleResponse<Office>> => {
    const { data } = await apiClient.put(`/admin/offices/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/offices/${id}`);
  }
};
