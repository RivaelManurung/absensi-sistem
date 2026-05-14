import { apiClient } from '@/lib/api/api-client';
import { Employee } from './types/employee.type';
import { EmployeeFormValues } from './schemas/employee.schema';

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

export const employeeService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Employee>> => {
    const { data } = await apiClient.get('/admin/employees', { params });
    return data;
  },

  getById: async (id: string): Promise<SingleResponse<Employee>> => {
    const { data } = await apiClient.get(`/admin/employees/${id}`);
    return data;
  },

  create: async (payload: EmployeeFormValues): Promise<SingleResponse<Employee>> => {
    const { data } = await apiClient.post('/admin/employees', payload);
    return data;
  },

  update: async (id: string, payload: Partial<EmployeeFormValues>): Promise<SingleResponse<Employee>> => {
    const { data } = await apiClient.put(`/admin/employees/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/employees/${id}`);
  }
};
