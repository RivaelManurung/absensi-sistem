import apiClient from "@/lib/api-client";
import { Employee, CreateEmployeePayload, UpdateEmployeePayload } from "../types/employee.type";

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
  getAll: async (params?: any) => {
    const response = await apiClient.get<PaginatedResponse<Employee>>("/admin/employees", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<SingleResponse<Employee>>(`/admin/employees/${id}`);
    return response.data;
  },

  create: async (payload: CreateEmployeePayload) => {
    const response = await apiClient.post<SingleResponse<Employee>>("/admin/employees", payload);
    return response.data;
  },

  update: async (id: string, payload: UpdateEmployeePayload) => {
    const response = await apiClient.put<SingleResponse<Employee>>(`/admin/employees/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/admin/employees/${id}`);
    return response.data;
  },
};
